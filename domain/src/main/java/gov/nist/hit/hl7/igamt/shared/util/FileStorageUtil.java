package gov.nist.hit.hl7.igamt.shared.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;


public class FileStorageUtil {
	
	public final static String root = "/uploaded_files";
	public final static String UPLOAD_URL = "/upload";

	public final static Set<String> allowedExtensions = new HashSet<String>(Arrays.asList("txt", "pdf", "doc", "docx", "gif", "jpeg", "png", "jpg","xml"));

	

	
}
