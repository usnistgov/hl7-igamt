package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.SerializableDatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibrarySerializationService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class DatatypeLibrarySerializationServiceImpl implements DatatypeLibrarySerializationService {
	
	  @Autowired
	  private DatatypeService datatypeService;
	
	  private Map<String, Datatype> datatypesMap = new HashMap<>();
	  private Map<String, Valueset> valuesetsMap = new HashMap<>();
	  private Set<String> bindedDatatypes = new HashSet<>();
	  private Set<String> bindedComponents = new HashSet<>();

	@Override
	public String serializeDatatypeLibraryDocument(DatatypeLibrary datatypeLibrary,
			ExportConfiguration exportConfiguration) throws SerializationException {
		// TODO Auto-generated method stub
		try {
			this.initializeDatatypesMap(datatypeLibrary.getDatatypeRegistry(),
			          exportConfiguration.getDatatypesExport());
			SerializableDatatypeLibrary serializableDatatypeLibrary = new SerializableDatatypeLibrary(datatypeLibrary, "1", datatypesMap,
			          valuesetsMap, this.bindedDatatypes, this.bindedComponents);
			      return serializableDatatypeLibrary.serialize().toXML();
		} catch (DatatypeNotFoundException e) {
			throw new SerializationException(e, Type.DATATYPELIBRARY, datatypeLibrary.getLabel());
		}
		}

	  private void initializeDatatypesMap(Registry datatypeLibrary,
		      UsageConfiguration usageConfiguration) throws DatatypeNotFoundException {
		    for (Link datatypeLink : datatypeLibrary.getChildren()) {
		      if (datatypeLink != null && datatypeLink.getId() != null
		          && !datatypesMap.containsKey(datatypeLink.getId().getId())) {
		        Datatype datatype = datatypeService.findByKey(datatypeLink.getId());
		        if (datatype != null) {
		          datatypesMap.put(datatypeLink.getId().getId(), datatype);
		        } else {
		          throw new DatatypeNotFoundException(datatypeLink.getId().getId());
		        }
		      }
		    }
		  }
}

