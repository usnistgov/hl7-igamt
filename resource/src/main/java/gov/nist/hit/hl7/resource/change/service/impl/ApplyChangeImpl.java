/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.resource.change.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.LengthType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;
import gov.nist.hit.hl7.resource.change.service.ApplyBindingPropertyFunction;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;
import gov.nist.hit.hl7.resource.change.service.ApplyPropertyFunction;
import gov.nist.hit.hl7.resource.change.service.FindByFunction;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ApplyChangeImpl implements ApplyChange {

	@Autowired
	BindingService bindingService;


	@Override
	public void apply(Resource resource, Map<PropertyType, ChangeItemDomain> map, String documentId) throws ApplyChangeException {
		// TODO Auto-generated method stub
		if (map.containsKey(PropertyType.PREDEF)) {
			resource.setPreDef((String) map.get(PropertyType.PREDEF).getPropertyValue());
		}
		if (map.containsKey(PropertyType.POSTDEF)) {
			resource.setPostDef((String) map.get(PropertyType.POSTDEF).getPropertyValue());
		} 
		if (map.containsKey(PropertyType.AUTHORNOTES)) {
			resource.setAuthorNotes((String) map.get(PropertyType.AUTHORNOTES).getPropertyValue());
		}
		if (map.containsKey(PropertyType.USAGENOTES)) {
			resource.setUsageNotes((String) map.get(PropertyType.USAGENOTES).getPropertyValue());
		} 
		if (map.containsKey(PropertyType.SHORTDESCRIPTION)) {
			resource.setShortDescription((String) map.get(PropertyType.SHORTDESCRIPTION).getPropertyValue());
		}
	}


	@Override
	public void applyComments( ChangeItemDomain change, StructureElement elm, String documentId) throws ApplyChangeException {
		change.getPropertyType().equals(PropertyType.COMMENT);
		ObjectMapper mapper = new ObjectMapper();
		String jsonInString;
		try {
			jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			change.setOldPropertyValue(elm.getComments());
			elm.setComments(new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}
	}

	@Override
	public <T extends StructureElement> void applyAll( List<ChangeItemDomain> changes, Set<T> structureElments,  String documentId, ApplyPropertyFunction<T> fn, FindByFunction<T> findBy) throws ApplyChangeException {

		for(ChangeItemDomain change: changes) {
			T elm = findBy.apply(structureElments, change.getLocation());
			if(elm !=null) {
				fn.apply( change,  elm,  documentId);
			}
		}
	}

	@Override
	public <T extends StructureElement> T findStructElementById(Set<T> structureElments, String location) {
		for (T elm : structureElments) {
			if (elm.getId().equals(location)) {
				return elm;
			}
		}
		return null;
	}


	@Override
	public void logChangeBinding(StructureElement binding, ChangeItemDomain changeItem) {
		if(binding.getChangeLog() == null) {
			binding.setChangeLog(new HashMap<>());
		}

		if(changeItem.getChangeReason() != null) {
			binding.getChangeLog().put(changeItem.getPropertyType(), changeItem.getChangeReason());
		} else {
			binding.getChangeLog().remove(changeItem.getPropertyType());
		}
	}

	@Override
	public void logChangeStructureElement(StructureElement structureElement, ChangeItemDomain changeItem) {
		if(structureElement.getChangeLog() == null) {
			structureElement.setChangeLog(new HashMap<>());
		}

		if(changeItem.getChangeReason() != null) {
			structureElement.getChangeLog().put(changeItem.getPropertyType(), changeItem.getChangeReason());
		} else {
			structureElement.getChangeLog().remove(changeItem.getPropertyType());
		}
	}

	@Override
	public void applyUsage( ChangeItemDomain change, StructureElement elm, String documentId) {
		change.setOldPropertyValue(elm.getUsage());
		elm.setUsage(Usage.valueOf((String) change.getPropertyValue()));
		this.logChangeStructureElement(elm, change);
	}

	@Override
	public void applyDefinitionText( ChangeItemDomain change, StructureElement elm, String documentId) {
		change.setOldPropertyValue(elm.getText());
		if (change.getPropertyValue() == null) {
			elm.setText(null);
		} else {
			elm.setText((String) change.getPropertyValue());
		}
	}

	@Override
	public void applyName( ChangeItemDomain change, StructureElement elm, String documentId) {
		change.setOldPropertyValue(elm.getName());
		elm.setName(change.getPropertyValue().toString());
		this.logChangeStructureElement(elm, change);
	}
	@Override
	public void applyMinLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getMinLength());
		if (change.getPropertyValue() == null) {
			elm.setMinLength("NA");
		} else {
			elm.setMinLength((String) change.getPropertyValue());
		}
		this.logChangeStructureElement(elm,change);
	}
	@Override
	public void applyMaxLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getMaxLength());
		if (change.getPropertyValue() == null) {
			elm.setMaxLength("NA");
		} else {
			elm.setMaxLength((String) change.getPropertyValue());
		}
		this.logChangeStructureElement(elm, change);
	}
	@Override
	public void applyLengthType( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getLengthType());
		if (change.getPropertyValue() == null) {
			elm.setLengthType(LengthType.UNSET);
		} else {
			elm.setLengthType(LengthType.valueOf((String) change.getPropertyValue()));
		}
		this.logChangeStructureElement(elm, change);
	}
	@Override
	public void applyConfLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getConfLength());
		if (change.getPropertyValue() == null) {
			elm.setConfLength("NA");
		} else {
			elm.setConfLength((String) change.getPropertyValue());
		}
		this.logChangeStructureElement(elm, change);
	}
	@Override
	public void applyDatatype( ChangeItemDomain change, SubStructElement elm, String documentId) throws ApplyChangeException {
		change.setOldPropertyValue(elm.getRef());
		ObjectMapper mapper = new ObjectMapper();
		try {
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			elm.setRef(mapper.readValue(jsonInString, Ref.class));
			this.logChangeStructureElement(elm, change);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new ApplyChangeException(change);
		}      
	}

	@Override
	public void applyConstantValue( ChangeItemDomain change, SubStructElement elm, String documentId) {

		change.setOldPropertyValue(elm.getConstantValue());
		if (change.getPropertyValue() == null) {
			elm.setConstantValue(null);
		} else {
			elm.setConstantValue((String) change.getPropertyValue());
		}
		this.logChangeStructureElement(elm, change);

	}

	/* (non-Javadoc)
	 * @see gov.nist.hit.hl7.resource.change.service.ApplyChange#applyStructureElemnentChanges(java.util.Map, java.util.Set, java.lang.String)
	 */
	@Override
	public <T extends StructureElement> void applyStructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map,
			Set<T> children, String documentId, FindByFunction<T> findBy) throws ApplyChangeException {
		// TODO Auto-generated method stub
		if(map.containsKey(PropertyType.USAGE)) {
			this.applyAll(map.get(PropertyType.USAGE), children, documentId, this::applyUsage, findBy);
		}
		if(map.containsKey(PropertyType.NAME)) {
			this.applyAll(map.get(PropertyType.NAME), children, documentId, this::applyName, findBy);
		}
		if(map.containsKey(PropertyType.COMMENT)) {
			this.applyAll(map.get(PropertyType.COMMENT), children, documentId, this::applyComments, findBy);
		}
		if(map.containsKey(PropertyType.DEFINITIONTEXT)) {
			this.applyAll(map.get(PropertyType.DEFINITIONTEXT), children, documentId, this::applyDefinitionText, findBy);
		}

	}


	@Override
	public <T extends SubStructElement> void applySubstructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map,
			Set<T> children, String documentId, FindByFunction<T> findBy ) throws ApplyChangeException  {
		// TODO Auto-generated method stub
		this.applyStructureElementChanges(map, children, documentId, findBy);
		if(map.containsKey(PropertyType.LENGTHMIN)) {
			this.applyAll(map.get(PropertyType.LENGTHMIN), children, documentId, this::applyMinLength, findBy);
		}

		if(map.containsKey(PropertyType.LENGTHMAX)) {
			this.applyAll(map.get(PropertyType.LENGTHMAX), children, documentId, this::applyMaxLength, findBy);
		}

		if(map.containsKey(PropertyType.LENGTHTYPE)) {
			this.applyAll(map.get(PropertyType.LENGTHTYPE), children, documentId, this::applyLengthType, findBy);
		}

		if(map.containsKey(PropertyType.CONFLENGTH)) {
			this.applyAll(map.get(PropertyType.CONFLENGTH), children, documentId, this::applyConfLength, findBy);
		}
		if(map.containsKey(PropertyType.DATATYPE)) {
			this.applyAll(map.get(PropertyType.DATATYPE), children, documentId, this::applyDatatype, findBy);
		}
		if(map.containsKey(PropertyType.CONSTANTVALUE)) {
			this.applyAll(map.get(PropertyType.CONSTANTVALUE), children, documentId, this::applyConstantValue, findBy);
		}

	}

	/* (non-Javadoc)
	 * @see gov.nist.hit.hl7.resource.change.service.ApplyChange#applyBindingChanges(java.util.Map, gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding, java.lang.String)
	 */
	@Override
	public void applyBindingChanges(Map<PropertyType, List<ChangeItemDomain>> map, ResourceBinding binding,
			String documentId, Level level) throws ApplyChangeException {
		// TODO Auto-generated method stub

		if(map.containsKey(PropertyType.STATEMENT)) {
			for(ChangeItemDomain change:map.get(PropertyType.STATEMENT) ) {
				this.applyConformanceStatments(change, binding, documentId);
			}
		}
		if(map.containsKey(PropertyType.VALUESET)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.VALUESET), binding, documentId,level,  this::applyValueSet);
		}

		if(map.containsKey(PropertyType.SINGLECODE)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.SINGLECODE), binding, documentId,level,  this::applySingleCode);
		}
		if(map.containsKey(PropertyType.PREDICATE)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.PREDICATE), binding, documentId,level, this::applyPredicate);
		}

	}

	/**
	 * @param list
	 * @param binding
	 * @param documentId
	 * @throws ApplyChangeException 
	 */
	@Override
	public void applyConformanceStatments(ChangeItemDomain change, ResourceBinding binding, String documentId) throws ApplyChangeException {
		// TODO Auto-generated method stub

		try {
			ObjectMapper mapper = new ObjectMapper();
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			if (change.getChangeType().equals(ChangeType.ADD)) {
				ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
				cs.setLevel(Level.SEGMENT);
				cs.setId(new ObjectId().toString());
				binding.addConformanceStatement(cs);

			} else if (change.getChangeType().equals(ChangeType.DELETE)) {
				change.setOldPropertyValue(change.getLocation());
				this.bindingService.deleteConformanceStatementById(binding, change.getLocation());
			} else if (change.getChangeType().equals(ChangeType.UPDATE)) {
				ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
				if(!cs.isLocked()) {
					if (cs.getIdentifier() != null) {
						this.bindingService.deleteConformanceStatementById(binding, cs.getId());
					}		      cs.setLevel(Level.SEGMENT);
					binding.addConformanceStatement(cs);
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new ApplyChangeException(change);
		}  

	}

	/**
	 * @param list
	 * @param binding
	 * @param documentId
	 * @param object
	 * @throws ApplyChangeException 
	 */
	private void applyAllStructureBindingChanges(List<ChangeItemDomain> changes, ResourceBinding binding, String documentId,
			Level level, ApplyBindingPropertyFunction fn) throws ApplyChangeException {
		// TODO Auto-generated method stub
		for(ChangeItemDomain change: changes) {
			StructureElementBinding elm = bindingService.findAndCreateStructureElementBindingByIdPath(binding, change.getLocation());
			if(elm !=null) {
				fn.apply( change,  elm,  documentId, level);
			}
		}


	}

	@Override
	public void applyValueSet(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level) throws ApplyChangeException{

		ObjectMapper mapper = new ObjectMapper();
		String jsonInString;
		try {
			jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			change.setOldPropertyValue(elm.getValuesetBindings());
			elm.setValuesetBindings(this.bindingService.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(
					Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
			this.logChangeBinding(elm, change);
		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}
	}
	@Override
	public void applySingleCode(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level) throws ApplyChangeException{
		ObjectMapper mapper = new ObjectMapper();
		try {
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			change.setOldPropertyValue(elm.getInternalSingleCode());
			elm.setInternalSingleCode(mapper.readValue(jsonInString, InternalSingleCode.class));
			this.logChangeBinding(elm, change);

		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}
	}

	@Override
	public void applyPredicate(ChangeItemDomain change, StructureElementBinding elm, String documentId,  Level level) throws ApplyChangeException{
		try {

			ObjectMapper mapper = new ObjectMapper();
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			if (change.getChangeType().equals(ChangeType.ADD)) {
				Predicate cp = mapper.readValue(jsonInString, Predicate.class);
				cp.setLevel(level);
				elm.setPredicate(cp);
			} else if (change.getChangeType().equals(ChangeType.DELETE)) {
				change.setOldPropertyValue(change.getLocation());
				if (elm.getPredicate() != null) {
					change.setOldPropertyValue(elm.getPredicate());
					elm.setPredicate(null);
				}

			} else if (change.getChangeType().equals(ChangeType.UPDATE)) {
				Predicate cp = mapper.readValue(jsonInString, Predicate.class);
				change.setOldPropertyValue(elm.getPredicate());
				cp.setLevel(level);
				elm.setPredicate(cp);
			}
			this.logChangeBinding(elm, change);
		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}



	}



	public void logChangeBinding(StructureElementBinding binding, ChangeItemDomain changeItem) {
		if(binding.getChangeLog() == null) {
			binding.setChangeLog(new HashMap<>());
		}

		if(changeItem.getChangeReason() != null) {
			binding.getChangeLog().put(changeItem.getPropertyType(), changeItem.getChangeReason());
		} else {
			binding.getChangeLog().remove(changeItem.getPropertyType());
		}
	}


	@Override
	public Map<PropertyType, ChangeItemDomain> convertToSingleChangeMap(List<ChangeItemDomain> cItems) {
		Collections.sort(cItems);
		Map<PropertyType, ChangeItemDomain> ret = new HashMap<PropertyType, ChangeItemDomain>();
		cItems.forEach(x -> ret.put(x.getPropertyType(), x));
		return ret;
	}
	@Override
	public Map<PropertyType, List<ChangeItemDomain>> convertToMultiplePropertyChangeMap(
			List<ChangeItemDomain> cItems) {
		Collections.sort(cItems);
		Map<PropertyType, List<ChangeItemDomain>> ret = new HashMap<PropertyType, List<ChangeItemDomain>>();
		for(ChangeItemDomain change: cItems ) {
			if(ret.containsKey(change.getPropertyType())) {
				ret.get(change.getPropertyType()).add(change);
			}else {
				ret.put(change.getPropertyType(), new ArrayList<ChangeItemDomain>(Arrays.asList(change)));
			}
		}  
		return ret;
	}



}
