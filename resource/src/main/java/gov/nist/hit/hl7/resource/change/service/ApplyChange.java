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
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface ApplyChange {


	/**
	 * @param resource
	 * @param map
	 * @param documentId
	 * @throws Exception
	 */
	void apply(Resource resource, Map<PropertyType, ChangeItemDomain> map, String documentId) throws Exception;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @throws Exception
	 */
	void applyUsage(ChangeItemDomain change, StructureElement elm, String documentId);
	
	<T extends SubStructElement> void applySubstructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> children, String documentId)
			throws ApplyChangeException;

	<T extends StructureElement> void applyStructureElementChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> children, String documentId)
			throws ApplyChangeException;
	
	<T extends MsgStructElement> void applyMsgStructElementChanges(Map<PropertyType, List<ChangeItemDomain>> map, Set<T> children, String documentId)
			throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyName(ChangeItemDomain change, StructureElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyMinLength(ChangeItemDomain change, SubStructElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyMaxLength(ChangeItemDomain change, SubStructElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyLengthType(ChangeItemDomain change, SubStructElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyConfLength(ChangeItemDomain change, SubStructElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @throws JsonProcessingException 
	 * @throws ApplyChangeException 
	 */
	void applyDatatype(ChangeItemDomain change, SubStructElement elm, String documentId) throws JsonProcessingException, ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @throws ApplyChangeException 
	 */
	void applyComments(ChangeItemDomain change, StructureElement elm, String documentId) throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyConstantValue(ChangeItemDomain change, SubStructElement elm, String documentId);


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 */
	void applyDefinitionText(ChangeItemDomain change, StructureElement elm, String documentId);

	/**
	 * @param change
	 * @param binding
	 * @param documentId
	 * @throws ApplyChangeException 
	 */
	public void applyConformanceStatments(ChangeItemDomain change, ResourceBinding binding, String documentId) throws ApplyChangeException ;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyPredicate(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level)
			throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyValueSet(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level)
			throws ApplyChangeException;


	/**
	 * @param change
	 * @param elm
	 * @param documentId
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applySingleCode(ChangeItemDomain change, StructureElementBinding elm, String documentId, Level level)
			throws ApplyChangeException;


	/**
	 * @param map
	 * @param binding
	 * @param documentId
	 * @param level
	 * @throws ApplyChangeException
	 */
	void applyBindingChanges(Map<PropertyType, List<ChangeItemDomain>> map, ResourceBinding binding, String documentId,
			Level level) throws ApplyChangeException;


	public <T extends StructureElement> void applyAll( List<ChangeItemDomain> changes, Set<T> structureElments,  String documentId, ApplyPropertyFunction<T> fn) throws ApplyChangeException;


	/**
	 * @param binding
	 * @param changeItem
	 */
	void logChangeBinding(StructureElement binding, ChangeItemDomain changeItem);


	/**
	 * @param structureElement
	 * @param changeItem
	 */
	void logChangeStructureElement(StructureElement structureElement, ChangeItemDomain changeItem);


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


}
