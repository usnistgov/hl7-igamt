//package gov.nist.hit.hl7.igamt.web.export.service.impl;
//
//import java.io.ByteArrayOutputStream;
//import java.io.File;
//import java.io.IOException;
//import java.io.InputStream;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.zip.ZipOutputStream;
//
//import javax.xml.transform.TransformerException;
//
//import org.apache.commons.io.IOUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import com.google.common.io.Files;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.Link;
//import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryExportService;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
//import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
//import gov.nist.hit.hl7.igamt.export.exception.ExportException;
//import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;
//import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryPopulateObjectService;
//import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryWebExportService;
//import gov.nist.hit.hl7.igamt.web.export.util.BasicXsl;
//import gov.nist.hit.hl7.igamt.web.export.util.HtmlWriter;
//import gov.nist.hit.hl7.igamt.web.export.util.PageCreator;
//import gov.nist.hit.hl7.igamt.web.export.util.Tools;
//import gov.nist.hit.hl7.igamt.web.export.util.ZipOutputStreamClass;
//import gov.nist.hit.hl7.igamt.web.export.util.ZipUtils;
//
//@Component
//
//public class DatatypeLibraryWebExportServiceImpl implements DatatypeLibraryWebExportService {
//
//	Map<String, Datatype> datatypesMap = new HashMap<>();
//	Map<String, Datatype> derivedDatatypesMap = new HashMap<>();
//
//
//	@Autowired
//	DatatypeLibraryService datatypeLibraryService;
//
//	@Autowired
//	DatatypeLibraryPopulateObjectService datatypeLibraryPopulateObjectService;
//
//	@Autowired
//	DatatypeLibraryExportService datatypeLibraryExportServiceforHtml;
//
//	@Autowired
//	DatatypeService datatypeService;
//
//	@Autowired
//	MyExportObject myExportObject;
//
//	@Override
//	public ByteArrayOutputStream exportDatatypeLibraryToWeb(String username, String datatypeLibraryId)
//			throws ExportException {
//
//		DatatypeLibrary datatypeLibrary = datatypeLibraryService.findById(datatypeLibraryId);
//
//		ExportedFile exportedFile = datatypeLibraryExportServiceforHtml.exportDatatypeLibraryToHtml(username,
//				datatypeLibraryId);
//
//		ByteArrayOutputStream fos = new ByteArrayOutputStream();
//		ZipOutputStream zipStream = new ZipOutputStream(fos);
//
//		File websiteTemp = Files.createTempDir();
//
//		if (datatypeLibrary != null) {
//			try {
//
//				HtmlWriter hw = new HtmlWriter();
//				PageCreator pg = new PageCreator();
//				BasicXsl bx = new BasicXsl();
//				ZipOutputStreamClass zw = new ZipOutputStreamClass();
//
//				datatypesMap = initializeDatatypesMap(datatypeLibrary.getDatatypeRegistry());
//				derivedDatatypesMap = initializeDatatypesMap(datatypeLibrary.getDerivedRegistry());
//				datatypeLibraryPopulateObjectService.populateExportObject(datatypesMap);
//
//				System.out.println("Taille de datatypesmap est :" +datatypesMap.size());
//				System.out.println("Taille de derivedDatatypesMap est :" +derivedDatatypesMap.size());
//
//	
//				ZipUtils.ZipTheFile(zipStream, websiteTemp.getAbsolutePath(),
//						Tools.getFileFromResources("assets").getAbsolutePath());
//				String path = IOUtils.toString(exportedFile.getContent());
//				InputStream inputFile = exportedFile.getContent();
////
////				org.apache.commons.io.FileUtils.writeStringToFile(
////						new File(exportedFile.getFileName()), path);
//				ZipOutputStreamClass.addFileToZip(zipStream,"Pages/", "Narative.html", path);
//			
//				pg.generateLeafPageTable(myExportObject, zipStream);
//				pg.generateIndex(myExportObject, zipStream);
//				// System.out.println("Je suis apres generateIndex ");
//				//
//				hw.generateHtmlNameThenVersion(myExportObject, zipStream);
//				hw.generateHtmlVersionsThenName(myExportObject, zipStream);
//				zipStream.close();
//				websiteTemp.deleteOnExit();
//
//			} catch (DatatypeNotFoundException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (TransformerException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//
//			System.out.println("END-YB");
//		}
//		return fos;
//
//	}
//
//	public File createWebSiteStructure() {
//
//		String path1 = "/Users/ynb4/ExportV2/fileWebsitefortest";
//		File webSiteFile = new File(path1);
//
//		String path2 = webSiteFile.getAbsolutePath() + File.separator + "Pages";
//		File Pages = new File(webSiteFile, "Pages");
//
//
//
//		try {
//			webSiteFile.getParentFile().mkdirs();
//			webSiteFile.createNewFile();
//
//			Pages.getParentFile().mkdirs();
//			Pages.createNewFile();
//
//
//		} catch (IOException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		}
//
//		return webSiteFile;
//
//	}
//
//	private Map<String, Datatype> initializeDatatypesMap(Registry datatypeLibrary) throws DatatypeNotFoundException {
//		// Map<String,Datatype> datatypesMap = new HashMap<>();
//		for (Link datatypeLink : datatypeLibrary.getChildren()) {
//			if (datatypeLink != null && datatypeLink.getId() != null
//					&& !datatypesMap.containsKey(datatypeLink.getId())) {
//				Datatype datatype = datatypeService.findById(datatypeLink.getId());
//				if (datatype != null) {
//					datatypesMap.put(datatypeLink.getId(), datatype);
//				} else {
//					throw new DatatypeNotFoundException(datatypeLink.getId());
//				}
//			}
//		}
//		return datatypesMap;
//
//	}
//
//}
