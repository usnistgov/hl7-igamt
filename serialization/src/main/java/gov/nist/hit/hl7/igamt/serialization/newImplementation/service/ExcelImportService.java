package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.IOException;
import java.io.InputStream;

public interface ExcelImportService {
	public void readFromExcel(InputStream excelStream, String segmentID, String conformanceProfileID, String igID, String pathID) throws IOException;

}
