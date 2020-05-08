package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DocumentDisplayInfo;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.LibraryDisplayInfoService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class LibraryDisplayInfoServiceImpl implements LibraryDisplayInfoService {
	


	  @Autowired
	  DatatypeService datatypeService;


	  @Autowired
	  ValuesetService valuesetService;



	@Override
	public Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry) {
		Set<String> ids= this.gatherIds(registry.getChildren());
		List<Datatype> datatypes= datatypeService.findByIdIn(ids);
		Set<DisplayElement> ret = new HashSet<DisplayElement>();
		for(Datatype dt : datatypes) {
			ret.add(convertDatatype(dt));
		}
		return ret;
	}

	@Override
	public Set<DisplayElement> convertValueSetRegistry(ValueSetRegistry registry) {
		Set<String> ids= this.gatherIds(registry.getChildren());
		List<Valueset> valueSets= this.valuesetService.findByIdIn(ids);
		Set<DisplayElement> ret = new HashSet<DisplayElement>();
		for(Valueset vs : valueSets) {
			ret.add(convertValueSet(vs));
		}
		return ret;	
	}

	@Override
	public DisplayElement convertDatatype(Datatype datatype) {
		
		DisplayElement displayElement= new DisplayElement();
		displayElement.setId(datatype.getId());
		displayElement.setDomainInfo(datatype.getDomainInfo());
		displayElement.setFixedName(datatype.getName());
		displayElement.setDescription(datatype.getDescription());
		displayElement.setDifferantial(datatype.getOrigin() !=null);
		displayElement.setLeaf(!(datatype instanceof ComplexDatatype));
		displayElement.setVariableName(datatype.getExt());
		displayElement.setType(Type.DATATYPE);
		displayElement.setOrigin(datatype.getOrigin());
		return displayElement;
	}


	@Override
	public DisplayElement convertValueSet(Valueset valueset) {
		DisplayElement displayElement= new DisplayElement();
		displayElement.setId(valueset.getId());
		displayElement.setDomainInfo(valueset.getDomainInfo());
		displayElement.setDescription(valueset.getName());
		displayElement.setDifferantial(valueset.getOrigin() !=null);
		displayElement.setLeaf(false);
		displayElement.setVariableName(valueset.getBindingIdentifier());
		displayElement.setType(Type.VALUESET);
		displayElement.setOrigin(valueset.getOrigin());
		displayElement.setFlavor(valueset.isFlavor());
		return displayElement;
	}

	private Set<String> gatherIds(Set<Link> links) {
		Set<String> results = new HashSet<String>();
		links.forEach(link -> results.add(link.getId()));
		return results;
	}
	
	   private Map<String, Integer> gatherIdsAndPositions(Set<Link> links) {
	       Map<String, Integer> result = links.stream().collect(Collectors.toMap(Link::getId, Link::getPosition));
	         return result;
	    }

	@Override
	public Set<DisplayElement> convertValueSets(Set<Valueset> valueSets) {
		Set<DisplayElement> ret = new HashSet<DisplayElement>();
		for(Valueset vs : valueSets) {
			ret.add(this.convertValueSet(vs));
		}
		return ret;
		
	}
	@Override
	public Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes) {
		// TODO Auto-generated method stub
		Set<DisplayElement> ret = new HashSet<DisplayElement>();
		for(Datatype dt : datatypes ) {
			ret.add(this.convertDatatype(dt));
		}
		return ret;
	}

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DisplayInfoService#covertToDisplay(gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary)
   */
  @Override
  public DocumentDisplayInfo covertToDisplay(DatatypeLibrary lib) {
    // TODO Auto-generated method stub
    DocumentDisplayInfo ret = new DocumentDisplayInfo();
    ret.setIg(lib);
    ret.setDatatypes(convertDatatypeRegistry(lib.getDatatypeRegistry()));
    ret.setValueSets(convertValueSetRegistry(lib.getValueSetRegistry()));
    return ret;
  }


}
