package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.GeneratedResourceMetadata;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.delta.domain.ConformanceStatementDelta;
import gov.nist.hit.hl7.igamt.delta.domain.ResourceDelta;
import gov.nist.hit.hl7.igamt.serialization.util.SerializationTools;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.GenerationDirective;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaExportConfigMode;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.SegmentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class SegmentSerializationServiceImpl implements SegmentSerializationService {

  @Autowired
  private IgDataModelSerializationService igDataModelSerializationService;

  @Autowired 
  BindingSerializationService bindingSerializationService;

  @Autowired
  ConstraintSerializationService constraintSerializationService;

  @Autowired
  private FroalaSerializationUtil frolaCleaning;

  @Autowired
  private DeltaService deltaService;
  @Autowired
  private DatatypeService datatypeService;
  @Autowired
  private SegmentService segmentService;
  @Autowired
  private ProfileComponentService profileComponentService;
  
  @Autowired
  private SerializationTools serializationTools;
  
  @Autowired
  SlicingSerialization slicingSerialization;
  
  @Autowired
  private ReasonForChangeSerializationService reasonForChangeSerializationService;
  
  @Autowired
  ResourceSkeletonService resourceSkeletonService;
  

  


  @Override
  public Element serializeSegment(IgDataModel igDataModel, SegmentDataModel segmentDataModel, int level, int position, SegmentExportConfiguration segmentExportConfiguration, ExportFilterDecision exportFilterDecision, Boolean deltaMode) throws SerializationException {
    Element segmentElement = igDataModelSerializationService.serializeResource(segmentDataModel.getModel(), Type.SEGMENT, position, segmentExportConfiguration);
    Segment segment = segmentDataModel.getModel();
    if(segmentExportConfiguration.isReasonForChange()){
      segmentElement.appendChild(reasonForChangeSerializationService.serializeReasonForChange(segment.getLabel(),segment.getBinding(), segment.getChildren()));
    }
    if(deltaMode) {
    if( segment.isDerived()) {
      ResourceDelta resourceDelta = deltaService.delta(Type.SEGMENT, segment);
      if(resourceDelta != null){
        List<StructureDelta> structureDeltaChanged = resourceDelta.getStructureDelta().stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
        List<ConformanceStatementDelta> confStDeltaChanged = resourceDelta.getConformanceStatementDelta().stream().filter(d -> !d.getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());

        if((structureDeltaChanged != null && structureDeltaChanged.size()>0) || (confStDeltaChanged != null && confStDeltaChanged.size() > 0) ) {
          Element deltaElement = this.serializeDelta(segment.getName(), structureDeltaChanged, confStDeltaChanged, segmentExportConfiguration.getDeltaConfig());
          if (deltaElement != null) {
            segmentElement.appendChild(deltaElement);
          }
        } else {
          return null;
        }
      } else {
        return  null;
      }
    }
  }
    if(segment.isGenerated()) {
        String compositionString= segment.getLabel() +" Composition = ";
        GeneratedResourceMetadata generatedResourceMetadata = igDataModel.getAllFlavoredSegmentDataModelsMap().get(segmentDataModel);
        Segment sourceSegment = segmentService.findById(generatedResourceMetadata.getSourceId());
        if(generatedResourceMetadata != null) compositionString += sourceSegment.getLabel();
        Set<GenerationDirective> generationDirectiveSet = generatedResourceMetadata.getGeneratedUsing();
        for(GenerationDirective generationDirective : generationDirectiveSet) {
        	if(generationDirective.getType().equals(Type.PROFILECOMPONENT)) {
        		ProfileComponent pc = profileComponentService.findById(generationDirective.getId());
        		if(pc !=null) compositionString+= " + " + pc.getLabel();
        }
        }
        segmentElement.addAttribute(
				new Attribute("Composition", segment != null ? compositionString : "")
		);
    
    }
    if(segment.getExt() != null) {
      segmentElement
      .addAttribute(new Attribute("ext", segment.getExt() != null ? segment.getExt() : ""));
    }
    if(segment.getDescription() != null) {
      segmentElement
      .addAttribute(new Attribute("description", segment.getDescription() != null ? segment.getDescription() : ""));
    }
    if(segment.getLabel() != null) {
      segmentElement
      .addAttribute(new Attribute("label" , segment.getLabel() != null ? segment.getLabel() : ""));
    }
    if (segment.getDynamicMappingInfo() != null && segment.getDynamicMappingInfo().getItems() !=null && !segment.getDynamicMappingInfo().getItems().isEmpty() ) {
      try {
        Element dynamicMappingElement =
            this.serializeDynamicMapping(segment.getDynamicMappingInfo(),igDataModel);
        if (dynamicMappingElement != null) {
          segmentElement.appendChild(dynamicMappingElement);
        }
      } catch (DatatypeNotFoundException exception) {
        //	          throw new DynamicMappingSerializationException(exception,
        //	              segment.getDynamicMappingInfo());
      }
    }
    Map<String, Boolean > bindedPaths = segment.getChildren().stream().filter(  field  -> field != null && ExportTools.CheckUsage(segmentExportConfiguration.getFieldsExport(), field.getUsage())).collect(Collectors.toMap( x -> x.getId(), x -> true ));

    if (segment.getChildren() != null) {
      Element commentsElement = new Element("Comments");
      Element definitionTextsElement = new Element("DefinitionTexts");
      if(segmentExportConfiguration.getStructuredNarrative().isComments()) {
        segmentElement.appendChild(commentsElement);
      }
      if(segmentExportConfiguration.getStructuredNarrative().isDefinitionText()) {
        segmentElement.appendChild(definitionTextsElement);
      }
      for(Field field : segment.getChildren()) {
        if(bindedPaths.containsKey(field.getId())) {
  		  if(field.getComments() != null) {
			  for(Comment comment : field.getComments()) {
    			  Element commentElement = new Element("Comment");
    			  if(segment.getExt() != null) {
    		          commentElement
    	              .addAttribute(new Attribute("name", segment.getName()+"_"+segment.getExt() + "-" + field.getPosition()));
    		          } else {
    		        	  commentElement
	    	              .addAttribute(new Attribute("name", segment.getName()+ "-" + field.getPosition()));
    			          } 
    			  commentElement.addAttribute(new Attribute("name",segment.getName() +"-"+ field.getPosition()));
				  commentElement.addAttribute(new Attribute("description",comment.getDescription()));
				  commentElement.addAttribute(new Attribute("position", String.valueOf(field.getPosition())));
    			  commentsElement.appendChild(commentElement);
			  }  
		  }
		  if(field.getText() != null) {
			  Element definitionText = new Element("DefinitionText");
			  definitionText
              .addAttribute(new Attribute("text", field.getText()));
			  definitionText.addAttribute(new Attribute("name",segment.getName() +"-"+ field.getPosition()));
			  definitionText.addAttribute(new Attribute("position", String.valueOf(field.getPosition())));
			  definitionTextsElement.appendChild(definitionText);
		  }
	  }
      }
      //			segmentElement.appendChild(commentsElement);
      //			segmentElement.appendChild(definitionTextsElement);
      Element fieldsElement = this.serializeFields(segment.getChildren(),igDataModel,segmentDataModel, segmentExportConfiguration);
      if (fieldsElement != null) {
        segmentElement.appendChild(fieldsElement);
      }
    }  
    if (segment.getBinding() != null) {
      Element bindingElement = bindingSerializationService.serializeBinding((Binding) segment.getBinding(), segmentDataModel.getValuesetMap(),segmentDataModel.getSingleCodeMap() , segmentDataModel.getModel().getName(), bindedPaths );
      if (bindingElement != null) {
        segmentElement.appendChild(bindingElement);
      }
    }
    if (segment.getSlicings()!= null) {
    	ResourceSkeleton root = new ResourceSkeleton(
                new ResourceRef(Type.SEGMENT, segment.getId()),
                this.resourceSkeletonService
        );
        Element slicingElement = null;
		try {
			slicingElement = slicingSerialization.serializeSlicing(segment.getSlicings(), root, Type.SEGMENT,bindedPaths);
		} catch (ResourceNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        if (slicingElement != null) {
        	segmentElement.appendChild(slicingElement);
        }
    
  }
    if(!segmentDataModel.getConformanceStatements().isEmpty()|| !segmentDataModel.getPredicateMap().isEmpty()) {
      Element constraints = constraintSerializationService.serializeConstraints(segmentDataModel.getConformanceStatements(), segmentDataModel.getPredicateMap(), segmentExportConfiguration.getConstraintExportConfiguration());
      if (constraints != null) {
        segmentElement.appendChild(constraints);
      }
    }




    return igDataModelSerializationService.getSectionElement(segmentElement, segmentDataModel.getModel(), level, segmentExportConfiguration);
  }
  // test
  private Element serializeFields(Set<Field> fields, IgDataModel igDataModel, SegmentDataModel segmentDataModel, SegmentExportConfiguration segmentExportConfiguration) throws SubStructElementSerializationException {
    if (fields.size() > 0) {
      Element fieldsElement = new Element("Fields");
      for (Field field : fields) {
        //		        if (this.bindedFields.contains(field.getId())) {
        try {
          if (field != null && ExportTools.CheckUsage(segmentExportConfiguration.getFieldsExport(), field.getUsage())) {
            Element fieldElement = new Element("Field");
            fieldElement.addAttribute(new Attribute("confLength",
                field.getConfLength() != null ? field.getConfLength() : ""));
            fieldElement.addAttribute(
                new Attribute("name", field.getName() != null ? field.getName() : ""));
            fieldElement.addAttribute(
                new Attribute("constantValue", field.getConstantValue() != null ? field.getConstantValue() : ""));
            fieldElement
            .addAttribute(new Attribute("id", field.getId() != null ? field.getId() : ""));
            fieldElement.addAttribute(new Attribute("maxLength",
                field.getMaxLength() != null ? field.getMaxLength() : ""));
            fieldElement.addAttribute(new Attribute("minLength",
                field.getMinLength() != null ? field.getMinLength() : ""));
            fieldElement.addAttribute(
                new Attribute("text", field.getText() != null ? frolaCleaning.cleanFroalaInput(field.getText()) : ""));
            fieldElement.addAttribute(new Attribute("custom", String.valueOf(field.isCustom())));
            fieldElement.addAttribute(new Attribute("max", String.valueOf(field.getMax())));
            fieldElement.addAttribute(new Attribute("min", String.valueOf(field.getMin())));
            fieldElement
            .addAttribute(new Attribute("position", String.valueOf(field.getPosition())));
            if (field.getRef() != null && field.getRef().getId() != null) {
              DatatypeDataModel datatypeDataModel = igDataModel.getDatatypes().stream().filter(dt -> field.getRef().getId().equals(dt.getModel().getId())).findAny().orElseThrow(() -> new DatatypeNotFoundException(field.getRef().getId()));
              Datatype dt = datatypeDataModel.getModel();
              if(dt.getExt()==null || dt.getExt().isEmpty()) {  	
                fieldElement.addAttribute(
                    new Attribute("datatype", dt.getName()));
              }else {
                fieldElement.addAttribute(
                    new Attribute("datatype", dt.getName() + "_" + dt.getExt()));
              }

            }
            if(field.getUsage() != null && !field.getUsage().equals(Usage.CAB)) {
            fieldElement.addAttribute(
                new Attribute("usage", field.getUsage() != null ? field.getUsage().toString() : ""));}
            else if(field.getUsage() != null && field.getUsage().equals(Usage.CAB)) {
            	
            	fieldElement.addAttribute(
                        new Attribute("usage", field.getUsage() != null ? serializationTools.extractPredicateUsages(segmentDataModel.getPredicateMap(), field.getId()) : ""));
                fieldElement.addAttribute(
                      new Attribute("predicate", field.getUsage() != null ? serializationTools.extractPredicateDescription(segmentDataModel.getPredicateMap(), field.getId()) : ""));
            }
            if (segmentDataModel != null && segmentDataModel.getValuesetMap() != null && segmentDataModel.getValuesetMap().containsKey(field.getPosition() + "")) {
              String vs = segmentDataModel.getValuesetMap().get(field.getPosition()+"").stream().map((element) -> {
                return element.getBindingIdentifier();
              })
                  .collect(Collectors.joining(", "));
              fieldElement
              .addAttribute(new Attribute("valueset", vs));
            }
            fieldsElement.appendChild(fieldElement);		              
          }	            
        } catch (DatatypeNotFoundException exception) {
          throw new SubStructElementSerializationException(exception, field);
        }
        //		        }
      }
      return fieldsElement;
    }
    return null;
  }

  private Element serializeDynamicMapping(DynamicMappingInfo dynamicMappingInfo, IgDataModel igDataModel)
      throws DatatypeNotFoundException {
	  Set<DynamicMappingItem> dynamicMappingItemSet = dynamicMappingInfo.getItems();
	  List<DynamicMappingItem> dynamicMappingList = dynamicMappingItemSet.stream().sorted((e1, e2) -> 
	  e1.getValue().compareTo(e2.getValue())).collect(Collectors.toList());
    if (dynamicMappingInfo != null && dynamicMappingInfo.getItems() != null) {
      Element dynamicMappingElement = new Element("DynamicMapping");
      dynamicMappingElement.addAttribute(new Attribute("referencePath",
          dynamicMappingInfo.getReferenceFieldId() != null
          ? dynamicMappingInfo.getReferenceFieldId()
              : ""));
      dynamicMappingElement.addAttribute(new Attribute("variesDatatypePath",
          dynamicMappingInfo.getVariesFieldId() != null
          ? dynamicMappingInfo.getReferenceFieldId()
              : ""));
      for (DynamicMappingItem dynamicMappingItem : dynamicMappingList) {
        if (dynamicMappingItem != null) {
          Element dynamicMappingItemElement = new Element("DynamicMappingItem");
          if (dynamicMappingItem.getDatatypeId() != null) {

            Datatype dt = datatypeService.findById(dynamicMappingItem.getDatatypeId());
            if(dt !=null) {
              dynamicMappingItemElement.addAttribute(new Attribute("datatype", dt.getLabel()));
              dynamicMappingItemElement.addAttribute(new Attribute("value",
                  dynamicMappingItem.getValue() != null ? dynamicMappingItem.getValue() : ""));
              dynamicMappingElement.appendChild(dynamicMappingItemElement);

            }

          }
        }
      }
      return dynamicMappingElement;
    }
    return null;
  }

  private Element serializeDelta(String segmentName, List<StructureDelta> structureDeltaList, List<ConformanceStatementDelta> confStDeltaChanged, DeltaConfiguration deltaConfiguration){
    if (structureDeltaList.size() > 0 || confStDeltaChanged.size() > 0) {
      Element changesElement = new Element("Changes");
      changesElement.addAttribute(new Attribute("mode", deltaConfiguration.getMode().name()));

      //		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
      changesElement.addAttribute(new Attribute("updatedColor", deltaConfiguration.getColors().get(DeltaAction.UPDATED)));
      changesElement.addAttribute(new Attribute("addedColor", deltaConfiguration.getColors().get(DeltaAction.ADDED)));
      changesElement.addAttribute(new Attribute("deletedColor", deltaConfiguration.getColors().get(DeltaAction.DELETED)));

      //		      }
      for (StructureDelta structureDelta : structureDeltaList) {
        this.setChangedElements(segmentName, changesElement, structureDelta);
      }
      for (ConformanceStatementDelta conformanceStatementDelta : confStDeltaChanged) {
        this.setChangedConfStatements(changesElement, conformanceStatementDelta);
      }
      return changesElement;
    }
    return null;
  }

  private void setChangedConfStatements(Element element, ConformanceStatementDelta conformanceStatementDelta) {
    if(conformanceStatementDelta != null) {
      if(conformanceStatementDelta.getAction().equals(DeltaAction.DELETED) ) {

        Element addedCS = new Element("Change");
        addedCS.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedCS.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getPrevious()));
        addedCS.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedCS.addAttribute(new Attribute("property", Type.CONFORMANCESTATEMENT.getValue()));

        element.appendChild(addedCS);


        Element addedDesc = new Element("Change");
        addedDesc.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedDesc.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getPrevious()));
        addedDesc.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedDesc.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
        addedDesc.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getDescription().getPrevious()));

        element.appendChild(addedDesc);


        Element addedId = new Element("Change");
        addedId.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedId.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getPrevious()));
        addedId.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedId.addAttribute(new Attribute("property", PropertyType.IDENTIFIER.name()));
        addedId.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getIdentifier().getPrevious()));

        element.appendChild(addedId);
      } else if(conformanceStatementDelta.getAction().equals(DeltaAction.ADDED)){
        Element addedDesc = new Element("Change");
        addedDesc.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedDesc.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
        addedDesc.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedDesc.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
        element.appendChild(addedDesc);


        Element addedId = new Element("Change");
        addedId.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedId.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
        addedId.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedId.addAttribute(new Attribute("property", PropertyType.IDENTIFIER.name()));
        element.appendChild(addedId);
      } else if(conformanceStatementDelta.getAction().equals(DeltaAction.UPDATED)){
        if(conformanceStatementDelta.getDescription() != null && !conformanceStatementDelta.getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
          changedElement.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
          changedElement.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
          changedElement.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getDescription().getPrevious()));
          element.appendChild(changedElement);
        }
      }

    }
  }
  private void setChangedElements(String segmentName, Element element, StructureDelta structureDelta) {
    if (structureDelta != null) {
      if (!structureDelta.getAction().equals(DeltaAction.UNCHANGED)) {
        //Usage
        if (structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
          if (structureDelta.getUsage().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getUsage().getPrevious().name()));
          }
          element.appendChild(changedElement);
        }
        // Cte value
        if (structureDelta.getConstantValue() != null && !structureDelta.getConstantValue().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getConstantValue().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
          if (structureDelta.getConstantValue().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConstantValue().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        // Min Length
        if (structureDelta.getMinLength() != null && !structureDelta.getMinLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMinLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
          if (structureDelta.getMinLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMinLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        //Max Length
        if (structureDelta.getMaxLength() != null && !structureDelta.getMaxLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMaxLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
          if (structureDelta.getMaxLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMaxLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        //Min Card
        if (structureDelta.getMinCardinality() != null && !structureDelta.getMinCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMinCardinality().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMIN.name()));
          if (structureDelta.getMinCardinality().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMinCardinality().getPrevious().toString()));

          }
          element.appendChild(changedElement);
        }

        //Max Card
        if (structureDelta.getMaxCardinality() != null && !structureDelta.getMaxCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMaxCardinality().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMAX.name()));
          if (structureDelta.getMaxCardinality().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMaxCardinality().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        // Conf Length
        if (structureDelta.getConfLength() != null && !structureDelta.getConfLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getConfLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
          if (structureDelta.getConfLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConfLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        //Ref
        if (structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
          if (structureDelta.getReference().getLabel() != null && structureDelta.getReference().getLabel().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getReference().getLabel().getPrevious()));
          }

          element.appendChild(changedElement);
        }

        //Predicates
        if (structureDelta.getPredicate() != null && !structureDelta.getPredicate().getAction().equals(DeltaAction.UNCHANGED)) {
          if (structureDelta.getPredicate().getAction().equals(DeltaAction.DELETED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getAction().name()));
            changedElement.addAttribute(new Attribute("property", Type.PREDICATE.getValue()));
            element.appendChild(changedElement);

            Element changedLoc = new Element("Change");
            changedLoc.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedLoc.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedLoc.addAttribute(new Attribute("action", structureDelta.getPredicate().getAction().name()));
            changedLoc.addAttribute(new Attribute("property", "location"));
            changedLoc.addAttribute(new Attribute("oldValue", segmentName + "-" + structureDelta.getPosition().toString()));

            element.appendChild(changedLoc);
          }
          if (structureDelta.getPredicate().getFalseUsage() != null && !structureDelta.getPredicate().getFalseUsage().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getFalseUsage().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.FALSEUSAGE.name()));
            if (structureDelta.getPredicate().getFalseUsage().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getFalseUsage().getPrevious().name()));
            }
            element.appendChild(changedElement);
          }

          if (structureDelta.getPredicate().getTrueUsage() != null && !structureDelta.getPredicate().getTrueUsage().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getTrueUsage().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.TRUEUSAGE.name()));
            if (structureDelta.getPredicate().getTrueUsage().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getTrueUsage().getPrevious().name()));
            }
            element.appendChild(changedElement);
          }

          if (structureDelta.getPredicate().getDescription() != null && !structureDelta.getPredicate().getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getDescription().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
            if (structureDelta.getPredicate().getDescription().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getDescription().getPrevious()));
            }
            element.appendChild(changedElement);
          }

        }

        // Valueset bindings
        if (structureDelta.getValueSetBinding() != null && !structureDelta.getValueSetBinding().getAction().equals(DeltaAction.UNCHANGED)) {
          if (structureDelta.getValueSetBinding().getAction().equals(DeltaAction.DELETED)) {
            Element addedBinding = new Element("Change");
            addedBinding.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedBinding.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedBinding.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
            addedBinding.addAttribute(new Attribute("property", "VALUESETBINDING"));
            element.appendChild(addedBinding);

            Element addedPos2 = new Element("Change");
            addedPos2.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedPos2.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedPos2.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
            addedPos2.addAttribute(new Attribute("property", "Position2"));
            addedPos2.addAttribute(new Attribute("oldValue", segmentName + "." + structureDelta.getPosition().toString()));
            element.appendChild(addedPos2);
          }
          //VS bindings
          if (structureDelta.getValueSetBinding().getValueSets() != null && !structureDelta.getValueSetBinding().getValueSets().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValueSets().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.VALUESET.name()));
            if (structureDelta.getValueSetBinding().getValueSets().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
            }
            element.appendChild(changedElement);

            Element changedElementV = new Element("Change");
            changedElementV.addAttribute(new Attribute("type", "ValuesetBinding"));
            changedElementV.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementV.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValueSets().getAction().name()));
            changedElementV.addAttribute(new Attribute("property", "name"));
            if (structureDelta.getValueSetBinding().getValueSets().getPrevious() != null) {
              changedElementV.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
            }
            element.appendChild(changedElementV);
          }

          //Strength
          if (structureDelta.getValueSetBinding().getStrength() != null && !structureDelta.getValueSetBinding().getStrength().getAction().equals(DeltaAction.UNCHANGED)) {
            Element addedS = new Element("Change");
            addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getStrength().getAction().name()));
            addedS.addAttribute(new Attribute("property", "strength"));
            if (structureDelta.getValueSetBinding().getStrength().getPrevious() != null) {
              addedS.addAttribute(new Attribute("oldValue", structureDelta.getValueSetBinding().getStrength().getPrevious().value));
            }
            element.appendChild(addedS);
          }

          // Locations
          if (structureDelta.getValueSetBinding().getValuesetLocations() != null && !structureDelta.getValueSetBinding().getValuesetLocations().getAction().equals(DeltaAction.UNCHANGED)) {
            Element addedS = new Element("Change");
            addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValuesetLocations().getAction().name()));
            addedS.addAttribute(new Attribute("property", "locations"));
            if (structureDelta.getValueSetBinding().getValuesetLocations().getPrevious() != null) {
              addedS.addAttribute(new Attribute("oldValue", serializationTools.extractLocations(structureDelta.getValueSetBinding().getValuesetLocations().getPrevious())));

            }
            element.appendChild(addedS);
          }


        }

        //Internal codes
        if (structureDelta.getInternalSingleCode() != null && !structureDelta.getInternalSingleCode().getAction().equals(DeltaAction.UNCHANGED)) {

          //Code
          if (structureDelta.getInternalSingleCode().getCode() != null && !structureDelta.getInternalSingleCode().getCode().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElementS = new Element("Change");
            changedElementS.addAttribute(new Attribute("type", "InternalSingleCode"));
            changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementS.addAttribute(new Attribute("action", structureDelta.getInternalSingleCode().getCode().getAction().name()));
            changedElementS.addAttribute(new Attribute("property", "internalSingleCodeId"));
            if (structureDelta.getInternalSingleCode().getCode().getPrevious() != null) {
              changedElementS.addAttribute(new Attribute("oldValue", structureDelta.getInternalSingleCode().getCode().getPrevious()));
            }
            element.appendChild(changedElementS);
          }

          //Code System
          if (structureDelta.getInternalSingleCode().getCodeSystem() != null && !structureDelta.getInternalSingleCode().getCodeSystem().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElementS = new Element("Change");
            changedElementS.addAttribute(new Attribute("type", "InternalSingleCode"));
            changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementS.addAttribute(new Attribute("action", structureDelta.getInternalSingleCode().getCodeSystem().getAction().name()));
            changedElementS.addAttribute(new Attribute("property", "internalSingleCodeSystem"));
            if (structureDelta.getInternalSingleCode().getCodeSystem().getPrevious() != null) {
              changedElementS.addAttribute(new Attribute("oldValue", structureDelta.getInternalSingleCode().getCodeSystem().getPrevious()));
            }
            element.appendChild(changedElementS);
          }
        }
      }

    }
  }



  //		  @Override
  //		  public Map<String, String> getIdPathMap() {
  //		    Map<String, String> idPathMap = new HashMap<String, String>();
  //		    Segment segment = (Segment) this.getAbstractDomain();
  //		    for (Field field : segment.getChildren()) {
  //		      if (!idPathMap.containsKey(field.getId())) {
  //		        String path = segment.getLabel() + FIELD_PATH_SEPARATOR + field.getPosition();
  //		        idPathMap.put(field.getId(), path);
  //		      }
  //		    }
  //		    return idPathMap;
  //		  
  //}
}
