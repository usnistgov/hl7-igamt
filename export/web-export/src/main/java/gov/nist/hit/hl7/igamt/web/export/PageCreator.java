package gov.nist.hit.hl7.igamt.web.export;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Set;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;



public class PageCreator {
	HtmlWriter hw = new HtmlWriter();

	
	public void generateIndex(MyExportObject myExportObject) {
		BasicXsl bx = new BasicXsl();
		WritePage("/Users/ynb4/ExportV2/XmlFiles/AllDatatypes.xml", myExportObject.getAllDatatypesXml());
	   
//		bx.xsl("/Users/ynb4/ExportV2/XmlFiles/AllDatatypes.xml", "/Users/ynb4/ExportV2/Pages/IndexTableDatatypes.html" , "/Users/ynb4/ExportV2/Pages/AllDatatypesInTableIndex.xsl");
		String resultPage = createPage("/Users/ynb4/ExportV2/ForJava/indexCopy.html", "<ReplaceVersionLayer></ReplaceVersionLayer>", hw.generateVersionInIndex(myExportObject));
		WritePage("/Users/ynb4/ExportV2/Pages/temp.html", resultPage);
		String resultPage2 = createPage(WritePage("/Users/ynb4/ExportV2/Pages/temp.html", resultPage), "<ReplaceDatatypeLayer></ReplaceDatatypeLayer>", readFromFileToString(bx.xsl("/Users/ynb4/ExportV2/XmlFiles/AllDatatypes.xml", "/Users/ynb4/ExportV2/Pages/IndexTableDatatypes.html" , "/Users/ynb4/ExportV2/Xslt/AllDatatypesInTableIndex.xsl")));
//		System.out.println(resultPage2);
		WritePage("/Users/ynb4/ExportV2/index.html", resultPage2);
	}
	
	public void generateLeafPageTable(MyExportObject myExportObject) {
		// Remove root datatype from both lists
		
		
		
		BasicXsl bx = new BasicXsl();		
		for(Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
			if(!datatype.getExt().isEmpty()) {
				WritePage("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+datatype.getName()+datatype.getExt()+".xml", myExportObject.getMapDatatypeToXML().get(datatype));
				 
			}
		}
			for(Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
				if(!datatype.getExt().isEmpty()) {
					
				bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+datatype.getName()+datatype.getExt()+".xml", "/Users/ynb4/ExportV2/Pages/Datatype_"+datatype.getName()+datatype.getExt()+".html" , "/Users/ynb4/ExportV2/Xslt/TransformToTable.xsl");

			
			}
			}


			for(String version : myExportObject.getDatatypesbyVersionThenName().keySet()) {
				for(String name : myExportObject.getDatatypesbyVersionThenName().get(version).keySet()) {
					String allLeafTableResult = "";
					
					for(int i=0 ; i<= myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size() -1 ; i+=2) {
						String firstDatatype ="";

							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html" , "/Users/ynb4/ExportV2/Xslt/TransformToMultipleTable.xsl");
							firstDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html");
							String secondDatatype ="";
							if(i+1<myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size()) {
							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getName()+myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i+1).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html" , "/Users/ynb4/ExportV2/Xslt/TransformToMultipleTable.xsl");
							secondDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html");
							}
							
							String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
							allLeafTableResult = allLeafTableResult + oneDivContent;
						}
//					String allLeafTableForJava = readFromFileToString("/Users/ynb4/ExportV2/Pages/AllLeafTableForJava.html");
//					System.out.println("here :"+allLeafTableForJava);
					String pageToWrite = createPage("/Users/ynb4/ExportV2/ForJava/AllLeafTableForJava.html", "<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
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

							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html" , "/Users/ynb4/ExportV2/Xslt/TransformToMultipleTable.xsl");
							firstDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp1.html");
							String secondDatatype ="";
							if(i+1<myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).size()) {
							bx.xsl("/Users/ynb4/ExportV2/XmlFiles/XmlDatatype_"+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getName()+myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i+1).getExt()+".xml", "/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html" , "/Users/ynb4/ExportV2/Xslt/TransformToMultipleTable.xsl");
							secondDatatype =  readFromFileToString("/Users/ynb4/ExportV2/Pages/DatatypeTemp2.html");
							}
							
							String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
							allLeafTableResult = allLeafTableResult + oneDivContent;
					
//					String allLeafTableForJava = readFromFileToString("/Users/ynb4/ExportV2/Pages/AllLeafTableForJava.html");
					String pageToWrite = createPage("/Users/ynb4/ExportV2/ForJava/AllLeafTableForJava.html", "<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
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

}
