package gov.nist.hit.hl7.igamt.web.export.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtils {

    private List <String> fileList;
    private static final String OUTPUT_ZIP_FILE = "/Users/ynb4/ExportV2/output2.zip";
    private static final String SOURCE_FOLDER = "/Users/ynb4/ExportV2/websiteTest"; // SourceFolder path

    public ZipUtils() {
        fileList = new ArrayList < String > ();
    }

    public static void ZipTheFile(ZipOutputStream zipStream, String destination, String sourceFolder) {
    		ZipUtils appZip = new ZipUtils();
        appZip.generateFileList(new File(sourceFolder),sourceFolder);
         appZip.zipIt(zipStream, destination, sourceFolder);
    }

    public void zipIt(ZipOutputStream zos, String zipFile, String sourceFolder) {
        byte[] buffer = new byte[1024];
        String source = "webSiteExport/"+new File(sourceFolder).getName();
//        ByteArrayOutputStream fos = null;
//        ZipOutputStream zos = null;
        try {

            System.out.println("Output to Zip : " + zipFile);
            FileInputStream in = null;

            for (String file: this.fileList) {
//                System.out.println("File Added : " + file);
                ZipEntry ze = new ZipEntry(source + File.separator + file);
                zos.putNextEntry(ze);
                try {
                    in = new FileInputStream(sourceFolder + File.separator + file);
                    int len;
                    while ((len = in .read(buffer)) > 0) {
                        zos.write(buffer, 0, len);
                    }
                } finally {
                    in.close();
                }
            }

            zos.closeEntry();
            System.out.println("Folder successfully compressed");

        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
//            try {
//                zos.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
        }
    }

    public void generateFileList(File node, String sourceFolder) {
        // add file only
        if (node.isFile()) {
            fileList.add(generateZipEntry(node.toString(), sourceFolder));
        }

        if (node.isDirectory()) {
            String[] subNote = node.list();
            for (String filename: subNote) {
                generateFileList(new File(node, filename),sourceFolder);
            }
        }
    }

    private String generateZipEntry(String file, String sourceFolder) {
        return file.substring(sourceFolder.length() + 1, file.length());
    }
}