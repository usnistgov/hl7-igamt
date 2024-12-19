package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.InputStream;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParserResults;

public interface ExcelImportService {
	CoConstraintTable readFromExcel(InputStream excelStream, String igID, String conformanceProfileID, String contextId, String segmentRef) throws Exception;
}
