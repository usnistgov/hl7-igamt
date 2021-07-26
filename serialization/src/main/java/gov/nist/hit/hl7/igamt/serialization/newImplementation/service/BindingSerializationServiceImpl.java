package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.*;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
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
	@Autowired
	ValuesetService valuesetService;
	@Override
	public Element serializeBinding(Binding binding, Map<String, Set<ValuesetBindingDataModel>> valuesetMap,
			String name, Map<String, Boolean> bindedPaths) throws SerializationException {
		if (binding != null) {
			// try {
			Element bindingElement = new Element("Binding");
			bindingElement.addAttribute(
					new Attribute("elementId", binding.getElementId() != null ? binding.getElementId() : ""));
			if (binding.getChildren() != null && binding.getChildren().size() > 0) {
				// List<ValuesetBindingDataModel> vsDataModel =
				// valuesetMap.values().stream().flatMap((set) -> {
				// return set.stream();
				// }).collect(Collectors.toList());
			  
			  Set<StructureElementBinding>  filtered = binding.getChildren().stream()               
	                .filter(child ->  (bindedPaths.containsKey(child.getElementId()) && bindedPaths.get(child.getElementId()))). 
	                collect(Collectors.toSet()); 
				Element structureElementBindingsElement = this.serializeStructureElementBindings(null,filtered,
						name, valuesetMap);
				if (structureElementBindingsElement != null) {
					bindingElement.appendChild(structureElementBindingsElement);
				}
			}
			// if (binding instanceof ResourceBinding) {
			// if (((ResourceBinding) binding).getConformanceStatementIds() != null) {
			// for (String id : ((ResourceBinding) binding).getConformanceStatementIds()) {
			// ConformanceStatement conformanceStatement =
			// this.conformanceStatementRepository.findById(id).get();
			// Element conformanceStatementElement =
			// constraintSerializationService.serializeConformanceStatement(conformanceStatement);
			// if (conformanceStatementElement != null) {
			//// this.conformanceStatements.add(conformanceStatementElement);
			// bindingElement.appendChild(conformanceStatementElement);
			// }
			// }
			// }
			// }
			// for(StructureElementBinding structureElementBinding : binding.getChildren())
			// {
			// // need to handle exception here for database call
			// if(structureElementBinding != null &&
			// structureElementBinding.getPredicateId() != null) {
			// Predicate predicate =
			// predicateRepository.findById(structureElementBinding.getPredicateId()).get();
			// Element predicateElement =
			// constraintSerializationService.serializePredicate(predicate,
			// predicate.getLocation());
			// if (predicateElement != null) {
			// this.predicates.add(predicateElement);
			// bindingElement.appendChild(predicateElement);
			// }
			// }
			// }
			return bindingElement;
			// } catch (Exception exception) {
			// throw new SerializationException(exception, Type.BINDING, "Binding");
			// }
		}
		return null;
	}

	private Element serializeStructureElementBindings(String elementIdParent, Set<StructureElementBinding> structureElementBindings,
			String name, Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
		if (structureElementBindings != null) {
			Element structureElementBindingsElement = new Element("StructureElementBindings");
			for (StructureElementBinding structureElementBinding : structureElementBindings) {
				if (structureElementBinding != null) {
					Element structureElementBindingElement = this
							.serializeStructureElementBinding(elementIdParent, structureElementBinding, name, valuesetMap);
					if (structureElementBindingElement != null) {
						structureElementBindingsElement.appendChild(structureElementBindingElement);
					}
				}
			}
			return structureElementBindingsElement;
		}
		return null;

	}

	private Element serializeStructureElementBinding(String elementIdParent, StructureElementBinding structureElementBinding, String name,
			Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
		if (structureElementBinding != null) {
			Element structureElementBindingElement = new Element("StructureElementBinding");
			structureElementBindingElement.addAttribute(new Attribute("elementId",
					structureElementBinding.getElementId() != null ? structureElementBinding.getElementId() : ""));
			if (structureElementBinding.getLocationInfo() != null) {
				structureElementBindingElement.addAttribute(new Attribute("LocationInfoType",
						structureElementBinding != null ? structureElementBinding.getLocationInfo().getType().name()
								: ""));
//				structureElementBindingElement.addAttribute(new Attribute("LocationInfoName",
//						structureElementBinding.getLocationInfo() != null
//								? structureElementBinding.getLocationInfo().getName()
//								: ""));
				structureElementBindingElement.addAttribute(new Attribute("Position1",
						structureElementBinding.getLocationInfo() != null
								? String.valueOf(structureElementBinding.getLocationInfo().getPosition())
								: ""));
				structureElementBindingElement
						.addAttribute(
								new Attribute("LocationInfoPosition",
										structureElementBinding.getLocationInfo() != null
												? name + "-"
														+ String.valueOf(
																structureElementBinding.getLocationInfo().getPosition())
												: ""));
			}
			if(elementIdParent != null) {
				 elementIdParent = elementIdParent +"."+structureElementBinding.getElementId();
				}
				else {
				 elementIdParent = structureElementBinding.getElementId();
				}
			if (structureElementBinding.getChildren() != null && structureElementBinding.getChildren().size() > 0) {
				Element structureElementBindingsElement = this
						.serializeStructureElementBindings(elementIdParent, structureElementBinding.getChildren(), name, valuesetMap);
				if (structureElementBindingsElement != null) {
					structureElementBindingElement.appendChild(structureElementBindingsElement);
				}
			}
			if (structureElementBinding.getValuesetBindings() != null) {
				for (ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
					Element valuesetBindingElement = this.serializeValuesetBinding(elementIdParent, valuesetBinding, valuesetMap, name);
					if (valuesetBindingElement != null) {
                        structureElementBindingElement.appendChild(valuesetBindingElement);
                    }
				}
			}
			if (structureElementBinding.getInternalSingleCode() != null) {
				Element internalSingleCode = new Element("InternalSingleCode");
				internalSingleCode.addAttribute(
						new Attribute("internalSingleCodeId", structureElementBinding.getInternalSingleCode().getCode()));
				 internalSingleCode.addAttribute(
							new Attribute("internalSingleCodeSystem", structureElementBinding.getInternalSingleCode().getCodeSystem()));
					 internalSingleCode.addAttribute(
								new Attribute("internalSingleCodeVsId", structureElementBinding.getInternalSingleCode().getValueSetId()));
					 internalSingleCode.addAttribute(
								new Attribute("internalSingleCodeLocation", name + "-"+elementIdParent));
						 structureElementBindingElement.appendChild(internalSingleCode);
			}
			 if (structureElementBinding.getExternalSingleCode() != null) {
			 Element externalSingleCodeElement = new Element("externalSingleCode");
//			 this.serializeExternalSingleCode(structureElementBinding.getExternalSingleCode());
			 externalSingleCodeElement.addAttribute(
						new Attribute("externalSingleCodeValue", structureElementBinding.getExternalSingleCode().getValue()));
			 externalSingleCodeElement.addAttribute(
						new Attribute("externalSingleCodeSystem", structureElementBinding.getExternalSingleCode().getCodeSystem()));
			 if (externalSingleCodeElement != null) {
			 structureElementBindingElement.appendChild(externalSingleCodeElement);
			 }
			 }
			return structureElementBindingElement;
		}
		return null;
	}

	private Element serializeValuesetBinding(String elementIdParent, ValuesetBinding valuesetBinding,
			Map<String, Set<ValuesetBindingDataModel>> valuesetMap, String name) {
		if (valuesetBinding != null && valuesetBinding.getValueSets() != null
				&& !valuesetBinding.getValueSets().isEmpty()) {
			List<ValuesetBindingDataModel> vsDataModel = valuesetMap.values().stream().flatMap((set) -> {
				return set.stream();
			}).collect(Collectors.toList());
			Element valuesetBindingElement = new Element("ValuesetBinding");
			// valuesetBindingElement.addAttribute(new Attribute("id", valuesetBinding.));
			valuesetBindingElement.addAttribute(new Attribute("name",
					convertValuesetIdsToBindingIdentifier(valuesetBinding.getValueSets(), vsDataModel)));
			valuesetBindingElement.addAttribute(new Attribute("version",
					convertValuesetIdsToVersions(valuesetBinding.getValueSets(), vsDataModel)));

			// System.out.println("for " +
			// convertValuesetNamesToString(valuesetBinding.getValueSets()) + " results is :
			// " + convertValuesetIdsToBindingIdentifier(valuesetBinding.getValueSets(),
			// vsDataModel));
			valuesetBindingElement.addAttribute(new Attribute("strength",
					valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().value : ""));
			String location = getBindingLocationFromMap(valuesetMap, valuesetBinding, name);
			valuesetBindingElement.addAttribute(new Attribute("bindingLocation",
					valuesetBinding.getValueSets() != null
							? location : ""));
			valuesetBindingElement.addAttribute(new Attribute("Position2",
					elementIdParent != null ? name+"-"+elementIdParent : ""));		
			valuesetBindingElement.addAttribute(new Attribute("locations",
					valuesetBinding.getValuesetLocations() != null
							? convertValuesetLocationsToString(name+"-"+elementIdParent, valuesetBinding.getValuesetLocations())
							: ""));
			return valuesetBindingElement;
		}
		return null;
	}

	private String convertValuesetLocationsToString(String theLocation, Set<Integer> valuesetLocations) {
		Set<String> valuesetLocationsString = new HashSet<>();
		for (Integer location : valuesetLocations) {
			valuesetLocationsString.add(theLocation+"."+String.valueOf(location));
		}
		return String.join(", ", valuesetLocationsString);
	}

	private String getBindingLocationFromMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap,
			ValuesetBinding valuesetBinding, String name) {
	    String location = "";
		for (Set<ValuesetBindingDataModel> set : valuesetMap.values()) {
			for (ValuesetBindingDataModel valuesetBindingDataModel : set) {
				if (valuesetBindingDataModel.getValuesetBinding().getValueSets()
						.equals(valuesetBinding.getValueSets())) {
					for (String key : valuesetMap.keySet()) {
						if (valuesetMap.get(key).equals(set)) {
							location = key;
						}
					}
				}
			}
		}
		return name+"-"+location;
	}
	
	private String getLocationIntFromMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap,
			ValuesetBinding valuesetBinding) {
		String location = "Not found in MAP";
		for (Set<ValuesetBindingDataModel> set : valuesetMap.values()) {
			for (ValuesetBindingDataModel valuesetBindingDataModel : set) {
				if (valuesetBindingDataModel.getValuesetBinding().getValueSets()
						.equals(valuesetBinding.getValueSets())) {
					for (String key : valuesetMap.keySet()) {
						if (valuesetMap.get(key).equals(set)) {
							location = key;
						}
					}
				}
			}
		}
		return location;
	}

	private String convertValuesetNamesToString(List<String> list) {
		// Set<String> valuesetNameString = new HashSet<>();
		// for (String name : valuesetNames) {
		// valuesetLocationsString.add(String.valueOf(location));
		// }
		return String.join(", ", list);
	}
	
	private String convertStrengthToString(List<String> list) {
		// Set<String> valuesetNameString = new HashSet<>();
		// for (String name : valuesetNames) {
		// valuesetLocationsString.add(String.valueOf(location));
		// }
		return String.join(", ", list);
	}


//	private String convertValuesetIdsToBindingIdentifier(List<String> listIds,
//			List<ValuesetBindingDataModel> listVsDataModels) {
//		List<String> bindingIdentifiersList = new ArrayList<>();
//		for (String id : listIds) {
//			for (ValuesetBindingDataModel valuesetBindingDataModel : listVsDataModels) {
//				if (valuesetBindingDataModel.getId().equals(id)) {
//					bindingIdentifiersList.add(valuesetBindingDataModel.getBindingIdentifier());
//				}
//			}
//		}
//		return String.join(",", bindingIdentifiersList);
//	}
	private String convertValuesetIdsToBindingIdentifier(List<String> listIds,
														 List<ValuesetBindingDataModel> listVsDataModels) {
		List<String> bindingIdentifiersList = new ArrayList<>();
		for (String id : listIds) {
			Valueset vs = valuesetService.findById(id);
			if(vs != null) {
				bindingIdentifiersList.add(vs.getBindingIdentifier());
			}
		}
		return String.join(",", bindingIdentifiersList);
	}
	private String convertValuesetIdsToVersions(List<String> listIds,
														 List<ValuesetBindingDataModel> listVsDataModels) {
		List<String> versionsList = new ArrayList<>();
		for (String id : listIds) {
			Valueset vs = valuesetService.findById(id);
			if(vs != null) {
				versionsList.add(vs.getDomainInfo().getVersion());
			}
//			for (ValuesetBindingDataModel valuesetBindingDataModel : listVsDataModels) {
//				if (valuesetBindingDataModel.getId().equals(id)) {
//					versionsList.add(valuesetBindingDataModel.getDomainInfo().getVersion());
//				}
//			}
		}
		return String.join(",", versionsList);
	}

}
