package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
import gov.nist.hit.hl7.igamt.serialization.util.SerializationTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class DatatypeSerializationServiceImpl implements DatatypeSerializationService {

	@Autowired
	private IgDataModelSerializationService igDataModelSerializationService;

	@Autowired
	private ConstraintSerializationService constraintSerializationService;

	@Autowired 
	BindingSerializationService bindingSerializationService;

	@Autowired
	private DeltaService deltaService;

	@Autowired
	private FroalaSerializationUtil frolaCleaning;

	@Autowired
	private SerializationTools serializationTools;

	@Override
	public Element serializeDatatype(String igId, DatatypeDataModel datatypeDataModel, int level, int position, DatatypeExportConfiguration datatypeExportConfiguration, Type type, Boolean deltaMode) throws SerializationException {
		//	    try {
		Element datatypeElement = igDataModelSerializationService.serializeResource(datatypeDataModel.getModel(), Type.DATATYPE, position, datatypeExportConfiguration);
		Datatype datatype = datatypeDataModel.getModel();

		// Calculate datatype delta if the datatype has an origin
		if(deltaMode && datatype.getOrigin() != null && datatypeExportConfiguration.isDeltaMode()) {
			List<StructureDelta> structureDelta = deltaService.delta(Type.DATATYPE, datatype);
			List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
			if(structureDeltaChanged != null && structureDeltaChanged.size()>0) {
				Element deltaElement = this.serializeDelta(structureDeltaChanged, datatypeExportConfiguration.getDeltaConfig());
				if (deltaElement != null) {
					datatypeElement.appendChild(deltaElement);
				}
			} else {
				return  null;
			}
		}

		datatypeElement
		.addAttribute(new Attribute("ext", datatype.getExt() != null ? datatype.getExt() : ""));
		if(datatypeExportConfiguration.getPurposeAndUse()) {
			datatypeElement.addAttribute(new Attribute("purposeAndUse",
					datatype.getPurposeAndUse() != null ? datatype.getPurposeAndUse() : ""));
		}
		if(type.equals(Type.DATATYPELIBRARY)) {
			//			datatypeElement
			//			.addAttribute(new Attribute("PurposeUse", datatype.getUsageNotes() != null ? datatype.getUsageNotes(): ""));
			if(datatypeExportConfiguration.getMetadataConfig().isDatatypeFlavor()) {
				datatypeElement
				.addAttribute(new Attribute("datatypeFlavor", datatype.getLabel() != null ? datatype.getLabel(): ""));}
			if(datatypeExportConfiguration.getMetadataConfig().isDatatypeName()) {
				datatypeElement
				.addAttribute(new Attribute("datatypeName", datatype.getDescription() != null ? datatype.getDescription(): ""));}
			if(datatypeExportConfiguration.getMetadataConfig().isShortDescription()) {
				datatypeElement
				.addAttribute(new Attribute("shortDescription", datatype.getShortDescription() != null ? datatype.getShortDescription(): ""));}
			if(datatype.getDomainInfo() != null && datatypeExportConfiguration.getMetadataConfig().isHl7version()) {
				datatypeElement
				.addAttribute(new Attribute("hl7versions", datatype.getDomainInfo().getCompatibilityVersion()!= null ? datatype.getDomainInfo().getCompatibilityVersion().toString(): ""));
			}
			if(datatypeExportConfiguration.getMetadataConfig().isStatus()) {
				datatypeElement
				.addAttribute(new Attribute("status", datatype.getStatus() != null ? datatype.getStatus().name(): ""));}
			if(datatype.getPublicationInfo() != null && datatypeExportConfiguration.getMetadataConfig().isPublicationDate()) {
				datatypeElement
				.addAttribute(new Attribute("publicationDate", datatype.getPublicationInfo().getPublicationDate()!= null ? datatype.getPublicationInfo().getPublicationDate().toString(): ""));}
		}

//			      if (datatype.getBinding() != null) {
//			        Element bindingElement =  
//			            super.serializeResourceBinding(datatype.getBinding(), valuesetNamesMap);
//			        if (bindingElement != null) {
//			          datatypeElement.appendChild(bindingElement);
//			        }
		//	        for (int i = 0; i < bindingElement.getChildElements().size(); i++) {
		//	          Element structureElementBindings = bindingElement.getChildElements().get(i);
		//	          for (int j = 0; j < structureElementBindings.getChildElements().size(); j++) {
		//	            Element structureElementBinding = structureElementBindings.getChildElements().get(j);
		//	            if (structureElementBinding.getLocalName().equals("StructureElementBinding")) {
		//	              for (int k = 0; k < structureElementBinding.getChildElements().size(); k++) {
		//	                Element valuesetBinding = structureElementBinding.getChildElements().get(k);
		//	                if (valuesetBinding.getLocalName().equals("ValuesetBinding")) {
		//	                  this.componentValuesetMap.put(
		//	                      structureElementBinding.getAttributeValue("elementId"),
		//	                      valuesetBinding.getAttributeValue("name"));
		//	                }
		//	              }
		//	            }
		//	          }
		//	        }
		//	      }
		if (datatype instanceof ComplexDatatype) {
			datatypeElement = serializeComplexDatatype(datatypeElement,datatypeDataModel,datatypeExportConfiguration, type);
		    
		} else if (datatype instanceof DateTimeDatatype) {
			datatypeElement = serializeDateTimeDatatype(datatypeElement, datatypeDataModel, datatypeExportConfiguration);
		}
		if(!datatypeDataModel.getConformanceStatements().isEmpty()|| !datatypeDataModel.getPredicateMap().isEmpty()) {
			Element constraints = constraintSerializationService.serializeConstraints(datatypeDataModel.getConformanceStatements(), datatypeDataModel.getPredicateMap(), datatypeExportConfiguration.getConstraintExportConfiguration());
			if (constraints != null) {
				datatypeElement.appendChild(constraints);
			}
		}


		return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level, datatypeExportConfiguration);

		//	    } catch (Exception exception) {
		//	    	exception.printStackTrace();
		//	      throw new ResourceSerializationException(exception, Type.DATATYPE, datatypeDataModel.getModel());
		//	    }
		//	      
		//	      return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level);

	}



	@Override
	public Element serializeComplexDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel, DatatypeExportConfiguration datatypeExportConfiguration, Type type) throws SubStructElementSerializationException {
		ComplexDatatype complexDatatype = (ComplexDatatype) datatypeDataModel.getModel();
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();

		for (Component component : complexDatatype.getComponents()) {
			if (component != null && ExportTools.CheckUsage(datatypeExportConfiguration.getComponentExport(), component.getUsage())) {
				//	      if(this.bindedComponents.contains(component.getId())) {
				try {
				    bindedPaths.put(component.getId(), true);
					Element componentElement = new Element("Component");
					componentElement.addAttribute(new Attribute("confLength",
							component.getConfLength() != null ? component.getConfLength() : ""));
					componentElement
					.addAttribute(new Attribute("id", component.getId() != null ? component.getId() : ""));
					componentElement.addAttribute(
							new Attribute("name", component.getName() != null ? component.getName() : ""));
					componentElement.addAttribute(new Attribute("maxLength",
							component.getMaxLength() != null ? component.getMaxLength() : ""));
					componentElement.addAttribute(new Attribute("minLength",
							component.getMinLength() != null ? component.getMinLength() : ""));
					componentElement.addAttribute(
							new Attribute("text", component.getText() != null ? frolaCleaning.cleanFroalaInput(component.getText()) : ""));
					componentElement
					.addAttribute(new Attribute("position", String.valueOf(component.getPosition())));
					Element comments = new Element("Comments");
			    	  Element definitionTextsElement = new Element("DefinitionTexts");
			    	  datatypeElement.appendChild(definitionTextsElement);
					datatypeElement.appendChild(comments);
					if(component.getComments() != null) {
						for(Comment comment : component.getComments()) {
							Element commentElement = new Element("Comment");
							if(complexDatatype.getExt() != null) {
								commentElement
								.addAttribute(new Attribute("name", complexDatatype.getName()+"_"+complexDatatype.getExt() + "." + component.getPosition()));
							} else {
								commentElement
								.addAttribute(new Attribute("name", complexDatatype.getName() + "." + component.getPosition()));
							} 
							commentElement
							.addAttribute(new Attribute("description", comment.getDescription()));
							comments.appendChild(commentElement);
						}
						
			    		  if(component.getText() != null) {
			    			  Element definitionText = new Element("DefinitionText");
			    			  definitionText
		    	              .addAttribute(new Attribute("text", component.getText()));
								if(complexDatatype.getExt() != null) {
									definitionText
									.addAttribute(new Attribute("name", complexDatatype.getName()+"_"+complexDatatype.getExt() + "." + component.getPosition()));
								} else {
									definitionText
									.addAttribute(new Attribute("name", complexDatatype.getName() + "." + component.getPosition()));
								} 			    			  definitionTextsElement.appendChild(definitionText);
			    		  }
					}
					if(type.equals(Type.IGDOCUMENT)) {
						if (datatypeDataModel != null && datatypeDataModel.getValuesetMap() != null && datatypeDataModel.getValuesetMap().containsKey(component.getPosition() + "")) {
							String vs = datatypeDataModel.getValuesetMap().get(component.getPosition()+"").stream().map((element) -> {
								return element.getBindingIdentifier();
							})
									.collect(Collectors.joining(", "));
							componentElement
							.addAttribute(new Attribute("valueset", vs));
						}  
					}
					if (component.getRef() != null) {
						//	            if (datatypeNamesMap != null
						//	                && datatypeNamesMap.containsKey(component.getRef().getId())) {
						ComponentDataModel componentDataModel = datatypeDataModel.getComponentDataModels().stream().filter(cp -> component.getRef().getId().equals(cp.getDatatype().getId())).findAny().orElseThrow(() -> new DatatypeNotFoundException(component.getRef().getId()));
						componentElement.addAttribute(
								new Attribute("datatype", componentDataModel.getDatatype().getName()));
						//	            } else {
						//	              //throw new DatatypeNotFoundException(component.getRef().getId());
						//	            }
					}
					componentElement.addAttribute(new Attribute("usage",
							component.getUsage() != null ? component.getUsage().toString() : ""));
					datatypeElement.appendChild(componentElement);
				} catch (Exception exception) {
					throw new SubStructElementSerializationException(exception, component);
				}
				//	      }
			}
		}
		
        if(type.equals(Type.IGDOCUMENT)) {
          if (complexDatatype.getBinding() != null) {
              Element bindingElement;
              try {
                bindingElement = bindingSerializationService.serializeBinding(complexDatatype.getBinding(), datatypeDataModel.getValuesetMap(), datatypeDataModel.getModel().getName(), bindedPaths);
                if(bindingElement !=null) {
                  datatypeElement.appendChild(bindingElement);
                }

              } catch (SerializationException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
              }
              
          }
      }
		return datatypeElement;

	}

	@Override
	public Element serializeDateTimeDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel, DatatypeExportConfiguration datatypeExportConfiguration) {
		DateTimeDatatype dateTimeDatatype =  (DateTimeDatatype) datatypeDataModel.getModel();
		if(dateTimeDatatype.getDateTimeConstraints() !=null) {
			for (DateTimeComponentDefinition dateTimeComponentDefinition : dateTimeDatatype
					.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
				if(dateTimeComponentDefinition != null) {
					Element dateTimeComponentDefinitionElement = new Element("DateTimeComponentDefinition");
					if (dateTimeComponentDefinition != null) {
						dateTimeComponentDefinitionElement.addAttribute(new Attribute("description",
								dateTimeComponentDefinition.getDescription() != null
								? dateTimeComponentDefinition.getDescription()
										: ""));
						dateTimeComponentDefinitionElement.addAttribute(new Attribute("format",
								dateTimeComponentDefinition.getFormat() != null
								? dateTimeComponentDefinition.getFormat()
										: ""));
						dateTimeComponentDefinitionElement.addAttribute(new Attribute("name",
								dateTimeComponentDefinition.getName() != null ? dateTimeComponentDefinition.getName()
										: ""));
						dateTimeComponentDefinitionElement.addAttribute(new Attribute("predicate",
								dateTimeComponentDefinition.getDateTimePredicate() != null
								? dateTimeComponentDefinition.getDateTimePredicate().toString()
										: ""));
						dateTimeComponentDefinitionElement.addAttribute(
								new Attribute("position", String.valueOf(dateTimeComponentDefinition.getPosition())));
						dateTimeComponentDefinitionElement.addAttribute(new Attribute("usage",
								dateTimeComponentDefinition.getUsage() != null
								? dateTimeComponentDefinition.getUsage().toString()
										: ""));
						datatypeElement.appendChild(dateTimeComponentDefinitionElement);
					}
				}
			}
		}
		return datatypeElement;
	}

	private Element serializeDelta(List<StructureDelta> structureDeltaList, DeltaConfiguration deltaConfiguration){
		if (structureDeltaList.size() > 0) {
			Element changesElement = new Element("Changes");
			changesElement.addAttribute(new Attribute("mode", deltaConfiguration.getMode().name()));

			//		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
			changesElement.addAttribute(new Attribute("updatedColor", deltaConfiguration.getColors().get(DeltaAction.UPDATED)));
			changesElement.addAttribute(new Attribute("addedColor", deltaConfiguration.getColors().get(DeltaAction.ADDED)));
			changesElement.addAttribute(new Attribute("deletedColor", deltaConfiguration.getColors().get(DeltaAction.DELETED)));

			//		      }
			for (StructureDelta structureDelta : structureDeltaList) {
				this.setChangedElements(changesElement, structureDelta);
			}
			return changesElement;
		}
		return null;
	}

	private void setChangedElements(Element element, StructureDelta structureDelta) {
		if(structureDelta != null) {
			if(structureDelta.getAction().equals(DeltaAction.DELETED) || structureDelta.getAction().equals(DeltaAction.ADDED)) {
				Element addedUsage = new Element("Change");
				addedUsage.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedUsage.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedUsage.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedUsage.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
				element.appendChild(addedUsage);

				Element addedConstant = new Element("Change");
				addedConstant.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedConstant.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedConstant.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedConstant.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
				element.appendChild(addedConstant);

				Element addedMinL = new Element("Change");
				addedMinL.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedMinL.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedMinL.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedMinL.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
				element.appendChild(addedMinL);

				Element addedMaxL = new Element("Change");
				addedMaxL.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedMaxL.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedMaxL.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedMaxL.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
				element.appendChild(addedMaxL);

				Element addedConfL = new Element("Change");
				addedConfL.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedConfL.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedConfL.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedConfL.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
				element.appendChild(addedConfL);

				Element addedRef = new Element("Change");
				addedRef.addAttribute(new Attribute("type", Type.COMPONENT.toString()));
				addedRef.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				addedRef.addAttribute(new Attribute("action", structureDelta.getAction().name()));
				addedRef.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
				element.appendChild(addedRef);


			} else {
				if(structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getUsage().getPrevious().name()));

					element.appendChild(changedElement);
				}
				if(structureDelta.getValueSetBinding() != null ){
					if(structureDelta.getValueSetBinding().getAction().equals(DeltaAction.DELETED) || structureDelta.getValueSetBinding().getAction().equals(DeltaAction.ADDED)) {

					} else {
						if(structureDelta.getValueSetBinding().getValueSets() != null && !structureDelta.getValueSetBinding().getValueSets().getAction().equals(DeltaAction.UNCHANGED)){
							Element changedElement = new Element("Change");
							changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
							changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
							changedElement.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
							changedElement.addAttribute(new Attribute("property", PropertyType.VALUESET.name()));
							changedElement.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
							element.appendChild(changedElement);

							Element changedElementV = new Element("Change");
							changedElementV.addAttribute(new Attribute("type", "ValuesetBinding"));
							changedElementV.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
							changedElementV.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
							changedElementV.addAttribute(new Attribute("property", "name"));
							changedElementV.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
							element.appendChild(changedElementV);
						}
						if(structureDelta.getValueSetBinding().getStrength() != null) {
							if( structureDelta.getValueSetBinding().getStrength().getAction().equals(DeltaAction.DELETED) || structureDelta.getValueSetBinding().getStrength().getAction().equals(DeltaAction.ADDED)) {
								Element addedS = new Element("Change");
								addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
								addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
								addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
								addedS.addAttribute(new Attribute("property", "strength"));
								element.appendChild(addedS);
							}
							if( structureDelta.getValueSetBinding().getStrength().getAction().equals(DeltaAction.UPDATED)){
								Element changedElementS = new Element("Change");
								changedElementS.addAttribute(new Attribute("type", "ValuesetBinding"));
								changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
								changedElementS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
								changedElementS.addAttribute(new Attribute("property", "strength"));
								changedElementS.addAttribute(new Attribute("oldValue", structureDelta.getValueSetBinding().getStrength().getPrevious().value));
								element.appendChild(changedElementS);
							}
						}

						if(structureDelta.getValueSetBinding().getValuesetLocations() != null) {
							if( structureDelta.getValueSetBinding().getValuesetLocations().getAction().equals(DeltaAction.DELETED) || structureDelta.getValueSetBinding().getValuesetLocations().getAction().equals(DeltaAction.ADDED)) {
								Element addedS = new Element("Change");
								addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
								addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
								addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValuesetLocations().getAction().name()));
								addedS.addAttribute(new Attribute("property", "locations"));
								element.appendChild(addedS);
							}
							if( structureDelta.getValueSetBinding().getValuesetLocations().getAction().equals(DeltaAction.UPDATED)){
								Element changedElementS = new Element("Change");
								changedElementS.addAttribute(new Attribute("type", "ValuesetBinding"));
								changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
								changedElementS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValuesetLocations().getAction().name()));
								changedElementS.addAttribute(new Attribute("property", "locations"));
								changedElementS.addAttribute(new Attribute("oldValue", serializationTools.extractLocations(structureDelta.getValueSetBinding().getValuesetLocations().getPrevious()) ));
								element.appendChild(changedElementS);
							}
						}
					}
				}


				if(structureDelta.getConstantValue() != null && !structureDelta.getConstantValue().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getConstantValue().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConstantValue().getPrevious()));

					element.appendChild(changedElement);
				}
				if(structureDelta.getMinLength() != null && !structureDelta.getMinLength().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getMinLength().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMinLength().getPrevious()));

					element.appendChild(changedElement);
				}
				if(structureDelta.getMaxLength() != null && !structureDelta.getMaxLength().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getMaxLength().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMaxLength().getPrevious()));

					element.appendChild(changedElement);
				}
				if(structureDelta.getConfLength() != null && !structureDelta.getConfLength().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type",structureDelta.getType().toString()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getConfLength().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConfLength().getPrevious()));

					element.appendChild(changedElement);
				}
				if(structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
					changedElement.addAttribute(new Attribute("oldValue", structureDelta.getReference().getLabel().getPrevious()));

					element.appendChild(changedElement);
				}

			}


		}
	}




}
