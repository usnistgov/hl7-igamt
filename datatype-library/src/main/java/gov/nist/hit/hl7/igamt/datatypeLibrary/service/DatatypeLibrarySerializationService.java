package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;


@Service("datatypeLibrarySerializationService")
public interface DatatypeLibrarySerializationService {
	
	  public String serializeDatatypeLibrary(DatatypeLibrary datatypeLibrary, ExportConfiguration exportConfiguration) throws SerializationException;


}
