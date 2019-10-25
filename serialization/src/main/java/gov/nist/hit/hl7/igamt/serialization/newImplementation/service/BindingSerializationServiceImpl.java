package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class BindingSerializationServiceImpl implements BindingSerializationService {

	
	  
	@Override
	public Element serializeBinding(Binding binding, Map<String, Set<ValuesetBindingDataModel>> valuesetMap, String name) throws SerializationException {
		if(binding != null) {
//	    try {
	      Element bindingElement = new Element("Binding");
	      bindingElement.addAttribute(
	          new Attribute("elementId", binding.getElementId() != null ? binding.getElementId() : ""));
	      if (binding.getChildren() != null && binding.getChildren().size() > 0) {
//	    	  List<ValuesetBindingDataModel> vsDataModel = valuesetMap.values().stream().flatMap((set) -> {
//	    		  return set.stream();
//	    	  }).collect(Collectors.toList());
	        Element structureElementBindingsElement = this
	            .serializeStructureElementBindings(binding.getChildren(), name, valuesetMap);
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
//	      for(StructureElementBinding structureElementBinding : binding.getChildren()) {
//	    	  // need to handle exception here for database call
//	    	  if(structureElementBinding != null && structureElementBinding.getPredicateId() != null) {
//	    	  Predicate predicate = predicateRepository.findById(structureElementBinding.getPredicateId()).get();
//	          Element predicateElement = constraintSerializationService.serializePredicate(predicate, predicate.getLocation());
//	          if (predicateElement != null) {
//		            this.predicates.add(predicateElement);
//		            bindingElement.appendChild(predicateElement);
//		          }
//	    	  }
//	      }
	      return bindingElement;
//	    } catch (Exception exception) {
//	      throw new SerializationException(exception, Type.BINDING, "Binding");
//	    }
		}
		return null;
	}

	private Element serializeStructureElementBindings(Set<StructureElementBinding> structureElementBindings, String name, Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
	    if (structureElementBindings != null) {
	      Element structureElementBindingsElement = new Element("StructureElementBindings");
	      for (StructureElementBinding structureElementBinding : structureElementBindings) {
	        if (structureElementBinding != null) {
	          Element structureElementBindingElement = this.serializeStructureElementBinding(
	              structureElementBinding, name, valuesetMap);
	          if (structureElementBindingElement != null) {
	            structureElementBindingsElement.appendChild(structureElementBindingElement);
	          }
	        }
	      }
	      return structureElementBindingsElement;
	    }
	    return null;
	  
	}

	private Element serializeStructureElementBinding(StructureElementBinding structureElementBinding, String name, Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
	    if (structureElementBinding != null ) {
	      Element structureElementBindingElement = new Element("StructureElementBinding");
	      structureElementBindingElement.addAttribute(new Attribute("elementId",
	          structureElementBinding.getElementId() != null ? structureElementBinding.getElementId()
	              : ""));
	      if(structureElementBinding.getLocationInfo() != null) {
	    	  System.out.println("LocationInfo in not null");
	    	  structureElementBindingElement.addAttribute(new Attribute("LocationInfoName", structureElementBinding.getLocationInfo() != null ? structureElementBinding.getLocationInfo().getName() : ""));
	    	  structureElementBindingElement.addAttribute( new Attribute("LocationInfoPosition", structureElementBinding.getLocationInfo() != null ? name + "-" + String.valueOf(structureElementBinding.getLocationInfo().getPosition()) : ""));}
	      if (structureElementBinding.getChildren() != null
	          && structureElementBinding.getChildren().size() > 0) {
	        Element structureElementBindingsElement = this.serializeStructureElementBindings(
		              structureElementBinding.getChildren(), name, valuesetMap);
	        if (structureElementBindingsElement != null) {
	          structureElementBindingElement.appendChild(structureElementBindingsElement);
	        }
	      }
	      if (structureElementBinding.getValuesetBindings() != null) {
	        for (ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
	          Element valuesetBindingElement =
	              this.serializeValuesetBinding(valuesetBinding, valuesetMap, name);
	          if (valuesetBindingElement != null) {
	            structureElementBindingElement.appendChild(valuesetBindingElement);
	          }
	        }
	      }
	        if (structureElementBinding.getInternalSingleCode() != null) {
	          structureElementBindingElement.addAttribute(new Attribute("singleCodeId",
	              structureElementBinding.getInternalSingleCode().getCode()));
	        }
//	        if (structureElementBinding.getExternalSingleCode() != null) {
//	          Element externalSingleCodeElement =
//	              this.serializeExternalSingleCode(structureElementBinding.getExternalSingleCode());
//	          if (externalSingleCodeElement != null) {
//	            structureElementBindingElement.appendChild(externalSingleCodeElement);
//	          }
//	        }
	      return structureElementBindingElement;
	    }
	    return null;  
	}

	private Element serializeValuesetBinding(ValuesetBinding valuesetBinding, Map<String,Set<ValuesetBindingDataModel>> valuesetMap, String name) {
			if (valuesetBinding != null && valuesetBinding.getValueSets() != null && !valuesetBinding.getValueSets().isEmpty()) {
				List<ValuesetBindingDataModel> vsDataModel = valuesetMap.values().stream().flatMap((set) -> {
		    		  return set.stream();
		    	  }).collect(Collectors.toList());
					Element valuesetBindingElement = new Element("ValuesetBinding");
//					valuesetBindingElement.addAttribute(new Attribute("id", valuesetBinding.));
					valuesetBindingElement
							.addAttribute(new Attribute("name", convertValuesetIdsToBindingIdentifier(valuesetBinding.getValueSets(), vsDataModel)));
//					System.out.println("for " + convertValuesetNamesToString(valuesetBinding.getValueSets()) + " resulst is : " + convertValuesetIdsToBindingIdentifier(valuesetBinding.getValueSets(), vsDataModel) );
					valuesetBindingElement.addAttribute(new Attribute("strength",
							valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().name() : ""));
					valuesetBindingElement.addAttribute(new Attribute("bindingLocation",
							valuesetBinding.getValueSets() != null ? name + "-"+getBindingLocationFromMap(valuesetMap,valuesetBinding) : ""));
					valuesetBindingElement.addAttribute(new Attribute("locations",
							valuesetBinding.getValuesetLocations() != null
									? convertValuesetLocationsToString(valuesetBinding.getValuesetLocations())
									: ""));
					return valuesetBindingElement;
			}		
		return null;	
	}
	
	private String convertValuesetLocationsToString(Set<Integer> valuesetLocations) {
	    Set<String> valuesetLocationsString = new HashSet<>();
	    for (Integer location : valuesetLocations) {
	      valuesetLocationsString.add(String.valueOf(location));
	    }
	    return String.join(", ", valuesetLocationsString);
	  }
	
	private String getBindingLocationFromMap(Map<String,Set<ValuesetBindingDataModel>> valuesetMap,ValuesetBinding valuesetBinding) {
		
		List<ValuesetBindingDataModel> vsDataModel = valuesetMap.values().stream().flatMap((set) -> {
  		  return set.stream();
  	  }).collect(Collectors.toList());
		
		String location = "Not found in MAP";
		for(Set<ValuesetBindingDataModel> set : valuesetMap.values()) {
			for(ValuesetBindingDataModel valuesetBindingDataModel : set) {
				if(valuesetBindingDataModel.getValuesetBinding().getValueSets().equals(valuesetBinding.getValueSets())) {
					System.out.println("Found 2 sets equal");
					for(String key : valuesetMap.keySet()) {
						if(valuesetMap.get(key).equals(set)) {
							location = key;
							System.out.println(" And here is the location : " +key);
						}
					}
				}
			}
		}
		return location;
	}

	private String convertValuesetNamesToString(List<String> list) {
//	    Set<String> valuesetNameString = new HashSet<>();
//	    for (String name : valuesetNames) {
//	      valuesetLocationsString.add(String.valueOf(location));
//	    }
	    return String.join(", ", list);
	  }
	
	private String convertValuesetIdsToBindingIdentifier(List<String> listIds, List<ValuesetBindingDataModel> listVsDataModels) {
		Set<String> bindingIdentifiersList = new HashSet<>(); 
		for(String id :listIds ) {
			for(ValuesetBindingDataModel valuesetBindingDataModel : listVsDataModels ) {
				if(valuesetBindingDataModel.getId().equals(id)) {
					bindingIdentifiersList.add(valuesetBindingDataModel.getBindingIdentifier());
				}
			}
		}
	    return String.join(",", bindingIdentifiersList);
	  }

}
