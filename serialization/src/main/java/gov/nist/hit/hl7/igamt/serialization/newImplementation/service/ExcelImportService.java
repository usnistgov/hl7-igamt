package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.IOException;
import java.io.InputStream;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParserResults;

public interface ExcelImportService {
	public ParserResults readFromExcel(InputStream excelStream, String segmentID, String conformanceProfileID, String igID, String pathID) throws IOException, Exception;

}
