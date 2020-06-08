package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.List;
import java.util.stream.Collectors;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
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

	@Override
	public Element serializeDatatype(String igId, DatatypeDataModel datatypeDataModel, int level, int position, DatatypeExportConfiguration datatypeExportConfiguration, Type type) throws SerializationException {
		//	    try {
		Element datatypeElement = igDataModelSerializationService.serializeResource(datatypeDataModel.getModel(), Type.DATATYPE, position, datatypeExportConfiguration);
		Datatype datatype = datatypeDataModel.getModel();
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
		if(type.equals(Type.IGDOCUMENT)) {
			if (datatype.getBinding() != null) {
				Element bindingElement = bindingSerializationService.serializeBinding((Binding) datatype.getBinding(), datatypeDataModel.getValuesetMap(), datatypeDataModel.getModel().getName());
				if (bindingElement != null) {
					datatypeElement.appendChild(bindingElement);
				}
			}
		}
		//	      if (datatype.getBinding() != null) {
		//	        Element bindingElement =  
		//	            super.serializeResourceBinding(datatype.getBinding(), valuesetNamesMap);
		//	        if (bindingElement != null) {
		//	          datatypeElement.appendChild(bindingElement);
		//	        }
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

		// Calculate datatype delta if the segment has an origin
		if(datatype.getOrigin() != null && datatypeExportConfiguration.isDeltaMode()) {
			List<StructureDelta> structureDelta = deltaService.delta(Type.DATATYPE, datatype);
			List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
			if(structureDeltaChanged != null && structureDeltaChanged.size()>0) {
				Element deltaElement = this.serializeDelta(structureDeltaChanged, datatypeExportConfiguration.getDeltaConfig());
				if (deltaElement != null) {
					datatypeElement.appendChild(deltaElement);
				}
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
		for (Component component : complexDatatype.getComponents()) {
			if (component != null && ExportTools.CheckUsage(datatypeExportConfiguration.getComponentExport(), component.getUsage())) {
				//	      if(this.bindedComponents.contains(component.getId())) {
				try {
					if(type.equals(Type.DATATYPELIBRARY)) {

					}


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
			if(structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
				element.appendChild(changedElement);
			}
			if(structureDelta.getConstantValue() != null && !structureDelta.getConstantValue().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getConstantValue().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
				element.appendChild(changedElement);
			}
			if(structureDelta.getMinLength() != null && !structureDelta.getMinLength().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getMinLength().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
				element.appendChild(changedElement);
			}
			if(structureDelta.getMaxLength() != null && !structureDelta.getMaxLength().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getMaxLength().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
				element.appendChild(changedElement);
			}
			if(structureDelta.getConfLength() != null && !structureDelta.getConfLength().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type",structureDelta.getType().toString()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getConfLength().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
				element.appendChild(changedElement);
			}
			if(structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
				Element changedElement = new Element("Change");
				changedElement.addAttribute(new Attribute("type", structureDelta.getType().toString()));
				changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
				changedElement.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
				element.appendChild(changedElement);
			}


		}
	}




}
