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

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.UUID;

import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.io.FileUtils;

import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.domain.XSLTIncludeUriResolver;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
public class TransformationUtil {

  public static File doTransformToTempHtml(String xmlContent, String xsltPath, ExportParameters exportParameters) throws IOException, TransformerException {
    File tmpHtmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".html");
    // File tmpHtmlFile = new File("temp_" + UUID.randomUUID().toString() +
    // ".html");
    // Generate xml file containing profile
    File tmpXmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".xml");
    // File tmpXmlFile = new File("temp_" + UUID.randomUUID().toString() +
    // ".xml");
    FileUtils.writeStringToFile(tmpXmlFile, xmlContent, Charset.forName("UTF-8"));
    TransformerFactory factoryTf =  TransformerFactory.newInstance("org.apache.xalan.processor.TransformerFactoryImpl", null);
    factoryTf.setURIResolver(new XSLTIncludeUriResolver());
    Source xslt = new StreamSource(TransformationUtil.class.getResourceAsStream(xsltPath));
    Transformer transformer;
    // Apply XSL transformation on xml file to generate html
    transformer = factoryTf.newTransformer(xslt);
    // Set the parameters
    Map<String, String> exportPararMap = exportParameters.toMap();
    for (Map.Entry<String, String> param : exportPararMap.entrySet()) {
      if (param != null && param.getKey() != null && param.getValue() != null) {
        transformer.setParameter(param.getKey(), param.getValue());
      }
    }
    transformer.transform(new StreamSource(tmpXmlFile), new StreamResult(tmpHtmlFile));
    return tmpHtmlFile;
  }

}
