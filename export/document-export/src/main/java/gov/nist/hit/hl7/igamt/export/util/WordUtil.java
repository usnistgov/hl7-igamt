/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.export.util;


import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.namespace.QName;

import org.apache.commons.io.FileUtils;
import org.docx4j.XmlUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.dml.CTPositiveSize2D;
import org.docx4j.dml.wordprocessingDrawing.Inline;
import org.docx4j.jaxb.Context;
import org.docx4j.model.fields.FieldUpdater;
import org.docx4j.openpackaging.contenttype.CTOverride;
import org.docx4j.openpackaging.contenttype.ContentTypeManager;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.Part;
import org.docx4j.openpackaging.parts.WordprocessingML.BinaryPartAbstractImage;
import org.docx4j.openpackaging.parts.WordprocessingML.DocumentSettingsPart;
import org.docx4j.openpackaging.parts.WordprocessingML.FooterPart;
import org.docx4j.openpackaging.parts.relationships.Namespaces;
import org.docx4j.openpackaging.parts.relationships.RelationshipsPart;
import org.docx4j.relationships.Relationship;
import org.docx4j.wml.BooleanDefaultTrue;
import org.docx4j.wml.Br;
import org.docx4j.wml.CTRel;
import org.docx4j.wml.CTSettings;
import org.docx4j.wml.ContentAccessor;
import org.docx4j.wml.Drawing;
import org.docx4j.wml.FldChar;
import org.docx4j.wml.Jc;
import org.docx4j.wml.JcEnumeration;
import org.docx4j.wml.ObjectFactory;
import org.docx4j.wml.P;
import org.docx4j.wml.PPr;
import org.docx4j.wml.R;
import org.docx4j.wml.STBrType;
import org.docx4j.wml.STFldCharType;
import org.docx4j.wml.Tbl;
import org.docx4j.wml.Text;
import org.docx4j.wml.Tr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.tidy.Tidy;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;


/**
 *
 * @author Maxence Lefort on May 17, 2018.
 */
public class WordUtil {

  private static Logger logger = LoggerFactory.getLogger(WordUtil.class);
  private static final int MAX_IMAGE_WIDTH_EMU = 6000000;

  public static ExportedFile convertHtmlToWord(ExportedFile exportedFile, DocumentMetadata metadata,
      Date dateUpdated, String hl7Version) throws ExportException {
    try {
      WordprocessingMLPackage wordMLPackage =
          WordprocessingMLPackage.load(WordUtil.class.getResourceAsStream("/lri_template.docx"));
      ObjectFactory factory = Context.getWmlObjectFactory();
      SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm");
      String formattedDateUpdated = dateUpdated != null ? simpleDateFormat.format(dateUpdated) : "" ;
      createCoverPageForDocx4j(wordMLPackage, factory, metadata, formattedDateUpdated,
         metadata != null && metadata.getCoverPicture() != null ? metadata.getCoverPicture() : "", hl7Version);
      createTableOfContentForDocx4j(wordMLPackage, factory);
      FieldUpdater updater = new FieldUpdater(wordMLPackage);
      updater.update(true);
      // TODO add appInfo version
      // replaceVersionInFooter(wordMLPackage,appInfo.getVersion());
      String html = cleanHtml(exportedFile.getContent()).toString();
      XHTMLImporterImpl xHTMLImporter = new XHTMLImporterImpl(wordMLPackage);
      wordMLPackage.getMainDocumentPart().getContent().addAll(xHTMLImporter.convert(html, null));
      List<Object> nodes =
          getAllElementFromObject(wordMLPackage.getMainDocumentPart(), org.docx4j.wml.Tbl.class);
      BooleanDefaultTrue bdt = Context.getWmlObjectFactory().createBooleanDefaultTrue();
      for (Object node : nodes) {
        if (node instanceof Tbl) {
          Tbl tbl = (Tbl) node;
          if (tbl.getContent().get(0) instanceof Tr) {
            Tr tr = (Tr) tbl.getContent().get(0);
            tr.getTrPr().getCnfStyleOrDivIdOrGridBefore()
                .add(Context.getWmlObjectFactory().createCTTrPrBaseTblHeader(bdt));
          }
        }
      }
      nodes = getAllElementFromObject(wordMLPackage.getMainDocumentPart(),
          org.docx4j.wml.Drawing.class);
      for (Object node : nodes) {
        if (node instanceof Drawing) {
          Drawing drawing = (Drawing) node;
          CTPositiveSize2D currentSize = ((Inline) drawing.getAnchorOrInline().get(0)).getExtent();
          if (currentSize.getCx() > MAX_IMAGE_WIDTH_EMU) {
            CTPositiveSize2D size = new CTPositiveSize2D();
            size.setCy(currentSize.getCy() * MAX_IMAGE_WIDTH_EMU / currentSize.getCx());
            size.setCx(MAX_IMAGE_WIDTH_EMU);
            ((Inline) drawing.getAnchorOrInline().get(0)).setExtent(size);
          }
        }
      }
      loadTemplateForDocx4j(wordMLPackage);
      File tmpFile;
      tmpFile = File.createTempFile("IgDocument" + UUID.randomUUID().toString(), ".docx");
      wordMLPackage.save(tmpFile);
      exportedFile.setContent(FileUtils.openInputStream(tmpFile));
      return exportedFile;
    } catch (Docx4JException | IOException e) {
      throw new ExportException(e);
    }
  }

  private static void createCoverPageForDocx4j(WordprocessingMLPackage wordMLPackage,
      ObjectFactory factory, DocumentMetadata metadata, String dateUpdated, String coverPicturePath,
      String hl7Version) {

    BufferedImage image = null;
    try {
      if (coverPicturePath != null && !coverPicturePath.isEmpty()) {
        InputStream imgis;
        byte[] bytes = null;
        String filename = parseFileName(coverPicturePath);
        // TODO add cover image
        // GridFSDBFile dbFile = fileStorageService.findOneByFilename(filename);
        // if (dbFile != null) {
        // imgis = dbFile.getInputStream();
        // bytes = IOUtils.toByteArray(imgis);
        // }
        // if (bytes != null && bytes.length > 0) {
        // addImageToPackage(wordMLPackage, bytes);
        // }
      }
    } catch (Exception e) {
      logger.warn("Unable to add image");
      e.printStackTrace();
    }

    if (null != metadata) {
      if (null != metadata.getTitle()) {
        wordMLPackage.getMainDocumentPart().addStyledParagraphOfText("Title", metadata.getTitle());
        addLineBreak(wordMLPackage, factory);
      }
      if (null != metadata.getSubTitle() && !metadata.getSubTitle().isEmpty()) {
        wordMLPackage.getMainDocumentPart().addStyledParagraphOfText("Subtitle",
            metadata.getSubTitle());
      }
    }
    if (null != dateUpdated && !dateUpdated.isEmpty()) {
      wordMLPackage.getMainDocumentPart().addStyledParagraphOfText("Style1", dateUpdated);
    }
    addLineBreak(wordMLPackage, factory);
    addLineBreak(wordMLPackage, factory);
    if (null != hl7Version && !"".equals(hl7Version)) {
      wordMLPackage.getMainDocumentPart().addStyledParagraphOfText("Style1",
          "HL7 Version " + hl7Version);
    }
    if (null != metadata && null != metadata.getOrgName() && !"".equals(metadata.getOrgName())) {
      wordMLPackage.getMainDocumentPart().addStyledParagraphOfText("Style1", metadata.getOrgName());
    }

    addPageBreak(wordMLPackage, factory);
  }

  protected static String parseFileName(String coverPicture) {
    if (coverPicture.startsWith("name=")) {
      return coverPicture.substring(coverPicture.indexOf("name=") + "name=".length());
    }
    return "";
  }

  private static void addImageToPackage(WordprocessingMLPackage wordMLPackage, byte[] bytes)
      throws Exception {
    BinaryPartAbstractImage imagePart =
        BinaryPartAbstractImage.createImagePart(wordMLPackage, bytes);
    int docPrId = 1;
    int cNvPrId = 2;
    Inline inline =
        imagePart.createImageInline("Filename hint", "Alternative text", docPrId, cNvPrId, false);
    P paragraph = addInlineImageToParagraph(inline);
    setHorizontalAlignment(paragraph, JcEnumeration.CENTER);
    wordMLPackage.getMainDocumentPart().addObject(paragraph);
  }

  private static P addInlineImageToParagraph(Inline inline) {
    // Now add the in-line image to a paragraph
    ObjectFactory factory = new ObjectFactory();
    P paragraph = factory.createP();
    R run = factory.createR();
    paragraph.getContent().add(run);
    Drawing drawing = factory.createDrawing();
    run.getContent().add(drawing);
    drawing.getAnchorOrInline().add(inline);
    return paragraph;
  }

  private static void addLineBreak(WordprocessingMLPackage wordMLPackage, ObjectFactory factory) {
    Br breakObj = new Br();
    breakObj.setType(STBrType.TEXT_WRAPPING);

    P paragraph = factory.createP();
    paragraph.getContent().add(breakObj);
    wordMLPackage.getMainDocumentPart().getContent().add(paragraph);
  }

  private static void addPageBreak(WordprocessingMLPackage wordMLPackage, ObjectFactory factory) {
    Br breakObj = new Br();
    breakObj.setType(STBrType.PAGE);

    P paragraph = factory.createP();
    paragraph.getContent().add(breakObj);
    wordMLPackage.getMainDocumentPart().getContent().add(paragraph);
  }

  @SuppressWarnings({"rawtypes", "unchecked"})
  public static JAXBElement getWrappedFldChar(FldChar fldchar) {
    return new JAXBElement(new QName(Namespaces.NS_WORD12, "fldChar"), FldChar.class, fldchar);
  }

  private static void setHorizontalAlignment(P paragraph, JcEnumeration hAlign) {
    if (hAlign != null) {
      PPr pprop = new PPr();
      Jc align = new Jc();
      align.setVal(hAlign);
      pprop.setJc(align);
      paragraph.setPPr(pprop);
    }
  }

  public static List<Object> getAllElementFromObject(Object obj, Class<?> toSearch) {
    List<Object> result = new ArrayList<Object>();
    if (obj instanceof JAXBElement)
      obj = ((JAXBElement<?>) obj).getValue();

    if (obj.getClass().equals(toSearch))
      result.add(obj);
    else if (obj instanceof ContentAccessor) {
      List<?> children = ((ContentAccessor) obj).getContent();
      for (Object child : children) {
        result.addAll(getAllElementFromObject(child, toSearch));
      }
    }
    return result;
  }

  public void replaceVersionInFooter(WordprocessingMLPackage wordMLPackage, String version) {
    RelationshipsPart rp = wordMLPackage.getMainDocumentPart().getRelationshipsPart();
    List<Relationship> rels = rp.getRelationshipsByType(Namespaces.FOOTER);
    for (Relationship rel : rels) {
      Part p = rp.getPart(rel);
      if (p instanceof FooterPart) {
        FooterPart footerPart = (FooterPart) p;
        // footerPart.getJaxbElement().getContent()
        List<Object> textNodes = getAllElementFromObject(footerPart, Text.class);
        for (Object node : textNodes) {
          if (node instanceof Text) {
            Text text = (Text) node;
            if (text.getValue().contains("[IG_VERSION]")) {
              text.setValue(text.getValue().replace("[IG_VERSION]", version));
            }
          }
        }
        p.getContentLengthAsLoaded();
      }
    }

  }

  public static void createTableOfContentForDocx4j(WordprocessingMLPackage wordMLPackage,
      ObjectFactory factory) {
    P paragraphForTOC = factory.createP();
    R r = factory.createR();

    FldChar fldchar = factory.createFldChar();
    fldchar.setFldCharType(STFldCharType.BEGIN);
    fldchar.setDirty(true);
    r.getContent().add(getWrappedFldChar(fldchar));
    paragraphForTOC.getContent().add(r);

    R r1 = factory.createR();
    Text txt = new Text();
    txt.setSpace("preserve");
    txt.setValue("TOC \\o \"1-5\" \\h \\z \\u \\h");
    r.getContent().add(factory.createRInstrText(txt));
    paragraphForTOC.getContent().add(r1);

    FldChar fldcharend = factory.createFldChar();
    fldcharend.setFldCharType(STFldCharType.END);
    R r2 = factory.createR();
    r2.getContent().add(getWrappedFldChar(fldcharend));
    paragraphForTOC.getContent().add(r2);

    wordMLPackage.getMainDocumentPart().getContent().add(paragraphForTOC);
  }

  public static void loadTemplateForDocx4j(WordprocessingMLPackage wordMLPackage) {
    try {
      // Replace dotx content type with docx
      ContentTypeManager ctm = wordMLPackage.getContentTypeManager();

      // Get <Override PartName="/word/document.xml"
      // ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml"/>
      CTOverride override;
      override = ctm.getOverrideContentType().get(new URI("/word/document.xml"));
      override.setContentType(
          org.docx4j.openpackaging.contenttype.ContentTypes.WORDPROCESSINGML_DOCUMENT);

      // Create settings part, and init content
      DocumentSettingsPart dsp = new DocumentSettingsPart();
      CTSettings settings = Context.getWmlObjectFactory().createCTSettings();
      dsp.setJaxbElement(settings);
      wordMLPackage.getMainDocumentPart().addTargetPart(dsp);

      // Create external rel
      RelationshipsPart rp = RelationshipsPart.createRelationshipsPartForPart(dsp);
      org.docx4j.relationships.Relationship rel =
          new org.docx4j.relationships.ObjectFactory().createRelationship();
      rel.setType(Namespaces.ATTACHED_TEMPLATE);
      // String templatePath = "/rendering/lri_template.dotx";
      URL templateData = WordUtil.class.getResource("/lri_template.docx");
      rel.setTarget(templateData.getPath());
      rel.setTargetMode("External");
      rp.addRelationship(rel); // addRelationship sets the rel's @Id

      settings.setAttachedTemplate((CTRel) XmlUtils.unmarshalString(
          "<w:attachedTemplate xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:id=\""
              + rel.getId() + "\"/>",
          Context.jc, CTRel.class));

    } catch (URISyntaxException | JAXBException | Docx4JException e1) {
      e1.printStackTrace();
    }
  }

  private static ByteArrayOutputStream cleanHtml(InputStream html) {
    Properties oProps = new Properties();
    oProps.setProperty("new-blocklevel-tags", "figcaption");
    oProps.setProperty("char-encoding", "utf8");
    Tidy tidy = new Tidy();
    tidy.setConfigurationFromProps(oProps);
    tidy.setWraplen(Integer.MAX_VALUE);
    tidy.setDropEmptyParas(true);
    tidy.setXHTML(true);
    tidy.setShowWarnings(false); // to hide errors
    tidy.setQuiet(true); // to hide warning
    tidy.setMakeClean(true);
    tidy.setTidyMark(false);
    // tidy.setBreakBeforeBR(true);
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    tidy.parseDOM(html, outputStream);
    return outputStream;
  }




}
