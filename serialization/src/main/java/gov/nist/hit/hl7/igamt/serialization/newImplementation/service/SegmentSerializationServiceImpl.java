package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
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
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
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
private DeltaService deltaService;

	@Override
	public Element serializeSegment(IgDataModel igDataModel, SegmentDataModel segmentDataModel, int level, int position, SegmentExportConfiguration segmentExportConfiguration, ExportFilterDecision exportFilterDecision) throws SerializationException {
		Element segmentElement = igDataModelSerializationService.serializeResource(segmentDataModel.getModel(), Type.SEGMENT, position, segmentExportConfiguration);
	      Segment segment = segmentDataModel.getModel();
	      
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
	  	          .addAttribute(new Attribute("label", segment.getLabel() != null ? segment.getLabel() : ""));
	  	      }
	      if (segment.getDynamicMappingInfo() != null && segmentExportConfiguration.getDynamicMappingInfo()) {
	        try {
//	        	segment.getBinding().getc
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
	      if (segment.getBinding() != null) {
	        Element bindingElement = bindingSerializationService.serializeBinding((Binding) segment.getBinding(), segmentDataModel.getValuesetMap(), segmentDataModel.getModel().getName() );
	        if (bindingElement != null) {
	          segmentElement.appendChild(bindingElement);
	        }
	      }
	      if(!segmentDataModel.getConformanceStatements().isEmpty()|| !segmentDataModel.getPredicateMap().isEmpty()) {
    	  Element constraints = constraintSerializationService.serializeConstraints(segmentDataModel.getConformanceStatements(), segmentDataModel.getPredicateMap(), segmentExportConfiguration.getConstraintExportConfiguration());
	        if (constraints != null) {
          segmentElement.appendChild(constraints);
        }
	      }
	      if (segment.getChildren() != null) {
	        Element fieldsElement = this.serializeFields(segment.getChildren(),igDataModel,segmentDataModel, segmentExportConfiguration);
	        if (fieldsElement != null) {
	          segmentElement.appendChild(fieldsElement);
	        }
	      }      
//	      if (coConstraintService.getCoConstraintForSegment(segment.getId()) != null && segment != null) { 
//	      CoConstraintTable coConstraintsTable = coConstraintService.getCoConstraintForSegment(segment.getId()); 
////	      if (coConstraintsTable.getHeaders() != null){
//	      	  SerializableCoConstraints serializableCoConstraints = new SerializableCoConstraints(coConstraintsTable, segment.getName(), datatypesMap, exportConfiguration);
//	        Element coConstraintsElement = serializableCoConstraints.serialize();
//	        System.out.println("Coconstraint XML :" + coConstraintsElement.toXML());
//	        if (coConstraintsElement != null) {
//	          segmentElement.appendChild(coConstraintsElement);
//	        }
//	      }
	      
	   // Calculate segment delta if the segment has an origin
	      if(segment.getOrigin() != null && segmentExportConfiguration.isDeltaMode()) {
			  List<StructureDelta> structureDelta = deltaService.delta(Type.SEGMENT, segment);
			  List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
			  if(structureDeltaChanged != null && structureDeltaChanged.size()>0) {
					  Element deltaElement = this.serializeDelta(structureDeltaChanged, segmentExportConfiguration.getDeltaConfig());
					  if (deltaElement != null) {
						  segmentElement.appendChild(deltaElement);
					  }
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
		              fieldElement
		                  .addAttribute(new Attribute("id", field.getId() != null ? field.getId() : ""));
		              fieldElement.addAttribute(new Attribute("maxLength",
		                  field.getMaxLength() != null ? field.getMaxLength() : ""));
		              fieldElement.addAttribute(new Attribute("minLength",
		                  field.getMinLength() != null ? field.getMinLength() : ""));
		              fieldElement.addAttribute(
		                  new Attribute("text", field.getText() != null ? field.getText() : ""));
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
		              fieldElement.addAttribute(
		                  new Attribute("usage", field.getUsage() != null ? field.getUsage().toString() : ""));
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
		    if (dynamicMappingInfo != null && dynamicMappingInfo.getItems() != null) {
		      Element dynamicMappingElement = new Element("DynamicMapping");
		      dynamicMappingElement.addAttribute(new Attribute("referencePath",
		          dynamicMappingInfo.getReferenceFieldId() != null
		              ? dynamicMappingInfo.getReferenceFieldId()
		              : ""));
		      // dynamicMappingElement.addAttribute(new Attribute("variesDatatypePath",
		      // dynamicMappingInfo.getVariesDatatypePath() != null
		      // ? dynamicMappingInfo.getVariesDatatypePath()
		      // : ""));
		      for (DynamicMappingItem dynamicMappingItem : dynamicMappingInfo.getItems()) {
		        if (dynamicMappingItem != null) {
		          Element dynamicMappingItemElement = new Element("DynamicMappingItem");
		          if (dynamicMappingItem.getDatatypeId() != null) {
						DatatypeDataModel datatypeDataModel = igDataModel.getDatatypes().stream().filter(dt -> dynamicMappingItem.getDatatypeId().equals(dt.getModel().getId())).findAny().orElseThrow(() -> new DatatypeNotFoundException(dynamicMappingItem.getDatatypeId()));
		              dynamicMappingItemElement.addAttribute(new Attribute("datatype", datatypeDataModel.getModel().getName()));
		          }
		          dynamicMappingItemElement.addAttribute(new Attribute("value",
		              dynamicMappingItem.getValue() != null ? dynamicMappingItem.getValue() : ""));
		          dynamicMappingElement.appendChild(dynamicMappingItemElement);
		        }
		      }
		      return dynamicMappingElement;
		    }
		    return null;
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
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getConstantValue().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getMinLength() != null && !structureDelta.getMinLength().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getMinLength().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getMaxLength() != null && !structureDelta.getMaxLength().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getMaxLength().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getMinCardinality() != null && !structureDelta.getMinCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getMinCardinality().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMIN.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getMaxCardinality() != null && !structureDelta.getMaxCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getMaxCardinality().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMAX.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getConfLength() != null && !structureDelta.getConfLength().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getConfLength().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
				  element.appendChild(changedElement);
			  }
			  if(structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
				  Element changedElement = new Element("Change");
				  changedElement.addAttribute(new Attribute("type", Type.FIELD.getValue()));
				  changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
				  changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
				  changedElement.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
				  element.appendChild(changedElement);
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
