package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.InputStream;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParserResults;

public interface ExcelImportService {
	ParserResults readFromExcel(InputStream excelStream, String igID, String conformanceProfileID, String contextId, String segmentRef) throws Exception;
}
