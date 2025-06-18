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
package gov.nist.hit.hl7.resource.change.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface ApplyChange {


	/**
	 * @param resource
	 * @param map
	 * @throws Exception
	 */
	void applyResourceChanges(Resource resource, Map<PropertyType, ChangeItemDomain> map) throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @throws Exception
	 */
	void applyUsage(ChangeItemDomain change, StructureElement elm);
	
	<T extends SubStructElement> void applySubstructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> children, FindByFunction<T> findBy)
			throws ApplyChangeException;

	<T extends StructureElement> void applyStructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> children, FindByFunction<T> findBy)
			throws ApplyChangeException;

	/**
	 * @param change
	 * @param elm
	 */
	void applyName(ChangeItemDomain change, StructureElement elm);


	/**
	 * @param change
	 * @param elm
	 */
	void applyMinLength(ChangeItemDomain change, SubStructElement elm);


	/**
	 * @param change
	 * @param elm
	 */
	void applyMaxLength(ChangeItemDomain change, SubStructElement elm);


	/**
	 * @param change
	 * @param elm
	 */
	void applyLengthType(ChangeItemDomain change, SubStructElement elm);


	/**
	 * @param change
	 * @param elm
	 */
	void applyConfLength(ChangeItemDomain change, SubStructElement elm);


	/**
	 * @param change
	 * @param elm
	 * @throws JsonProcessingException 
	 * @throws ApplyChangeException 
	 */
	void applyDatatype(ChangeItemDomain change, SubStructElement elm) throws JsonProcessingException, ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @throws ApplyChangeException 
	 */
	void applyComments(ChangeItemDomain change, StructureElement elm) throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 */
	void applyConstantValue(ChangeItemDomain change, SubStructElement elm);


	/**
	 * @param change
	 * @param elm
	 */
	void applyDefinitionText(ChangeItemDomain change, StructureElement elm);

	/**
	 * @param change
	 * @param binding
	 * @throws ApplyChangeException 
	 */
	public void applyConformanceStatements(ChangeItemDomain change, ResourceBinding binding, Level level) throws ApplyChangeException ;


	/**
	 * @param change
	 * @param elm
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyPredicate(ChangeItemDomain change, StructureElementBinding elm, Level level)
			throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyValueSet(ChangeItemDomain change, StructureElementBinding elm, Level level)
			throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applySingleCode(ChangeItemDomain change, StructureElementBinding elm, Level level)
			throws ApplyChangeException;


	/**
	 * @param map
	 * @param binding
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyBindingChanges(Map<PropertyType, List<ChangeItemDomain>> map, ResourceBinding binding,
			Level level) throws ApplyChangeException;


	<T extends StructureElement> void applyAll( List<ChangeItemDomain> changes, Set<T> structureElments, ApplyPropertyFunction<T> fn, FindByFunction<T> findBy) throws ApplyChangeException;


	/**
	 * @param cItems
	 * @return
	 */
	Map<PropertyType, ChangeItemDomain> convertToSingleChangeMap(List<ChangeItemDomain> cItems);


	/**
	 * @param cItems
	 * @return
	 */
	Map<PropertyType, List<ChangeItemDomain>> convertToMultiplePropertyChangeMap(List<ChangeItemDomain> cItems);


	/**
	 * @param structureElments
	 * @param location
	 * @return
	 */
	 <T extends StructureElement> T findStructElementById(Set<T> structureElments, String location);


	/**
	 * @param map
	 * @param slicings
	 * @param segment
	 * @throws ApplyChangeException 
	 */
	 <T extends Slicing>  void applySlicingChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> slicings,
			Type segment) throws ApplyChangeException;


}
