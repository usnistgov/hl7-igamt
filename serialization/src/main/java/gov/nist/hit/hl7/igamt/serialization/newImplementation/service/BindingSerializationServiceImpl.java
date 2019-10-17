package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class BindingSerializationServiceImpl implements BindingSerializationService {

	  private Set<Element> conformanceStatements;
	  private Set<Element> predicates;
	
	  @Autowired
	  private ConformanceStatementRepository conformanceStatementRepository;
	  
	  @Autowired
	  private PredicateRepository predicateRepository;
	  
	  @Autowired
	  private ConstraintSerializationService constraintSerializationService;
	  
	@Override
	public Element serializeBinding(IgDataModel igDataModel, Binding binding) throws SerializationException {
	    try {
	      Element bindingElement = new Element("Binding");
	      bindingElement.addAttribute(
	          new Attribute("elementId", binding.getElementId() != null ? binding.getElementId() : ""));
	      if (binding.getChildren() != null && binding.getChildren().size() > 0) {
	        Element structureElementBindingsElement = this
	            .serializeStructureElementBindings(binding.getChildren(),igDataModel);
	        if (structureElementBindingsElement != null) {
	          bindingElement.appendChild(structureElementBindingsElement);
	        }
	      }
//	      if (binding instanceof ResourceBinding) {
//	        if (((ResourceBinding) binding).getConformanceStatementIds() != null) {
//	          for (String id : ((ResourceBinding) binding).getConformanceStatementIds()) {
//	            ConformanceStatement conformanceStatement = this.conformanceStatementRepository.findById(id).get();
//	            Element conformanceStatementElement = constraintSerializationService.serializeConformanceStatement(conformanceStatement);
//	            if (conformanceStatementElement != null) {
////	              this.conformanceStatements.add(conformanceStatementElement);
//	              bindingElement.appendChild(conformanceStatementElement);
//	            }
//	          }
//	        }
//	      }
	      for(StructureElementBinding structureElementBinding : binding.getChildren()) {
	    	  // need to handle exception here for database call
	    	  if(structureElementBinding != null && structureElementBinding.getPredicateId() != null) {
	    	  Predicate predicate = predicateRepository.findById(structureElementBinding.getPredicateId()).get();
	          Element predicateElement = constraintSerializationService.serializePredicate(predicate, predicate.getLocation());
	          if (predicateElement != null) {
		            this.predicates.add(predicateElement);
		            bindingElement.appendChild(predicateElement);
		          }
	    	  }
	      }
	      return bindingElement;
	    } catch (Exception exception) {
	      throw new SerializationException(exception, Type.BINDING, "Binding");
	    }
	  
	}

	private Element serializeStructureElementBindings(Set<StructureElementBinding> structureElementBindings, IgDataModel igDataModel) {
	    if (structureElementBindings != null) {
	      Element structureElementBindingsElement = new Element("StructureElementBindings");
	      for (StructureElementBinding structureElementBinding : structureElementBindings) {
	        if (structureElementBinding != null) {
	          Element structureElementBindingElement = this.serializeStructureElementBinding(
	              structureElementBinding, igDataModel);
	          if (structureElementBindingElement != null) {
	            structureElementBindingsElement.appendChild(structureElementBindingElement);
	          }
	        }
	      }
	      return structureElementBindingsElement;
	    }
	    return null;
	  
	}

	private Element serializeStructureElementBinding(StructureElementBinding structureElementBinding,
			IgDataModel igDataModel) {
	    if (structureElementBinding != null) {
	      Element structureElementBindingElement = new Element("StructureElementBinding");
	      structureElementBindingElement.addAttribute(new Attribute("elementId",
	          structureElementBinding.getElementId() != null ? structureElementBinding.getElementId()
	              : ""));
	      if (structureElementBinding.getChildren() != null
	          && structureElementBinding.getChildren().size() > 0) {
	        Element structureElementBindingsElement = this.serializeStructureElementBinding(
		              structureElementBinding, igDataModel);
	        if (structureElementBindingsElement != null) {
	          structureElementBindingElement.appendChild(structureElementBindingsElement);
	        }
	      }
	      if (structureElementBinding.getValuesetBindings() != null) {
	        for (ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
	          Element valuesetBindingElement =
	              this.serializeValuesetBinding(valuesetBinding, igDataModel);
	          if (valuesetBindingElement != null) {
	            structureElementBindingElement.appendChild(valuesetBindingElement);
	          }
	        }
	      }
	      return structureElementBindingElement;
	    }
	    return null;  
	}

//	private Element serializeValuesetBinding(ValuesetBinding valuesetBinding, IgDataModel igDataModel) {
//		if (valuesetNamesMap != null) {
//			if (!valuesetBinding.getValuesetId().isEmpty()) {
//				if (valuesetNamesMap != null && valuesetNamesMap.containsKey(valuesetBinding.getValuesetId())) {
//					Element valuesetBindingElement = new Element("ValuesetBinding");
//					valuesetBindingElement.addAttribute(new Attribute("id", valuesetBinding.getValuesetId()));
//					valuesetBindingElement
//							.addAttribute(new Attribute("name", valuesetNamesMap.get(valuesetBinding.getValuesetId())));
//					valuesetBindingElement.addAttribute(new Attribute("strength",
//							valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().name() : ""));
//					valuesetBindingElement.addAttribute(new Attribute("strength",
//							valuesetBinding.getValuesetLocations() != null
//									? convertValuesetLocationsToString(valuesetBinding.getValuesetLocations())
//									: ""));
//					return valuesetBindingElement;
//				} else {
//					throw new ValuesetNotFoundException(valuesetBinding.getValuesetId());
//				}
//
//			}
//		}
//		return null;
//	
//	}

}
