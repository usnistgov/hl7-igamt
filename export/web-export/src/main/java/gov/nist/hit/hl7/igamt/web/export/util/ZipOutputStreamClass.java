package gov.nist.hit.hl7.igamt.web.export.util;


import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;

public class ZipOutputStreamClass {
	
	private final static Logger LOG = Logger.getLogger("Zip");

    public final static String ZIP_DIR = "c:/Dev/temp/zipwrite";
    public static final String OUTPUT_ZIP = "/Users/ynb4/ExportV2/output.zip";
    
    
    
    /**
     * Instantiate a new ZipWriter and provide the directory we want to compress.
     * @param args command line args not used
     * @throws IOException 
     */
    public static void main(String[] args) throws IOException {
    		ZipOutputStreamClass zw = new ZipOutputStreamClass();
//    		ZipOutputStream zipStream = zw.createZip("assets",Tools.getFileFromResources("assets").getAbsolutePath());
//    		ZipUtils.ZipTheFile(OUTPUT_ZIP, Tools.getFileFromResources("assets").getAbsolutePath());
//			ZipOutputStream zipStream = ZipUtils.ZipTheFile("/Users/ynb4/ExportV2/outputnew.zip", Tools.getFileFromResources("assets").getAbsolutePath());
//
//        
//    			FileUtils.writeStringToFile(new File("test.html"),"TEEEST",Charset.forName("UTF-8"));
//			ZipOutputStreamClass.addFileToZip(zipStream,"Pages/", "test.html", "HEllllllo");

        
//        	zipStream.close();
        

        
    }
    
    public static void addFileToZip(ZipOutputStream zipStream, String directory, String filePath, String content) {
    	 ZipEntry entry = new ZipEntry("webSiteExport" + "/" + directory +filePath);
         try {
 			zipStream.putNextEntry(entry);
			zipStream.write(content.getBytes());
 			zipStream.closeEntry();
 		} catch (IOException e) {
 			// TODO Auto-generated catch block
 			e.printStackTrace();
 		}
         
    }
    


    /**
     * This method creates the zip archive and then goes through
     * each file in the chosen directory, adding each one to the
     * archive. Note the use of the try with resource to avoid
     * any finally blocks.
     */
    public ZipOutputStream createZip(String dirName, String dirPath) {
        // the directory to be zipped
        Path directory = Paths.get(dirPath);

        // the zip file name that we will create
        File zipFileName = Paths.get(OUTPUT_ZIP).toFile();

        // open the zip stream in a try resource block, no finally needed
        try {
        	ZipOutputStream zipStream = new ZipOutputStream(
        
                        new FileOutputStream(zipFileName)) ;

            // traverse every file in the selected directory and add them
            // to the zip file by calling addToZipFile(..)


            DirectoryStream<Path> dirStream = Files.newDirectoryStream(directory);
            dirStream.forEach(path -> addToZipFile(dirName, directory.resolve(path), zipStream));
                        
            LOG.info("Zip file created in " + directory.toFile().getPath());
    		return zipStream;

        }
        catch(IOException|ZipParsingException e) {
            LOG.log(Level.SEVERE, "Error while zipping.", e);
        }
		return null;
    }

    /**
     * Adds an extra file to the zip archive, copying in the created
     * date and a comment.
     * @param file file to be archived
     * @param zipStream archive to contain the file.
     */
    public void addToZipFile(String directoryParent, Path file, ZipOutputStream zipStream) {
        String inputFileName = file.toFile().getPath();
        try (FileInputStream inputStream = new FileInputStream(inputFileName)) {

            // create a new ZipEntry, which is basically another file
            // within the archive. We omit the path from the filename
            ZipEntry entry = new ZipEntry("webSiteExport" + "/" + directoryParent +"/" +file.toFile().getName());
            
            System.out.println("file.toFile().getParent()  : "+file.toFile().getParent() );
            System.out.println("file.toFile().getName()  : "+file.toFile().getName() );
            System.out.println("file.toFile().getParent() +\"/\" +file.toFile().getName()  : "+file.toFile().getParent() +"/" +file.toFile().getName() );

            
            
            entry.setCreationTime(FileTime.fromMillis(file.toFile().lastModified()));
            entry.setComment("Created by TheCodersCorner");
            zipStream.putNextEntry(entry);

            LOG.info("Generated new entry for: " + inputFileName);

            // Now we copy the existing file into the zip archive. To do
            // this we write into the zip stream, the call to putNextEntry
            // above prepared the stream, we now write the bytes for this
            // entry. For another source such as an in memory array, you'd
            // just change where you read the information from.
            byte[] readBuffer = new byte[2048];
            int amountRead;
            int written = 0;

            while ((amountRead = inputStream.read(readBuffer)) > 0) {
                zipStream.write(readBuffer, 0, amountRead);
                written += amountRead;
            }

            LOG.info("Stored " + written + " bytes to " + inputFileName);


        }
        catch(IOException e) {
            throw new ZipParsingException("Unable to process " + inputFileName, e);
        }
    }



    /**
     * We want to let a checked exception escape from a lambda that does not
     * allow exceptions. The only way I can see of doing this is to wrap the
     * exception in a RuntimeException. This is a somewhat unfortunate side
     * effect of lambda's being based off of interfaces.
     */
    public class ZipParsingException extends RuntimeException {
        public ZipParsingException(String reason, Exception inner) {
            super(reason, inner);
        }
    }

	
	public static void addFilesToExistingZip(File zipFile,
	         File[] files) throws IOException {
	        // get a temp file
	    File tempFile = File.createTempFile(zipFile.getName(), null);
	        // delete it, otherwise you cannot rename your existing zip to it.
	    tempFile.delete();

	    boolean renameOk=zipFile.renameTo(tempFile);
	    if (!renameOk)
	    {
	        throw new RuntimeException("could not rename the file "+zipFile.getAbsolutePath()+" to "+tempFile.getAbsolutePath());
	    }
	    byte[] buf = new byte[1024];

	    ZipInputStream zin = new ZipInputStream(new FileInputStream(tempFile));
	    ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));

	    ZipEntry entry = zin.getNextEntry();
	    while (entry != null) {
	        String name = entry.getName();
	        boolean notInFiles = true;
	        for (File f : files) {
	            if (f.getName().equals(name)) {
	                notInFiles = false;
	                break;
	            }
	        }
	        if (notInFiles) {
	            // Add ZIP entry to output stream.
	            out.putNextEntry(new ZipEntry(name));
	            // Transfer bytes from the ZIP file to the output file
	            int len;
	            while ((len = zin.read(buf)) > 0) {
	                out.write(buf, 0, len);
	            }
	        }
	        entry = zin.getNextEntry();
	    }
	    // Close the streams        
	    zin.close();
	    // Compress the files
	    for (int i = 0; i < files.length; i++) {
	        InputStream in = new FileInputStream(files[i]);
	        // Add ZIP entry to output stream.
	        out.putNextEntry(new ZipEntry(files[i].getName()));
	        // Transfer bytes from the file to the ZIP file
	        int len;
	        while ((len = in.read(buf)) > 0) {
	            out.write(buf, 0, len);
	        }
	        // Complete the entry
	        out.closeEntry();
	        in.close();
	    }
	    // Complete the ZIP file
	    out.close();
	    tempFile.delete();
	}
	
}
