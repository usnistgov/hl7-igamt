package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
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
	
	@Override
	public Element serializeSegment(IgDataModel igDataModel, SegmentDataModel segmentDataModel, int level, ExportConfiguration exportConfiguration) throws SerializationException {
		Element segmentElement = igDataModelSerializationService.serializeResource(segmentDataModel.getModel(), Type.SEGMENT, exportConfiguration);
	      Segment segment = segmentDataModel.getModel();
	    segmentElement
	          .addAttribute(new Attribute("ext", segment.getExt() != null ? segment.getExt() : ""));
	      if (segment.getDynamicMappingInfo() != null) {
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
//	      System.out.println("Segment name : " + segment.getName());
//	      if (segment.getBinding() != null) {
//	    	  System.out.println("Je suis dans IF segment");
//	        Element bindingElement = bindingSerializationService.serializeBinding(igDataModel, (Binding) segment.getBinding());
//	        if (bindingElement != null) {
//	          segmentElement.appendChild(bindingElement);
//	        }
//	      }
	      if(!segmentDataModel.getConformanceStatements().isEmpty()|| !segmentDataModel.getPredicateMap().isEmpty()) {
	    	  System.out.println("BOOM");
    	  Element constraints = constraintSerializationService.serializeConstraints(segmentDataModel.getConformanceStatements(), segmentDataModel.getPredicateMap());
	        if (constraints != null) {
          segmentElement.appendChild(constraints);
        }
	      }
	      if (segment.getChildren() != null) {
	        Element fieldsElement = this.serializeFields(segment.getChildren(),igDataModel,segmentDataModel);
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
	        

	      return igDataModelSerializationService.getSectionElement(segmentElement, segmentDataModel.getModel(), level);
	  }

	  private Element serializeFields(Set<Field> fields, IgDataModel igDataModel, SegmentDataModel segmentDataModel) throws SubStructElementSerializationException {
		    if (fields.size() > 0) {
		      Element fieldsElement = new Element("Fields");
		      for (Field field : fields) {
//		        if (this.bindedFields.contains(field.getId())) {
		          try {
		            if (field != null) {
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
		                  new Attribute("usage", field.getUsage() != null ? field.getUsage().name() : ""));
		              if (segmentDataModel != null && segmentDataModel.getValuesetMap() != null && segmentDataModel.getValuesetMap().containsKey(field.getPosition() + "")) {
		  	        	String vs = segmentDataModel.getValuesetMap().get(field.getPosition()+"").stream().map((element) -> {
		                  	return element.getName();
		                  })
		  	        	.collect(Collectors.joining(", "));
		  	        	fieldElement
		  	                .addAttribute(new Attribute("valueset", vs));
		              }
//		  	        	
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
