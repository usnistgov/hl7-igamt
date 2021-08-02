/*
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

import gov.nist.hit.hl7.igamt.common.change.entity.domain.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.LengthType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
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
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
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

	private final List<PropertyType> ALLOW_CHANGE_REASON_STRUCT_ELM = Collections.unmodifiableList(Arrays.asList(
			PropertyType.USAGE,
			PropertyType.NAME,
			PropertyType.CARDINALITYMAX,
			PropertyType.CARDINALITYMIN,
			PropertyType.LENGTHMAX,
			PropertyType.LENGTHMIN,
			PropertyType.CONFLENGTH,
			PropertyType.DATATYPE,
			PropertyType.SEGMENTREF,
			PropertyType.LENGTHTYPE,
			PropertyType.CONSTANTVALUE
	));

	private final List<PropertyType> ALLOW_CHANGE_REASON_BINDING = Collections.unmodifiableList(Arrays.asList(
			PropertyType.VALUESET,
			PropertyType.SINGLECODE,
			PropertyType.PREDICATE
	));

	@Override
	public Map<PropertyType, ChangeItemDomain> convertToSingleChangeMap(List<ChangeItemDomain> cItems) {
		Collections.sort(cItems);
		Map<PropertyType, ChangeItemDomain> ret = new HashMap<>();
		cItems.forEach(x -> ret.put(x.getPropertyType(), x));
		return ret;
	}

	@Override
	public Map<PropertyType, List<ChangeItemDomain>> convertToMultiplePropertyChangeMap(List<ChangeItemDomain> cItems) {
		Collections.sort(cItems);
		Map<PropertyType, List<ChangeItemDomain>> ret = new HashMap<>();
		for(ChangeItemDomain change: cItems ) {
			if(ret.containsKey(change.getPropertyType())) {
				ret.get(change.getPropertyType()).add(change);
			}else {
				ret.put(change.getPropertyType(), new ArrayList<>(Collections.singletonList(change)));
			}
		}
		return ret;
	}

	// ---------------------- Generic Helpers ------------------

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

	private void applyAllStructureBindingChanges(
			List<ChangeItemDomain> changes,
			ResourceBinding binding,
			String documentId,
			Level level,
			ApplyBindingPropertyFunction fn
	) throws ApplyChangeException {

		for(ChangeItemDomain change: changes) {
			StructureElementBinding elm = bindingService.findAndCreateStructureElementBindingByIdPath(binding, change.getLocation());
			if(elm !=null) {
				fn.apply( change,  elm,  documentId, level);
			}
		}
	}

	// --------------------- Hierarchical Apply Methods -------------

	@Override
	public void applyResourceChanges(Resource resource, Map<PropertyType, ChangeItemDomain> map, String documentId) {
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
		if (map.containsKey(PropertyType.DESCRIPTION)) {
			resource.setDescription((String) map.get(PropertyType.DESCRIPTION).getPropertyValue());
		}
	}

	@Override
	public <T extends SubStructElement> void applySubstructureElementChanges(
			Map<PropertyType, List<ChangeItemDomain>> map,
			Set<T> children,
			String documentId,
			FindByFunction<T> findBy
	) throws ApplyChangeException  {

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

	@Override
	public <T extends StructureElement> void applyStructureElementChanges(
			Map<PropertyType,
			List<ChangeItemDomain>> map,
			Set<T> children,
			String documentId,
			FindByFunction<T> findBy
	) throws ApplyChangeException {

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
		if(map.containsKey(PropertyType.CHANGEREASON)) {
			this.applyChangeReason(map.get(PropertyType.CHANGEREASON), children, findBy);
		}
	}

	@Override
	public void applyBindingChanges(Map<PropertyType, List<ChangeItemDomain>> map, ResourceBinding binding,
									String documentId, Level level) throws ApplyChangeException {

		if(map.containsKey(PropertyType.STATEMENT)) {
			for(ChangeItemDomain change:map.get(PropertyType.STATEMENT) ) {
				this.applyConformanceStatements(change, binding, documentId, level);
			}
		}
		if(map.containsKey(PropertyType.VALUESET)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.VALUESET), binding, documentId, level,  this::applyValueSet);
		}
		if(map.containsKey(PropertyType.SINGLECODE)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.SINGLECODE), binding, documentId, level,  this::applySingleCode);
		}
		if(map.containsKey(PropertyType.PREDICATE)) {
			this.applyAllStructureBindingChanges(map.get(PropertyType.PREDICATE), binding, documentId, level, this::applyPredicate);
		}
		if(map.containsKey(PropertyType.CHANGEREASON)) {
			applyChangeReason(map.get(PropertyType.CHANGEREASON), binding);
		}
	}

	//------------- Property Apply Changes ------------

	@Override
	public void applyComments( ChangeItemDomain change, StructureElement elm, String documentId) throws ApplyChangeException {
		ObjectMapper mapper = new ObjectMapper();
		String jsonInString;
		try {
			jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			change.setOldPropertyValue(elm.getComments());
			elm.setComments(new HashSet<>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}
	}

	@Override
	public void applyUsage( ChangeItemDomain change, StructureElement elm, String documentId) {
		change.setOldPropertyValue(elm.getUsage());
		elm.setUsage(Usage.valueOf((String) change.getPropertyValue()));
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

	public void applyChangeReasonStructureElement(ChangeReason changeReason, PropertyType propertyType, StructureElement elm) {
		if(this.ALLOW_CHANGE_REASON_STRUCT_ELM.contains(propertyType)) {
			if(elm.getChangeLog() == null) {
				elm.setChangeLog(new HashMap<>());
			}
			if(changeReason != null) {
				elm.getChangeLog().put(propertyType, changeReason);
			} else {
				elm.getChangeLog().remove(propertyType);
			}
		}
	}

	public void applyChangeReasonBinding(ChangeReason changeReason, PropertyType propertyType, StructureElementBinding elm) {
		if(this.ALLOW_CHANGE_REASON_BINDING.contains(propertyType)) {
			if(elm.getChangeLog() == null) {
				elm.setChangeLog(new HashMap<>());
			}
			if(changeReason != null) {
				elm.getChangeLog().put(propertyType, changeReason);
			} else {
				elm.getChangeLog().remove(propertyType);
			}
		}
	}

	@Override
	public void applyName( ChangeItemDomain change, StructureElement elm, String documentId) {
		change.setOldPropertyValue(elm.getName());
		elm.setName(change.getPropertyValue().toString());
	}

	@Override
	public void applyMinLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getMinLength());
		if (change.getPropertyValue() == null) {
			elm.setMinLength("NA");
		} else {
			elm.setMinLength((String) change.getPropertyValue());
		}
	}

	@Override
	public void applyMaxLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getMaxLength());
		if (change.getPropertyValue() == null) {
			elm.setMaxLength("NA");
		} else {
			elm.setMaxLength((String) change.getPropertyValue());
		}
	}

	@Override
	public void applyLengthType( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getLengthType());
		if (change.getPropertyValue() == null) {
			elm.setLengthType(LengthType.UNSET);
		} else {
			elm.setLengthType(LengthType.valueOf((String) change.getPropertyValue()));
		}
	}

	@Override
	public void applyConfLength( ChangeItemDomain change, SubStructElement elm, String documentId) {
		change.setOldPropertyValue(elm.getConfLength());
		if (change.getPropertyValue() == null) {
			elm.setConfLength("NA");
		} else {
			elm.setConfLength((String) change.getPropertyValue());
		}
	}

	@Override
	public void applyDatatype( ChangeItemDomain change, SubStructElement elm, String documentId) throws ApplyChangeException {
		change.setOldPropertyValue(elm.getRef());
		ObjectMapper mapper = new ObjectMapper();
		try {
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			elm.setRef(mapper.readValue(jsonInString, Ref.class));
		} catch (IOException e) {
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
	}

	public  <T extends StructureElement>  void applyChangeReason(List<ChangeItemDomain> changes, Set<T> children, FindByFunction<T> findBy) throws ApplyChangeException {
		for(ChangeItemDomain change: changes) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				ChangeReasonTarget target = new ChangeReasonTarget(change.getLocation());
				String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
				ChangeReason changeReason = mapper.readValue(jsonInString, ChangeReason.class);
				this.applyChangeReasonStructureElement(changeReason, target.getProperty(), findBy.apply(children, target.getPath()));
			} catch (Exception exception) {
				exception.printStackTrace();
				throw new ApplyChangeException(change); 
			}
		}
	}

	public void applyChangeReason(List<ChangeItemDomain> changes, ResourceBinding resourceBinding) throws ApplyChangeException {
		for(ChangeItemDomain change: changes) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				ChangeReasonTarget target = new ChangeReasonTarget(change.getLocation());
				String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
				ChangeReason changeReason = mapper.readValue(jsonInString, ChangeReason.class);
				StructureElementBinding elm = bindingService.findAndCreateStructureElementBindingByIdPath(resourceBinding, target.getPath());
				this.applyChangeReasonBinding(changeReason, target.getProperty(), elm);
			} catch (Exception exception) {
				exception.printStackTrace();
				throw new ApplyChangeException(change);
			}
		}
	}

	@Override
	public void applyConformanceStatements(ChangeItemDomain change, ResourceBinding binding, String documentId, Level level) throws ApplyChangeException {
		try {
			ObjectMapper mapper = new ObjectMapper();
			String jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			if (change.getChangeType().equals(ChangeType.ADD)) {
				ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
				cs.setLevel(this.getAssertionLevel(level, cs.getContext()));
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
					}
					cs.setLevel(this.getAssertionLevel(level, cs.getContext()));
					binding.addConformanceStatement(cs);
				}
			}
		} catch (IOException e) {
			throw new ApplyChangeException(change);
		}
	}


	private Level getAssertionLevel(Level level, InstancePath context) {
		if(level.equals(Level.CONFORMANCEPROFILE)) {
			if(context!= null) {
				return Level.GROUP;
			}
		}
		return level;
	}

	@Override
	public void applyValueSet(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level) throws ApplyChangeException{
		ObjectMapper mapper = new ObjectMapper();
		String jsonInString;
		try {
			jsonInString = mapper.writeValueAsString(change.getPropertyValue());
			change.setOldPropertyValue(elm.getValuesetBindings());
			elm.setValuesetBindings(this.bindingService.convertDisplayValuesetBinding(new HashSet<>(
					Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
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
				cp.setLevel(this.getAssertionLevel(level, cp.getContext()));
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
				cp.setLevel(this.getAssertionLevel(level, cp.getContext()));
				elm.setPredicate(cp);
			}
		} catch (IOException e) {
			e.printStackTrace();
			throw new ApplyChangeException(change);
		}
	}

}
