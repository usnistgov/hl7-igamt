package gov.nist.hit.hl7.igamt.service.impl;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.CharBuffer;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.dom4j.DocumentHelper;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class XMLManager implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3560268822893128944L;

	public static Document stringToDom(String xmlSource) throws SAXException,
			ParserConfigurationException, IOException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setNamespaceAware(true);
		factory.setIgnoringComments(false);
		factory.setIgnoringElementContentWhitespace(true);
		DocumentBuilder builder = factory.newDocumentBuilder();
		return builder.parse(new InputSource(new StringReader(xmlSource)));
	}

	private static String normalize(String BODString) {
		try {
			org.dom4j.Document dom4jDOC = DocumentHelper.parseText(BODString
					.trim());
			org.dom4j.io.OutputFormat format = org.dom4j.io.OutputFormat
					.createPrettyPrint();

			XMLWriter writer = null;

			ByteArrayOutputStream result = new ByteArrayOutputStream();
			try {
				writer = new XMLWriter(result, format);
				writer.write(dom4jDOC);
			} catch (IOException ioe) {

			} finally {

			}

			return result.toString();

		} catch (Exception age) {
			age.printStackTrace();
			return null;
		}
	}

	public static Document readFileAsDocument(String filePath)
			throws ParserConfigurationException, SAXException, IOException {
		File fXmlFile = new File(filePath);
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		dbFactory.setNamespaceAware(true);
		dbFactory.setIgnoringComments(true);
		dbFactory.setIgnoringElementContentWhitespace(true);
		DocumentBuilder dBuilder;

		dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(fXmlFile);
		return doc;

	}
	
	

	public static Document parseXmlFile(String inFilename, String xslFilename) {
		try {
			// Create transformer factory
			TransformerFactory factory = TransformerFactory.newInstance();

			// Use the factory to create a template containing the xsl file
			Templates template = factory.newTemplates(new StreamSource(
					new FileInputStream(xslFilename)));

			// Use the template to create a transformer
			Transformer xformer = template.newTransformer();

			// Prepare the input file
			Source source = new StreamSource(new FileInputStream(inFilename));

			// Create a new document to hold the results
			DocumentBuilder builder = DocumentBuilderFactory.newInstance()
					.newDocumentBuilder();
			Document doc = builder.newDocument();
			Result result = new DOMResult(doc);

			// Apply the xsl file to the source file and create the DOM tree
			xformer.transform(source, result);
			return doc;
		} catch (ParserConfigurationException e) {
			// An error occurred while creating an empty DOM document
		} catch (FileNotFoundException e) {
		} catch (TransformerConfigurationException e) {
			// An error occurred in the XSL file
		} catch (TransformerException e) {
			// An error occurred while applying the XSL file
		}
		return null;
	}

	public static Document parseXmlData(String data, String xslFilename) {
		try {
			// Create transformer factory
			TransformerFactory factory = TransformerFactory.newInstance();

			// Use the factory to create a template containing the xsl file
			Templates template = factory.newTemplates(new StreamSource(
					new FileInputStream(xslFilename)));

			// Use the template to create a transformer
			Transformer xformer = template.newTransformer();

			// Prepare the input file
			Source source = new StreamSource(new java.io.StringReader(data));
			// Create a new document to hold the results
			DocumentBuilder builder = DocumentBuilderFactory.newInstance()
					.newDocumentBuilder();
			Document doc = builder.newDocument();
			Result result = new DOMResult(doc);

			// Apply the xsl file to the source file and create the DOM tree
			xformer.transform(source, result);
			return doc;
		} catch (ParserConfigurationException e) {
			// An error occurred while creating an empty DOM document
		} catch (FileNotFoundException e) {
		} catch (TransformerConfigurationException e) {
			// An error occurred in the XSL file
		} catch (TransformerException e) {
			// An error occurred while applying the XSL file
		}
		return null;
	}
	
	public static String parseXmlByXSLT(String sourceStr, String xsltStr) {
		System.setProperty("javax.xml.transform.TransformerFactory", "net.sf.saxon.TransformerFactoryImpl");
		TransformerFactory tFactory = TransformerFactory.newInstance();
	    
	    
        try {
            Transformer transformer = tFactory.newTransformer(new StreamSource(new java.io.StringReader(xsltStr)));
            StringWriter outWriter = new StringWriter();
            StreamResult result = new StreamResult(outWriter);
            
            transformer.transform(new StreamSource(new java.io.StringReader(sourceStr)), result);
            StringBuffer sb = outWriter.getBuffer(); 
            String finalstring = sb.toString();
            
            return finalstring;
        } catch (Exception e) {
            e.printStackTrace();
        }

		return null;
	}

	public static String docToString(Document doc, String encoding)
			throws TransformerException {
		// transform the Document into a String
		DOMSource domSource = new DOMSource(doc);
		TransformerFactory tf = TransformerFactory.newInstance();
		Transformer transformer = tf.newTransformer();
		// transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,
		// "yes");
		transformer.setOutputProperty(OutputKeys.METHOD, "xml");
		transformer.setOutputProperty(OutputKeys.ENCODING, encoding);
		transformer.setOutputProperty(
				"{http://xml.apache.org/xslt}indent-amount", "4");
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		java.io.StringWriter sw = new java.io.StringWriter();
		StreamResult sr = new StreamResult(sw);
		transformer.transform(domSource, sr);
		String xml = sw.toString();
		return xml;
	}

	public static String docToString(Document doc) throws Exception {
		return normalize(docToString(doc, false, false, "UTF-8"));
	}

	public static String docToStringNoHeader(Document doc) throws Exception {
		return normalize(docToString(doc, true, true, "UTF-8"));
	}

	public static String docToString(Document doc, boolean omitXmlDeclaration)
			throws Exception {
		return docToString(doc, omitXmlDeclaration, false, "UTF-8");
	}

	public static String docToString(Document doc, boolean omitXmlDeclaration,
			boolean indent, String encoding) throws Exception {
		String returnXml = "";
		TransformerFactory transformerFactory = TransformerFactory
				.newInstance();
		Transformer transformer = transformerFactory.newTransformer();

		StringWriter writer = new StringWriter();
		if (doc != null) {
			if (omitXmlDeclaration)
				transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,
						"yes");
			else
				transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,
						"no");
			if (indent)
				transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			else
				transformer.setOutputProperty(OutputKeys.INDENT, "no");
			transformer.setOutputProperty(OutputKeys.METHOD, "xml");
			transformer.setOutputProperty(OutputKeys.ENCODING, encoding);
			transformer.transform(new DOMSource(doc), new StreamResult(writer));
			returnXml = writer.toString();
		}

		return returnXml;
	}

	public static String parsingSpecialforXml(String fileName) {

		CharBuffer cb = CharBuffer.wrap(fileName);
		String xmlString = "";
		while (cb.hasRemaining()) {

			char tempChar = cb.get();

			if (tempChar == '"') {
				xmlString += "&quot;";
			} else if (tempChar == '&') {
				xmlString += "&amp;";
			} else if (tempChar == '\'') {
				xmlString += "&apos;";
			} else if (tempChar == '<') {
				xmlString += "&lt;";
			} else if (tempChar == '>') {
				xmlString += "&gt;";
			} else {
				xmlString += tempChar;
			}

		}

		return xmlString;
	}

	public static String convertStreamToString(InputStream is)
			throws Exception {
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		StringBuilder sb = new StringBuilder();
		String line = null;
		while ((line = reader.readLine()) != null) {
			sb.append(line + "\n");
		}
		is.close();
		return sb.toString();
	}
}
