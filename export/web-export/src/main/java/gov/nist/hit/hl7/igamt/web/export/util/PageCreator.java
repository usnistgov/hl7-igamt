package gov.nist.hit.hl7.igamt.web.export.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Set;

import javax.xml.transform.TransformerException;

import org.apache.commons.io.FileUtils;

import com.google.common.io.Files;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.util.HtmlUtil;
import gov.nist.hit.hl7.igamt.export.util.TransformationUtil;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;



public class PageCreator {
	
	   private static String ALL_DATATYPES_IN_TABLE_INDEX = "/XSLT/AllDatatypesInTableIndex.xsl";   
	   private static String TRANSFORM_TO_TABLE = "/XSLT/TransformToTable.xsl";
	   private static String TRANSFORM_TO_MULTIPLE_TABLE = "/XSLT/TransformToMultipleTable.xsl";
	   
	   
	   File tempPages = Files.createTempDir();
	   File tempXmlDatatypes = Files.createTempDir();

	   


	
	HtmlWriter hw = new HtmlWriter();
	BasicXsl bx = new BasicXsl();

	ExportParameters exportParameters = new ExportParameters();


	
	public void generateIndex(MyExportObject myExportObject) {
//		BasicXsl bx = new BasicXsl();
//		WritePage("/Users/ynb4/ExportV2/XmlFiles/AllDatatypes.xml", myExportObject.getAllDatatypesXml());
//		String resultPage = createPage("/Users/ynb4/ExportV2/ForJava/indexCopy.html", "<ReplaceVersionLayer></ReplaceVersionLayer>", hw.generateVersionInIndex(myExportObject));
//		WritePage("/Users/ynb4/ExportV2/Pages/temp.html", resultPage);
//		String resultPage2 = createPage(WritePage("/Users/ynb4/ExportV2/Pages/temp.html", resultPage), "<ReplaceDatatypeLayer></ReplaceDatatypeLayer>", readFromFileToString(bx.xsl("/Users/ynb4/ExportV2/XmlFiles/AllDatatypes.xml", "/Users/ynb4/ExportV2/Pages/IndexTableDatatypes.html" , "/XSLT/AllDatatypesInTableIndex.xsl")));
////		System.out.println(resultPage2);
//		WritePage("/Users/ynb4/ExportV2/index.html", resultPage2);
		

	    try {
//	      File htmlFile = TransformationUtil.doTransformToTempHtml(myExportObject.getAllDatatypesXml(),ALL_DATATYPES_IN_TABLE_INDEX, exportParameters);
		  File htmlFile = bx.xsl(myExportObject.getAllDatatypesXml(),ALL_DATATYPES_IN_TABLE_INDEX);

	      InputStream htmlInputStream = FileUtils.openInputStream(htmlFile);
//	      HtmlUtil.cleanHtml(htmlInputStream);
	      String htmlTableIndex = convertStreamToString(htmlInputStream);
		  String indexWithVersionsDisplayed = createPage("/Users/ynb4/ExportV2/ForJava/indexCopy.html", "<ReplaceVersionLayer></ReplaceVersionLayer>", hw.generateVersionInIndex(myExportObject));
		  String index = createPage(WritePage("/Users/ynb4/ExportV2/Pages/temp.html", indexWithVersionsDisplayed), "<ReplaceDatatypeLayer></ReplaceDatatypeLayer>",htmlTableIndex );
		  WritePage("/Users/ynb4/ExportV2/index.html", index);

	      
	    } catch (Exception exception) {
	    	exception.printStackTrace();
	    }
	  
	}
	
	public void generateLeafPageTable(MyExportObject myExportObject) throws IOException, TransformerException {
		// Remove root datatype from both lists
		
		
		
		BasicXsl bx = new BasicXsl();		
		for(Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
//			if(!datatype.getExt().isEmpty()) {
			System.out.println("Size of getMapDatatypeToXML is : " + myExportObject.getMapDatatypeToXML().size());
//				WritePage(tempXmlDatatypes.getAbsolutePath()+"/XmlDatatype_"+datatype.getName()+datatype.getExt()+".xml", myExportObject.getMapDatatypeToXML().get(datatype));
			WritePage("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+datatype.getName()+datatype.getExt()+".xml", myExportObject.getMapDatatypeToXML().get(datatype));

			
		}

		System.out.println("J'ai tout ecris");
		System.out.println("REGARAGE ICI" +tempXmlDatatypes.list());

			for(Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
//				if(!datatype.getExt().isEmpty()) {

					File htmlFile;
					try {
						htmlFile = bx.xsl(myExportObject.getMapDatatypeToXML().get(datatype),TRANSFORM_TO_TABLE);
						 InputStream htmlInputStream = FileUtils.openInputStream(htmlFile);
//					      HtmlUtil.cleanHtml(htmlInputStream);
					      String datatypeTransformedToTable = convertStreamToString(htmlInputStream);
							WritePage("/Users/ynb4/ExportV2/Pages/Datatype_"+datatype.getName()+datatype.getExt()+".html",datatypeTransformedToTable);
					      
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (TransformerException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				     
					

			
			
			}


			for(String version : myExportObject.getDatatypesbyVersionThenName().keySet()) {
				for(String name : myExportObject.getDatatypesbyVersionThenName().get(version).keySet()) {
					String allLeafTableResult = "";
					
					for(int i=0 ; i<= myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size() -1 ; i+=2) {
						String firstDatatype ="";

//						File htmlFile1 = TransformationUtil.doTransformToTempHtml(tempXmlDatatypes.getAbsolutePath()+"/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getExt()+".xml",TRANSFORM_TO_MULTIPLE_TABLE, exportParameters);
						File htmlFile1 = bx.xsl(readFromFileToString("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getExt()+".xml"),TRANSFORM_TO_MULTIPLE_TABLE);
						InputStream htmlInputStream1 = FileUtils.openInputStream(htmlFile1);
					       firstDatatype = convertStreamToString(htmlInputStream1);
					      
//							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html" , "/XSLT/TransformToMultipleTable.xsl");
//							firstDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html");
							String secondDatatype ="";
							if(i+1<myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size()) {
//								File htmlFile2 = TransformationUtil.doTransformToTempHtml(tempXmlDatatypes.getAbsolutePath()+"/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getExt()+".xml",TRANSFORM_TO_MULTIPLE_TABLE, exportParameters);
								File htmlFile2 = bx.xsl(readFromFileToString("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getExt()+".xml"),TRANSFORM_TO_MULTIPLE_TABLE);
								InputStream htmlInputStream2 = FileUtils.openInputStream(htmlFile2);
							      secondDatatype = convertStreamToString(htmlInputStream2);
							      
//								bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html" , "/XSLT/TransformToMultipleTable.xsl");
//							secondDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html");
							}
							
							String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
							allLeafTableResult = allLeafTableResult + oneDivContent;
						}
//					String allLeafTableForJava = readFromFileToString("/Users/ynb4/ExportV2/Pages/AllLeafTableForJava.html");
//					System.out.println("here :"+allLeafTableForJava);
					String pageToWrite = createPage("/ForJava/AllLeafTableForJava.html", "<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
//					System.out.println("here"+pageToWrite);
					WritePage("/Users/ynb4/ExportV2/Pages/AllDatatypesVersion_"+version+"ForRoot_"+name+".html", pageToWrite);
				}
			}
			
			for(String name : myExportObject.getDatatypesbyNameThenVersion().keySet()) {
				for(Set<String> versionSet : myExportObject.getDatatypesbyNameThenVersion().get(name).keySet()) {
					String allLeafTableResult = "";
					String secondDatatypeLeaf ="";
					String firstDatatypeLeaf ="";
					for(int i=0 ; i<= myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).size() -1 ; i+=2) {
						String firstDatatype ="";

//						File htmlFile1 = TransformationUtil.doTransformToTempHtml(tempXmlDatatypes.getAbsolutePath()+"/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getExt()+".xml",TRANSFORM_TO_MULTIPLE_TABLE, exportParameters);
						File htmlFile1 = bx.xsl(readFromFileToString("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getExt()+".xml"),TRANSFORM_TO_MULTIPLE_TABLE); 
						InputStream htmlInputStream1 = FileUtils.openInputStream(htmlFile1);
					       firstDatatype = convertStreamToString(htmlInputStream1);
						
						
//							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html" , "/XSLT/TransformToMultipleTable.xsl");
//							firstDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html");
							String secondDatatype ="";
							if(i+1<myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).size()) {
								
//								File htmlFile2 = TransformationUtil.doTransformToTempHtml(tempXmlDatatypes.getAbsolutePath()+"/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getExt()+".xml",TRANSFORM_TO_MULTIPLE_TABLE, exportParameters);
								File htmlFile2 = bx.xsl(readFromFileToString("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getExt()+".xml"),TRANSFORM_TO_MULTIPLE_TABLE);
								InputStream htmlInputStream2 = FileUtils.openInputStream(htmlFile2);
								 secondDatatype = convertStreamToString(htmlInputStream2);
								
//								bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html" , "/XSLT/TransformToMultipleTable.xsl");
//							secondDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html");
							}
							
							String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
							allLeafTableResult = allLeafTableResult + oneDivContent;
					
//					String allLeafTableForJava = readFromFileToString("/Users/ynb4/ExportV2/Pages/AllLeafTableForJava.html");
					String pageToWrite = createPage("/ForJava/AllLeafTableForJava.html", "<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
//					System.out.println("here"+pageToWrite);
					WritePage("/Users/ynb4/ExportV2/Pages/AllDatatypesForRoot_"+name+"Version_"+versionSet+".html", pageToWrite);
				}
			}
	}

		
	}

		
//		System.out.println("We're in");
//		bx.xsl("/Users/ynb4/Desktop/NewOneDataType.xml", "/Users/ynb4/Desktop/NewOneDataTypeTransformed.html" , "/Users/ynb4/Desktop/TransformToTable.xsl");
		

	
	public String createPage(String staticContentPath, String toBeReplaced, String toReplaceWith) {
		
		StringBuilder contentBuilder = new StringBuilder();
	    try {
	        BufferedReader in = new BufferedReader(new FileReader(staticContentPath));
	        String str;
	        while ((str = in.readLine()) != null) {
	            contentBuilder.append(str);
	        }
	        in.close();
	    } catch (IOException e) {
	    }
	    String content = contentBuilder.toString();
	    
	    String resultPage = content.replace(toBeReplaced, toReplaceWith);

	    
	    return resultPage;
	}
	
	public String readFromFileToString(String path) {
		
		StringBuilder contentBuilder = new StringBuilder();
	    try {
	        BufferedReader in = new BufferedReader(new FileReader(path));
	        String str;
	        while ((str = in.readLine()) != null) {
	            contentBuilder.append(str);
	        }
	        in.close();
	    } catch (IOException e) {
	    }
	    String content = contentBuilder.toString();
	    

	    
	    return content;
		
	}
	
	public String WritePage(String path, String content) {
		
		try (Writer writer = new BufferedWriter(new OutputStreamWriter(
	              new FileOutputStream(path), "utf-8"))) {
	   writer.write(content);
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
		return path;
	}
	
	public String convertStreamToString(InputStream inputstream) {BufferedReader br = null;
	StringBuilder sb = new StringBuilder();

	String line;
	try {

		br = new BufferedReader(new InputStreamReader(inputstream));
		while ((line = br.readLine()) != null) {
			sb.append(line);
		}

	} catch (IOException e) {
		e.printStackTrace();
	} finally {
		if (br != null) {
			try {
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	return sb.toString();

}


}
