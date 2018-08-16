package gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util;

import java.io.*;
import java.util.Map;

import org.w3c.dom.*;
import org.xml.sax.*;
import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

public class BasicXsl {
    // This method applies the xslFilename to inFilename and writes
    // the output to outFilename.
    public  String xsl(String inFilename, String outFilename, String xslFilename) {
    	
    	
        try {
            // Create transformer factory
            TransformerFactory factory = new net.sf.saxon.TransformerFactoryImpl();
//            		TransformerFactory.newInstance( "org.apache.xalan.processor.TransformerFactoryImpl", null);

            // Use the factory to create a template containing the xsl file
            Transformer transformer = factory.newTransformer(new StreamSource(
                new FileInputStream(xslFilename)));

            // Use the template to create a transformer
//            Transformer xformer = template.newTransformer();

            // Prepare the input and output files
            Source source = new StreamSource(new FileInputStream(inFilename));
            Result result = new StreamResult(new FileOutputStream(outFilename));
            

            // Apply the xsl file to the source file and write the result
            // to the output file
            transformer.transform(source, result);
//            System.out.println("REEEEEEEEESULT " +result);

        } catch (FileNotFoundException e) {
        } catch (TransformerConfigurationException e) {
            // An error occurred in the XSL file
        } catch (TransformerException e) {
            // An error occurred while applying the XSL file
            // Get location of error in input file
            SourceLocator locator = e.getLocator();
            int col = locator.getColumnNumber();
            int line = locator.getLineNumber();
            String publicId = locator.getPublicId();
            String systemId = locator.getSystemId();
        }
        return outFilename;
    	

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