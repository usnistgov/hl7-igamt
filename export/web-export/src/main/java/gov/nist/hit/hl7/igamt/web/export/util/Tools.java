package gov.nist.hit.hl7.igamt.web.export.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;

public class Tools {

	public void emptyListFromRoot(MyExportObject myExportObject) {
		for(String version : myExportObject.getDatatypesbyVersionThenName().keySet()) {
			for(String name : myExportObject.getDatatypesbyVersionThenName().get(version).keySet()) {
				for(Datatype datatype : myExportObject.getDatatypesbyVersionThenName().get(version).get(name)) {
					if(datatype.getExt().isEmpty()) {
						myExportObject.getDatatypesbyVersionThenName().get(version).get(name).remove(datatype);
					}
				}
			}
		}
		
		for(String name : myExportObject.getDatatypesbyNameThenVersion().keySet()) {
			for(Set<String> versionSet : myExportObject.getDatatypesbyNameThenVersion().get(name).keySet()) {
				for(Datatype datatype : myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet)) {
					if(datatype.getExt().isEmpty()) {
						myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).remove(datatype);
					}
				}
			}
		}
	}
	
	public static String getPathFileFromResources(String fileName) {
//	  	String fileName = "ForJava/indexCopy.html";
   	 
    	ClassLoader classLoader = ClassLoader.getSystemClassLoader();
    	 
    	File file = new File(classLoader.getResource(fileName).getFile());
    	 
    	//File is found
//    	System.out.println("File Found : " + file.exists());
    	if(file.exists()) {
    		return file.getAbsolutePath();
    		
    	}else {
    		System.out.println("File " +fileName+ " not Found");
    		return null;
    	}
    	}
    	
    	public static File getFileFromResources(String fileName) {
//    	  	String fileName = "ForJava/indexCopy.html";
       	 
        	ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        	 
        	File file = new File(classLoader.getResource(fileName).getFile());
        	 
        	//File is found
//        	System.out.println("File Found : " + file.exists());
        	if(file.exists()) {
        		return file;
        		
        	}else {
        		return null;
        	}
    	 

	}
	
	public static String getContentFileFromResources(String fileName) {
//	  	String fileName = "ForJava/indexCopy.html";
   	 
    	ClassLoader classLoader = ClassLoader.getSystemClassLoader();
    	 
    	File file = new File(classLoader.getResource(fileName).getFile());
    	 
    	//File is found
    	if(file.exists()) {
        	String content="";
			try {
				content = new String(Files.readAllBytes(file.toPath()));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    		return content;
    		
    	}else {
    		return null;
    	}
    	 

	}
}
