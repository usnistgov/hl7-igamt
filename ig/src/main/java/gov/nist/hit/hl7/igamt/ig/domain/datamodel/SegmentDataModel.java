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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 * @author jungyubw
 *
 */
public class SegmentDataModel implements Serializable, Comparable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8924767585140914700L;

	private Segment model;

	private Set<ConformanceStatement> conformanceStatements = new HashSet<ConformanceStatement>();
	private Map<String, Predicate> predicateMap = new HashMap<String, Predicate>();
	private Map<String, InternalSingleCode> singleCodeMap = new HashMap<String, InternalSingleCode>();
	private Map<String, Set<ValuesetBindingDataModel>> valuesetMap = new HashMap<String, Set<ValuesetBindingDataModel>>();
//	private CoConstraintTable coConstraintTable = new CoConstraintTable();

	private Set<FieldDataModel> fieldDataModels = new HashSet<FieldDataModel>();

	public Segment getModel() {
		return model;
	}

	public void setModel(Segment model) {
		this.model = model;
	}

	public Map<String, Predicate> getPredicateMap() {
		return predicateMap;
	}

	public void setPredicateMap(Map<String, Predicate> predicateMap) {
		this.predicateMap = predicateMap;
	}

	public Map<String, InternalSingleCode> getSingleCodeMap() {
		return singleCodeMap;
	}

	public void setSingleCodeMap(Map<String, InternalSingleCode> singleCodeMap) {
		this.singleCodeMap = singleCodeMap;
	}

	public Map<String, Set<ValuesetBindingDataModel>> getValuesetMap() {
		return valuesetMap;
	}

	public void setValuesetMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
		this.valuesetMap = valuesetMap;
	}

//	public CoConstraintTable getCoConstraintTable() {
//		return coConstraintTable;
//	}
//
//	public void setCoConstraintTable(CoConstraintTable coConstraintTable) {
//		this.coConstraintTable = coConstraintTable;
//	}

	/**
	 * @param s
	 * @param valuesetBindingDataModelMap
	 * @param conformanceStatementRepository
	 * @param predicateRepository
	 */
	public void putModel(Segment s, DatatypeService datatypeService, Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap, ConformanceStatementRepository conformanceStatementRepository, PredicateRepository predicateRepository) {
		this.model = s;

		if (s.getBinding() != null){
			if(s.getBinding().getConformanceStatements() != null){
				for(ConformanceStatement cs: s.getBinding().getConformanceStatements()){
					this.conformanceStatements.add(cs);
				}
			}
			if (s.getBinding().getChildren() != null) {
				this.popPathBinding(s.getName(), s.getBinding().getChildren(), null, predicateRepository, valuesetBindingDataModelMap);
			}

		}


		if(s.getChildren() != null) {
			s.getChildren().forEach(f -> {
				String key = f.getPosition() + "";
				if(f.getRef() != null && f.getRef().getId() != null){
					Datatype childDt = datatypeService.findById(f.getRef().getId());
					if(childDt != null) {
						this.fieldDataModels.add(new FieldDataModel(
								f, 
								this.predicateMap.get(key),
								this.singleCodeMap.get(key),
								this.valuesetMap.get(key),
								new DatatypeBindingDataModel(childDt)
								));    
					}
				}
			});
		}
	}

	/**
	 * @param children
	 * @param object
	 * @param predicateRepository
	 * @param valuesetBindingDataModelMap
	 */
	private void popPathBinding(String readablePath, Set<StructureElementBinding> sebs, String path, PredicateRepository predicateRepository, Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap) {
		for (StructureElementBinding seb : sebs) {
			String key;
			String localPath;
			if(path == null){
				key = seb.getLocationInfo().getPosition() + "";
				localPath = readablePath + "-" + seb.getLocationInfo().getPosition();
			}else {
				key = path + "." + seb.getLocationInfo().getPosition();
				localPath = readablePath + "." + seb.getLocationInfo().getPosition();
			}

			if(seb.getPredicate() != null){
				Predicate p = seb.getPredicate();
				p.setLocation(localPath + "(" + seb.getLocationInfo().getName() + ")");
				this.predicateMap.put(key, p); 
			}

			if(seb.getInternalSingleCode() != null){
				this.singleCodeMap.put(key, seb.getInternalSingleCode());
			}

			if(seb.getValuesetBindings() != null && seb.getValuesetBindings().size() > 0){
				Set<ValuesetBindingDataModel> vbdm = new HashSet<ValuesetBindingDataModel>();
				for(ValuesetBinding vb : seb.getValuesetBindings()) {
					if(vb.getValueSets() !=null) {
						for(String s: vb.getValueSets()) {
							ValuesetBindingDataModel valuesetBindingDataModel = valuesetBindingDataModelMap.get(s);
							if(valuesetBindingDataModel != null) {
								valuesetBindingDataModel.setValuesetBinding(vb);
								vbdm.add(valuesetBindingDataModel);
							}
						}
					}

					if(vbdm != null && vbdm.size() > 0) {
						this.valuesetMap.put(key, vbdm);          
					}
				}

				if (seb.getChildren() != null) {
					this.popPathBinding(localPath, seb.getChildren(), key, predicateRepository, valuesetBindingDataModelMap);
				}
			}

		}
	}

	public Set<ConformanceStatement> getConformanceStatements() {
		return conformanceStatements;
	}

	public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
		this.conformanceStatements = conformanceStatements;
	}

	public Set<FieldDataModel> getFieldDataModels() {
		return fieldDataModels;
	}

	public void setFieldDataModels(Set<FieldDataModel> fieldDataModels) {
		this.fieldDataModels = fieldDataModels;
	}

	/**
	 * @param parseInt
	 * @return
	 */
	public FieldDataModel findFieldDataModelByPosition(int position) {
		for(FieldDataModel fModel : this.fieldDataModels) {
			if (fModel.getModel().getPosition() == position) return fModel;
		}
		return null;
	}

	@Override
	public int compareTo(Object u) {
		// TODO Auto-generated method stub
		if (getModel().getLabel() == null || ((SegmentDataModel) u).getModel().getLabel() == null) {
		      return 0;
		    }
		    return getModel().getLabel().compareTo(((SegmentDataModel) u).getModel().getLabel());
	}
}
