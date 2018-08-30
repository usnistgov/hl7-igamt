package gov.nist.hit.hl7.igamt.web.export.service;

import java.util.Map;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;

public interface DatatypeLibraryPopulateObjectService {
	
	public MyExportObject populateExportObject(Map<String, Datatype> datatypesMap);

}
