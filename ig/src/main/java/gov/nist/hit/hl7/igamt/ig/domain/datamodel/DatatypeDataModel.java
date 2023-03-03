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
import java.util.List;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;

/**
 * @author jungyubw
 *
 */
public class DatatypeDataModel implements Serializable, Comparable {
	private Datatype model;

	private Set<ConformanceStatement> conformanceStatements = new HashSet<ConformanceStatement>();
	private Map<String, Predicate> predicateMap = new HashMap<String, Predicate>();
	private Map<String, List<SingleCodeBinding>> singleCodeMap = new HashMap<String, List<SingleCodeBinding>>();
	private Map<String, Set<ValuesetBindingDataModel>> valuesetMap = new HashMap<String, Set<ValuesetBindingDataModel>>();
	private Set<ComponentDataModel> componentDataModels = new HashSet<ComponentDataModel>();

	public Datatype getModel() {
		return model;
	}

	public void setModel(Datatype model) {
		this.model = model;
	}

	public Map<String, Predicate> getPredicateMap() {
		return predicateMap;
	}

	public void setPredicateMap(Map<String, Predicate> predicateMap) {
		this.predicateMap = predicateMap;
	}

	public Map<String, List<SingleCodeBinding>> getSingleCodeMap() {
		return singleCodeMap;
	}

	public void setSingleCodeMap(Map<String, List<SingleCodeBinding>> singleCodeMap) {
		this.singleCodeMap = singleCodeMap;
	}

	public Map<String, Set<ValuesetBindingDataModel>> getValuesetMap() {
		return valuesetMap;
	}

	public void setValuesetMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
		this.valuesetMap = valuesetMap;
	}

	/**
	 * @param d
	 * @param valuesetBindingDataModelMap
	 * @param conformanceStatementRepository
	 * @param predicateRepository
	 */
	public void putModel(Datatype d, DatatypeService dataytpeService, InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService, Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap, ConformanceStatementRepository conformanceStatementRepository, PredicateRepository predicateRepository) {
		this.model = d;

		if (d.getBinding() != null){
			if(d.getBinding().getConformanceStatements() != null){
				for(ConformanceStatement cs: d.getBinding().getConformanceStatements()){
					this.conformanceStatements.add(cs);
				}
			}
		}

		if ( d.getBinding() !=null && d.getBinding().getChildren() != null) {
			this.popPathBinding(d.getName(), d.getBinding().getChildren(), null, predicateRepository, valuesetBindingDataModelMap);
		}

		if (d instanceof ComplexDatatype) {
			ComplexDatatype cd = (ComplexDatatype)d;

			if(cd.getComponents() != null) {
				cd.getComponents().forEach(c -> {
					String key = c.getPosition() + "";
					if(c.getRef() != null && c.getRef().getId() != null){
						Datatype childDt = dataytpeService.findById(c.getRef().getId());
						if(childDt == null) {
							childDt = inMemoryDomainExtensionService.findById(c.getRef().getId(), ComplexDatatype.class);
						}
						if(childDt != null) {
							this.componentDataModels.add(new ComponentDataModel(
									c, 
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
	}

	/**
	 * @param children
	 * @param object
	 */
	private void popPathBinding(String readablePath, Set<StructureElementBinding> sebs, String path, PredicateRepository predicateRepository,  Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap) {
		for (StructureElementBinding seb : sebs) {
			String key;
			String localPath;
			localPath = readablePath + "." + seb.getLocationInfo().getPosition();
			if(path == null){
				key = seb.getLocationInfo().getPosition() + "";
			}else {
				key = path + "." + seb.getLocationInfo().getPosition();
			}

			if(seb.getPredicate() != null){
				Predicate p = seb.getPredicate();
				p.setLocation(localPath + "(" + seb.getLocationInfo().getName() + ")");
				this.predicateMap.put(key, p);
							
			}
			
			//Fixed SingleCode_20220625
			if(seb.getSingleCodeBindings() != null) {
				this.singleCodeMap.put(key, seb.getSingleCodeBindings());
				
			}

			if(seb.getValuesetBindings() != null && seb.getValuesetBindings().size() > 0){
				Set<ValuesetBindingDataModel> vbdm = new HashSet<ValuesetBindingDataModel>();
				for(ValuesetBinding vb : seb.getValuesetBindings()) {
					if(vb.getValueSets() != null) {
						for(String s : vb.getValueSets()) {
							ValuesetBindingDataModel valuesetBindingDataModel = valuesetBindingDataModelMap.get(s);
							if(valuesetBindingDataModel != null) {
								valuesetBindingDataModel.setValuesetBinding(vb);
								vbdm.add(valuesetBindingDataModel);
							}
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

	public Set<ConformanceStatement> getConformanceStatements() {
		return conformanceStatements;
	}

	public void setConformanceStatements(Set<ConformanceStatement> conformanceStatemens) {
		this.conformanceStatements = conformanceStatemens;
	}

	public Set<ComponentDataModel> getComponentDataModels() {
		return componentDataModels;
	}

	public void setComponentDataModels(Set<ComponentDataModel> componentDataModels) {
		this.componentDataModels = componentDataModels;
	}

	public ComponentDataModel findComponentDataModelByPosition(int position) {
		for(ComponentDataModel cModel : this.componentDataModels) {
			if (cModel.getModel().getPosition() == position) return cModel;
		}
		return null;
	}

	@Override
	public int compareTo(Object u) {
		// TODO Auto-generated method stub
		if (getModel().getLabel() == null || ((DatatypeDataModel) u).getModel().getLabel() == null) {
		      return 0;
		    }
		    return getModel().getLabel().compareTo(((DatatypeDataModel) u).getModel().getLabel());
	}

}
