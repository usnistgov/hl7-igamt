package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConformanceProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.exception.MsgStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ConformanceProfileSerializationServiceImpl implements ConformanceProfileSerializationService {

@Autowired
private IgDataModelSerializationService igDataModelSerializationService;

@Autowired
private ConstraintSerializationService constraintSerializationService;
	
	@Override
	public Element serializeConformanceProfile(ConformanceProfileDataModel conformanceProfileDataModel, IgDataModel igDataModel, int level,  int position,
			ConformanceProfileExportConfiguration conformanceProfileExportConfiguration) throws ResourceSerializationException {
	    ConformanceProfile conformanceProfile = conformanceProfileDataModel.getModel();
	    if (conformanceProfile != null) {
	      try {
			Element conformanceProfileElement = igDataModelSerializationService.serializeResource(conformanceProfileDataModel.getModel(), Type.CONFORMANCEPROFILE, position, conformanceProfileExportConfiguration);
			if(conformanceProfileExportConfiguration.getIdentifier()) {
	        conformanceProfileElement.addAttribute(new Attribute("identifier",
	            conformanceProfile.getIdentifier() != null ? conformanceProfile.getIdentifier() : ""));
			}
			if(conformanceProfileExportConfiguration.getMessageType()) {
	        conformanceProfileElement.addAttribute(new Attribute("messageType",
	            conformanceProfile.getMessageType() != null ? conformanceProfile.getMessageType()
	                : ""));}
			if(conformanceProfileExportConfiguration.getEvent()) {
	        conformanceProfileElement.addAttribute(new Attribute("event",
	            conformanceProfile.getEvent() != null ? conformanceProfile.getEvent() : ""));}
			if(conformanceProfileExportConfiguration.getStructID()) {
	        conformanceProfileElement.addAttribute(new Attribute("structID",
	            conformanceProfile.getStructID() != null ? conformanceProfile.getStructID() : ""));}
//	        Element bindingElement = super.serializeResourceBinding(conformanceProfile.getBinding(), this.valuesetNamesMap);
//	        if (bindingElement != null) {
//	          conformanceProfileElement.appendChild(bindingElement);
//	        }
	        if(!conformanceProfileDataModel.getConformanceStatements().isEmpty() || !conformanceProfileDataModel.getPredicateMap().isEmpty()) {
		    	  System.out.println("BOOM");
	        Element constraints = constraintSerializationService.serializeConstraints(conformanceProfileDataModel.getConformanceStatements(), conformanceProfileDataModel.getPredicateMap(), conformanceProfileExportConfiguration.getConstraintExportConfiguration());
	        if (constraints != null) {
	        	conformanceProfileElement.appendChild(constraints);
        }
	        }
	        if (conformanceProfile.getChildren() != null
	            && conformanceProfile.getChildren().size() > 0) {
	          for (MsgStructElement msgStructElm : conformanceProfile.getChildren()) {
	            	System.out.println("HERE1 : " +  msgStructElm.getName() +" " + msgStructElm.getId());
		            if (msgStructElm != null && ExportTools.CheckUsage(conformanceProfileExportConfiguration.getSegmentORGroupsMessageExport(), msgStructElm.getUsage())) {
		            	System.out.println("HERE2 : " +  msgStructElm.getName() +" " + msgStructElm.getId());
	            if (msgStructElm != null) {
//	              if(this.bindedGroupsAndSegmentRefs.contains(msgStructElm.getId())) {
	                Element msgStructElement = this.serializeMsgStructElement(igDataModel, msgStructElm, 0);
	                if (msgStructElement != null) {
	                  conformanceProfileElement.appendChild(msgStructElement);
	                }
	              }
		            }
//	            }
	          }
	        }
		    return igDataModelSerializationService.getSectionElement(conformanceProfileElement, conformanceProfileDataModel.getModel(), level, conformanceProfileExportConfiguration);

	      } catch (Exception exception) {
	        throw new ResourceSerializationException(exception, Type.CONFORMANCEPROFILE,
	        		conformanceProfileDataModel.getModel());
	      }
	    }
	    return null;	  
	}
	
	  /**
	   * @param msgStructElm
	   * @return
	   * @throws SerializationException
	   * @throws Exception
	   */
	  private Element serializeMsgStructElement(IgDataModel igDataModel, MsgStructElement msgStructElm, int depth)
	      throws SerializationException {
	    try {
	      Element msgStructElement;
	      if (msgStructElm instanceof Group) {
	        msgStructElement = serializeGroup(igDataModel, (Group) msgStructElm, depth);
	      } else if (msgStructElm instanceof SegmentRef) {
				SegmentDataModel segmentDataModel = igDataModel.getSegments().stream().filter(seg -> ((SegmentRef) msgStructElm).getRef().getId().equals(seg.getModel().getId())).findAny().orElseThrow(() -> new SegmentNotFoundException(((SegmentRef) msgStructElm).getRef().getId()));
	        Segment segment = segmentDataModel.getModel();
	        msgStructElement = serializeSegmentRef((SegmentRef) msgStructElm, segment, depth);
	      } else {
	        throw new MsgStructElementSerializationException(new Exception(
	            "Unable to serialize conformance profile element: element isn't a Group or SegmentRef instance ("
	                + msgStructElm.getClass().getName() + ")"),
	            msgStructElm);
	      }
	      if (msgStructElement != null) {
	        msgStructElement.addAttribute(new Attribute("min", String.valueOf(msgStructElm.getMin())));
	        msgStructElement.addAttribute(new Attribute("max", msgStructElm.getMax()));
	      }
	      return msgStructElement;
	    } catch (SegmentNotFoundException e) {
	      throw new MsgStructElementSerializationException(e, msgStructElm);
	    }
	  }

	  /**
	   * @param msgStructElm @return @throws
	   */
	  private Element serializeSegmentRef(SegmentRef segmentRef, Segment segment, int depth)
	      throws MsgStructElementSerializationException {
	    Element segmentRefElement = new Element("SegmentRef");
	    try {
	      segmentRefElement
	          .addAttribute(new Attribute("id", segmentRef.getId() != null ? segmentRef.getId() : ""));
	      segmentRefElement
	          .addAttribute(new Attribute("position", String.valueOf(segmentRef.getPosition())));
	      segmentRefElement
	          .addAttribute(new Attribute("ref", segment.getName() != null ? segment.getName() : ""));
	      segmentRefElement
	      .addAttribute(new Attribute("label", segment.getLabel() != null ? segment.getLabel() : ""));
	      segmentRefElement.addAttribute(new Attribute("description",
	          segment.getDescription() != null ? segment.getDescription() : ""));
	      segmentRefElement.addAttribute(
	          new Attribute("text", segmentRef.getText() != null ? segmentRef.getText() : ""));
	      segmentRefElement.addAttribute(
	          new Attribute("max", segmentRef.getMax() != null ? segmentRef.getMax() : ""));
	      segmentRefElement.addAttribute(new Attribute("min", String.valueOf(segmentRef.getMin())));
	      segmentRefElement.addAttribute(new Attribute("type", Type.SEGMENTREF.name()));
	      segmentRefElement.addAttribute(new Attribute("usage",
	          segmentRef.getUsage() != null ? segmentRef.getUsage().name() : ""));
	      segmentRefElement.addAttribute(new Attribute("iDRef", segmentRef.getId()));
	      segmentRefElement.addAttribute(new Attribute("iDSeg", segmentRef.getRef().getId()));
	      if (segment != null && segment.getName() != null) {
	        segmentRefElement.addAttribute(
	            new Attribute("Ref", StringUtils.repeat(".", 4 * depth) + segment.getName()));
	        segmentRefElement.addAttribute(new Attribute("label", segment.getLabel()));
	      }
	      segmentRefElement.addAttribute(new Attribute("depth", String.valueOf(depth)));
	      segmentRefElement.addAttribute(new Attribute("min", segmentRef.getMin() + ""));
	      segmentRefElement.addAttribute(new Attribute("max", segmentRef.getMax() + ""));
	      return segmentRefElement;

	    } catch (Exception exception) {
	      throw new MsgStructElementSerializationException(exception, segmentRef);
	    }
	  }

	  private Element serializeGroup(IgDataModel igDataModel, Group group, int depth) throws SerializationException {
	    Element groupElement = new Element("Group");
//	    if (group.getBinding() != null) {
//	      Element binding;
//	      try {
//	        binding = super.serializeResourceBinding(group.getBinding(), this.valuesetNamesMap, this.valuesetLabelMap);
//	      } catch (SerializationException exception) {
//	        throw new MsgStructElementSerializationException(exception, group);
//	      }
//	      if (binding != null) {
//	        groupElement.appendChild(binding);
//	      }
	//
//	    }
	    groupElement.addAttribute(new Attribute("name", group.getName()));
	    Element elementGroupBegin = new Element("SegmentRef");
	    elementGroupBegin.addAttribute(new Attribute("idGpe", group.getId()));
	    elementGroupBegin.addAttribute(new Attribute("name", group.getName()));
	    elementGroupBegin
	        .addAttribute(new Attribute("description", "BEGIN " + group.getName() + " GROUP"));
	    elementGroupBegin.addAttribute(new Attribute("usage", String.valueOf(group.getUsage())));
	    elementGroupBegin.addAttribute(new Attribute("min", group.getMin() + ""));
	    elementGroupBegin.addAttribute(new Attribute("max", group.getMax()));
	    elementGroupBegin.addAttribute(new Attribute("ref", StringUtils.repeat(".", 4 * depth) + "["));
	    elementGroupBegin.addAttribute(new Attribute("position", String.valueOf(group.getPosition())));
	    groupElement.appendChild(elementGroupBegin);
	    for (MsgStructElement msgStructElm : group.getChildren()) {
	      try {
	        Element child = this.serializeMsgStructElement(igDataModel, msgStructElm, depth + 1);
	        if (child != null) {
	          groupElement.appendChild(child);
	        }
	      } catch (Exception exception) {
	        throw new MsgStructElementSerializationException(exception, group);
	      }
	    }
	    Element elementGroupEnd = new Element("SegmentRef");
	    elementGroupEnd.addAttribute(new Attribute("idGpe", group.getId()));
	    elementGroupEnd.addAttribute(new Attribute("name", "END " + group.getName() + " GROUP"));
	    elementGroupEnd.addAttribute(new Attribute("description", "END " + group.getName() + " GROUP"));
	    elementGroupEnd.addAttribute(new Attribute("usage", group.getUsage().toString()));
	    elementGroupEnd.addAttribute(new Attribute("min", group.getMin() + ""));
	    elementGroupEnd.addAttribute(new Attribute("max", group.getMax()));
	    elementGroupEnd.addAttribute(new Attribute("ref", StringUtils.repeat(".", 4 * depth) + "]"));
	    elementGroupEnd.addAttribute(new Attribute("depth", String.valueOf(depth)));
	    elementGroupEnd.addAttribute(new Attribute("position", String.valueOf(group.getPosition())));
	    groupElement.appendChild(elementGroupEnd);
	    return groupElement;
	  }

//	  @Override
//	  public Map<String, String> getIdPathMap() {
//	    ConformanceProfile conformanceProfile = (ConformanceProfile) this.getAbstractDomain();
//	    Map<String, String> idPathMap = new HashMap<String, String>();
//	    String basePath = "";
//	    for(MsgStructElement msgStructElement : conformanceProfile.getChildren()) {
//	      Map<String, String> msgStructElementIdPathMap = getIdPathMap(msgStructElement, basePath);
//	      idPathMap.putAll(msgStructElementIdPathMap);
//	    }
//	    return idPathMap;
//	  }

//	  private Map<String, String> getIdPathMap(MsgStructElement msgStructElement, String basePath) {
//	    Map<String, String> idPathMap = new HashMap<String, String>();
//	    if(!basePath.isEmpty()) {
//	      basePath += SEGMENT_GROUP_PATH_SEPARATOR;
//	    }
//	    if(msgStructElement instanceof Group) {
//	      Group group = (Group) msgStructElement;
//	      idPathMap.put(group.getId(), basePath+group.getName());
//	      basePath += group.getName();
//	      for(MsgStructElement groupMsgStructElement : group.getChildren()) {
//	        idPathMap.putAll(getIdPathMap(groupMsgStructElement, basePath));
//	      }
//	      
//	    } else if (msgStructElement instanceof SegmentRef) {
//	      Segment segment = segmentsMap.get(msgStructElement.getId());
//	      if(segment != null) {
//	        idPathMap.put(segment.getId(), basePath+segment.getLabel());
//	        basePath += segment.getLabel();
//	        for(Field field : segment.getChildren()) {
//	          if(!idPathMap.containsKey(field.getId())) {
//	            String path = basePath+SEGMENT_GROUP_PATH_SEPARATOR+field.getPosition();
//	            idPathMap.put(field.getId(), path);
//	          }
//	        }
//	      }
//	    }
//	    return idPathMap;
//	  }


}
