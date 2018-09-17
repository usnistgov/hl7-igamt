package gov.nist.hit.hl7.igamt.web.export.util;
import java.io.*;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.w3c.dom.*;
import org.xml.sax.*;

import gov.nist.hit.hl7.igamt.export.domain.XSLTIncludeUriResolver;
import gov.nist.hit.hl7.igamt.export.util.TransformationUtil;
import net.sf.saxon.TransformerFactoryImpl;

import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

public class BasicXsl {
    // This method applies the xslFilename to inFilename and writes
    // the output to outFilename.
    public  File transformUsingPath(String inFilename, String xslFilename) throws IOException, TransformerConfigurationException {
    	
    	
		File 	tmpHtmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".html");
		
        // File tmpHtmlFile = new File("temp_" + UUID.randomUUID().toString() +
        // ".html");
        // Generate xml file containing profile
        File tmpXmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".xml");
        // File tmpXmlFile = new File("temp_" + UUID.randomUUID().toString() +
        // ".xml");
        
//        Source source = new StreamSource(new FileInputStream(inFilename));
//        Result result = new StreamResult(new FileOutputStream(outFilename));
        
        FileUtils.writeStringToFile(tmpXmlFile, inFilename, Charset.forName("UTF-8"));
        TransformerFactory factoryTf = TransformerFactory.newInstance("net.sf.saxon.TransformerFactoryImpl", null);
        factoryTf.setURIResolver(new XSLTIncludeUriResolver());
        InputStream stream = TransformationUtil.class.getResourceAsStream(xslFilename);
        Source xslt = new StreamSource(stream);
        Transformer transformer;
        // Apply XSL transformation on xml file to generate html
        transformer = factoryTf.newTransformer(xslt);
        // Set the parameters
//        for (Map.Entry<String, String> param : exportParameters.toMap().entrySet()) {
//          if (param != null && param.getKey() != null && param.getValue() != null) {
//            transformer.setParameter(param.getKey(), param.getValue());
//          }
//        }
        try {
			transformer.transform(new StreamSource(inFilename), new StreamResult(tmpHtmlFile));
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return tmpHtmlFile;
      
    	
    	
    	
    	

//        File tmpHtmlFile = null;
//		try {
//			tmpHtmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".html");
//		
//        // File tmpHtmlFile = new File("temp_" + UUID.randomUUID().toString() +
//        // ".html");
//        // Generate xml file containing profile
//        File tmpXmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".xml");
//        // File tmpXmlFile = new File("temp_" + UUID.randomUUID().toString() +
//        // ".xml");
//        
//        Source source = new StreamSource(new FileInputStream(inFilename));
//        Result result = new StreamResult(new FileOutputStream(outFilename));
//        
//        FileUtils.writeStringToFile(tmpXmlFile, source.toString(), Charset.forName("UTF-8"));
//        TransformerFactory factoryTf = new TransformerFactoryImpl();
//        factoryTf.setURIResolver(new XSLTIncludeUriResolver());
//        InputStream stream = TransformationUtil.class.getResourceAsStream(xslFilename);
//        Source xslt = new StreamSource(stream);
//        Transformer transformer;
//        // Apply XSL transformation on xml file to generate html
//        transformer = factoryTf.newTransformer(xslt);
//        // Set the parameters
////        for (Map.Entry<String, String> param : exportParameters.toMap().entrySet()) {
////          if (param != null && param.getKey() != null && param.getValue() != null) {
////            transformer.setParameter(param.getKey(), param.getValue());
////          }
////        }
//        transformer.transform(new StreamSource(tmpXmlFile), new StreamResult(tmpHtmlFile));
//        
//		} catch (IOException | TransformerException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//        return tmpHtmlFile.getPath();
      
    	
    	
//        try {
//            // Create transformer factory
//            TransformerFactory factory = new net.sf.saxon.TransformerFactoryImpl();
////            		TransformerFactory.newInstance( "org.apache.xalan.processor.TransformerFactoryImpl", null);
//
//            // Use the factory to create a template containing the xsl file
//            Transformer transformer = factory.newTransformer(new StreamSource(
//                new FileInputStream(xslFilename)));
//
//            // Use the template to create a transformer
////            Transformer xformer = template.newTransformer();
//
//            // Prepare the input and output files
//            Source source = new StreamSource(new FileInputStream(inFilename));
//            Result result = new StreamResult(new FileOutputStream(outFilename));
//            
//
//            // Apply the xsl file to the source file and write the result
//            // to the output file
//            transformer.transform(source, result);
////            System.out.println("REEEEEEEEESULT " +result);
//
//        } catch (FileNotFoundException e) {
//        } catch (TransformerConfigurationException e) {
//            // An error occurred in the XSL file
//        } catch (TransformerException e) {
//            // An error occurred while applying the XSL file
//            // Get location of error in input file
//            SourceLocator locator = e.getLocator();
//            int col = locator.getColumnNumber();
//            int line = locator.getLineNumber();
//            String publicId = locator.getPublicId();
//            String systemId = locator.getSystemId();
//        }
//        return outFilename;
    	

//  try {
//
//    TransformerFactory tFactory = TransformerFactory.newInstance();
//
//    Transformer transformer =
//      tFactory.newTransformer
//         (new javax.xml.transform.stream.StreamSource
//            (xslFilename));
//
//    transformer.transform
//      (new javax.xml.transform.stream.StreamSource
//            (inFilename),
//       new javax.xml.transform.stream.StreamResult
//            ( new FileOutputStream(outFilename)));
//    }
//  catch (Exception e) {
//    e.printStackTrace( );
//    }
  
    }
    
    
public  File transformUsingString(String inFilename, String xslFilename) throws IOException, TransformerConfigurationException {
    	
    	
		File 	tmpHtmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".html");
		
        // File tmpHtmlFile = new File("temp_" + UUID.randomUUID().toString() +
        // ".html");
        // Generate xml file containing profile
        File tmpXmlFile = File.createTempFile("temp" + UUID.randomUUID().toString(), ".xml");
        // File tmpXmlFile = new File("temp_" + UUID.randomUUID().toString() +
        // ".xml");
        
//        Source source = new StreamSource(new FileInputStream(inFilename));
//        Result result = new StreamResult(new FileOutputStream(outFilename));
        
        FileUtils.writeStringToFile(tmpXmlFile, inFilename, Charset.forName("UTF-8"));
        TransformerFactory factoryTf = TransformerFactory.newInstance("net.sf.saxon.TransformerFactoryImpl", null);
        factoryTf.setURIResolver(new XSLTIncludeUriResolver());
        InputStream stream = TransformationUtil.class.getResourceAsStream(xslFilename);
        Source xslt = new StreamSource(stream);
        Transformer transformer;
        // Apply XSL transformation on xml file to generate html
        transformer = factoryTf.newTransformer(xslt);
        // Set the parameters
//        for (Map.Entry<String, String> param : exportParameters.toMap().entrySet()) {
//          if (param != null && param.getKey() != null && param.getValue() != null) {
//            transformer.setParameter(param.getKey(), param.getValue());
//          }
//        }
        try {
			transformer.transform(new StreamSource(tmpXmlFile), new StreamResult(tmpHtmlFile));
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return tmpHtmlFile;
}
    
    
    
    public String BuildXMLfromMap(Map<String,String> allDatatypesExceptTheOne) {
		String allDatatypes = "<Datatypes>";
    	for(String xml : allDatatypesExceptTheOne.values()) {
    		allDatatypes = allDatatypes + xml;
   	}
    allDatatypes = allDatatypes + "</Datatypes>";
    System.out.println(allDatatypes);
    
    try (Writer writer = new BufferedWriter(new OutputStreamWriter(
            new FileOutputStream("/Users/ynb4/ExportV2/Pages/TestInput.html"), "utf-8"))) {
 writer.write(allDatatypes);
} catch (UnsupportedEncodingException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
} catch (FileNotFoundException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
} catch (IOException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
}
    
		return allDatatypes;
    }
}