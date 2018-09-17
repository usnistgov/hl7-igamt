package gov.nist.hit.hl7.igamt.web.export.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * This class generates a zip archive containing all the
 * files within constant ZIP_DIR.
 * For this example you'll need to put a few files in the
 * directory ZIP_DIR, and it will generate a zip archive
 * containing all those files in the location OUTPUT_ZIP.
 * Minimum Java version: 8
 */
public class ZipWriter {
    private final static Logger LOG = Logger.getLogger("Zip");

//    public final static String ZIP_DIR = Tools.getPathFileFromResources("ForJava/assets");
    public static final String OUTPUT_ZIP = "/Users/ynb4/ExportV2/output.zip";


    /**
     * This method creates the zip archive and then goes through
     * each file in the chosen directory, adding each one to the
     * archive. Note the use of the try with resource to avoid
     * any finally blocks.
     */
    public ZipOutputStream createZip(String dirName) {
//    	System.out.println("ZIP_DIR : " +ZIP_DIR );
        // the directory to be zipped
        Path directory = Paths.get(dirName);
        

        // the zip file name that we will create
        File zipFileName = Paths.get(OUTPUT_ZIP).toFile();

        // open the zip stream in a try resource block, no finally needed
        try( ZipOutputStream zipStream = new ZipOutputStream(
                        new FileOutputStream(zipFileName)) ) {

            // traverse every file in the selected directory and add them
            // to the zip file by calling addToZipFile(..)
            DirectoryStream<Path> dirStream = Files.newDirectoryStream(directory);
            dirStream.forEach(path -> addToZipFile(path, zipStream));

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
    public void addToZipFile(Path file, ZipOutputStream zipStream) {
        String inputFileName = file.toFile().getPath();
        try (FileInputStream inputStream = new FileInputStream(inputFileName)) {

            // create a new ZipEntry, which is basically another file
            // within the archive. We omit the path from the filename
            ZipEntry entry = new ZipEntry(file.toFile().getName());
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
     * Instantiate a new ZipWriter and provide the directory we want to compress.
     * @param args command line args not used
     */
    public static void main(String[] args) {
        ZipWriter zw = new ZipWriter();
        zw.createZip(Tools.getPathFileFromResources("assets"));
    }

    /**
     * We want to let a checked exception escape from a lambda that does not
     * allow exceptions. The only way I can see of doing this is to wrap the
     * exception in a RuntimeException. This is a somewhat unfortunate side
     * effect of lambda's being based off of interfaces.
     */
    private class ZipParsingException extends RuntimeException {
        public ZipParsingException(String reason, Exception inner) {
            super(reason, inner);
        }
    }
}