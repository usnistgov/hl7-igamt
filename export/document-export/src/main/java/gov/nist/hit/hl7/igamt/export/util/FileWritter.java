package gov.nist.hit.hl7.igamt.export.util;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
public class FileWritter {
	
	public void createAndWriteToFile(String content) throws IOException {
		Path source = Paths.get(this.getClass().getResource("/").getPath());
        Path xmlFile = Paths.get(source.toAbsolutePath() + "/xmlContent.xml");
        Files.write(xmlFile, content.getBytes(StandardCharsets.UTF_8));
        System.out.println("FINISHED WRITTING XML IN :" + xmlFile.toString());
	}
}