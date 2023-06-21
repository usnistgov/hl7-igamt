package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DocumentDisplayInfo;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.SelectableLibary;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;

public interface LibraryDisplayInfoService {

	public DocumentDisplayInfo covertToDisplay(DatatypeLibrary lib);
	public Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry);
	public Set<DisplayElement> convertValueSetRegistry(ValueSetRegistry registry);
	public DisplayElement convertDatatype(Datatype datatype);
	public DisplayElement convertValueSet(Valueset valueset);
	public Set<DisplayElement> convertValueSets(Set<Valueset> valueSets);
	public Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes);
	public List<SelectableLibary> covertToSelectableLibrary(List<DatatypeLibrary> libs);


	
}
