package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class SegmentSerializationServiceImpl implements SegmentSerializationService {

@Autowired
private IgDataModelSerializationService igDataModelSerializationService;
	
	@Override
	public Element serializeSegment(SegmentDataModel segmentDataModel, int level, ExportConfiguration exportConfiguration) throws ResourceSerializationException {
		Element segmentElement = igDataModelSerializationService.serializeResource(segmentDataModel.getModel(), Type.SEGMENT, exportConfiguration);
	      Segment segment = segmentDataModel.getModel();
	    segmentElement
	          .addAttribute(new Attribute("ext", segment.getExt() != null ? segment.getExt() : ""));
//	      if (segment.getDynamicMappingInfo() != null) {
//	        try {
//	          Element dynamicMappingElement =
//	              this.serializeDynamicMapping(segment.getDynamicMappingInfo());
//	          if (dynamicMappingElement != null) {
//	            segmentElement.appendChild(dynamicMappingElement);
//	          }
//	        } catch (DatatypeNotFoundException exception) {
//	          throw new DynamicMappingSerializationException(exception,
//	              segment.getDynamicMappingInfo());
//	        }
//	      }
//	      if (segment.getBinding() != null) {
//	        Element bindingElement =
//	            super.serializeResourceBinding(segment.getBinding(), this.valuesetNamesMap);
//	        if (bindingElement != null) {
//	          segmentElement.appendChild(bindingElement);
//	        }
//	      }
//	      if (segment.getChildren() != null) {
//	        Element fieldsElement = this.serializeFields(segment.getChildren());
//	        if (fieldsElement != null) {
//	          segmentElement.appendChild(fieldsElement);
//	        }
//	      }      
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

}
