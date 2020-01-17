package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConformanceProfileSerializationServiceImpl implements ConformanceProfileSerializationService {

@Autowired
private IgDataModelSerializationService igDataModelSerializationService;

@Autowired
private ConstraintSerializationService constraintSerializationService;

@Autowired
private DeltaService deltaService;

@Autowired
private CoConstraintSerializationService coConstraintSerializationService;

@Autowired
CoConstraintService coConstraintService;

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
			if(conformanceProfileExportConfiguration.getMetadataConfig().isAuthor()) {
		        conformanceProfileElement.addAttribute(new Attribute("author",
		            conformanceProfile.getAuthors() != null ? convertListToString(conformanceProfile.getAuthors()) : ""));}
			if(conformanceProfileExportConfiguration.getMetadataConfig().isOrganization()) {
		        conformanceProfileElement.addAttribute(new Attribute("organization",
		            conformanceProfile.getOrganization() != null ? conformanceProfile.getOrganization() : ""));}
			if(conformanceProfileExportConfiguration.getMetadataConfig().isType()) {
		        conformanceProfileElement.addAttribute(new Attribute("type",
		            conformanceProfile.getProfileType() != null ? conformanceProfile.getProfileType().name() : ""));}
			if(conformanceProfileExportConfiguration.getMetadataConfig().isRole()) {
		        conformanceProfileElement.addAttribute(new Attribute("role",
		            conformanceProfile.getRole() != null ? conformanceProfile.getRole().name() : ""));}
	        if(!conformanceProfileDataModel.getConformanceStatements().isEmpty() || !conformanceProfileDataModel.getPredicateMap().isEmpty()) {
	        Element constraints = constraintSerializationService.serializeConstraints(conformanceProfileDataModel.getConformanceStatements(), conformanceProfileDataModel.getPredicateMap(), conformanceProfileExportConfiguration.getConstraintExportConfiguration());
	        if (constraints != null) {
	        	conformanceProfileElement.appendChild(constraints);
        }
	        }
	
	        
	        if (conformanceProfile.getChildren() != null
		            && conformanceProfile.getChildren().size() > 0) {
	        	
		        	List<MsgStructElement> msgStructElementList = conformanceProfile.getChildren().stream().sorted((e1, e2) -> 
		        	e1.getPosition() - e2.getPosition()).collect(Collectors.toList());
		        	
		          for (MsgStructElement messageStructElm : msgStructElementList) {
			            if (messageStructElm != null && ExportTools.CheckUsage(conformanceProfileExportConfiguration.getSegmentORGroupsMessageExport(), messageStructElm.getUsage())) {
		            if (messageStructElm != null) {
//		              if(this.bindedGroupsAndSegmentRefs.contains(msgStructElm.getId())) {
		                Element msgStructElement = this.serializeMsgStructElement(igDataModel, messageStructElm, 0, conformanceProfileExportConfiguration);
		                if (msgStructElement != null) {
		                  conformanceProfileElement.appendChild(msgStructElement);
		                }
		              }
			            }
//		            }
		          }
		        }

	        // Calculate conformanceProfile delta if the conformanceProfile has an origin
		    if(conformanceProfile.getOrigin() != null) {
				List<StructureDelta> structureDelta = deltaService.delta(Type.CONFORMANCEPROFILE, conformanceProfile);
			  	if(structureDelta != null){
					List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
					if(structureDeltaChanged != null && structureDeltaChanged.size()>0) {
						Element changesElement = new Element("Changes");
						changesElement.addAttribute(new Attribute("mode", conformanceProfileExportConfiguration.getDeltaConfig().getMode().name()));

//		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
						changesElement.addAttribute(new Attribute("updatedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.UPDATED)));
						changesElement.addAttribute(new Attribute("addedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.ADDED)));
						changesElement.addAttribute(new Attribute("deletedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.DELETED)));
						List<Element> deltaElements = this.serializeDelta(structureDeltaChanged, conformanceProfileExportConfiguration.getDeltaConfig());
						if (deltaElements != null) {
							for (Element el : deltaElements){
								changesElement.appendChild(el);
							}
							conformanceProfileElement.appendChild(changesElement);

						}
					}
				}

		    }
		    
		    if (conformanceProfile.getCoConstraintsBindings() != null) {
		    		for(CoConstraintBinding coConstraintBinding : conformanceProfile.getCoConstraintsBindings()) {
		    			if(coConstraintBinding != null) {
		    				if(coConstraintBinding.getBindings() != null) {
		    		    			for(CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings() ) {
		    		    				if(coConstraintBindingSegment != null) {
		    		    					for(CoConstraintTableConditionalBinding coConstraintTableConditionalBinding : coConstraintBindingSegment.getTables()) {
		    		    						Element coConstraintsElement = null;
		    		    						CoConstraintTable mergedCoConstraintTable = coConstraintService.resolveRefAndMerge(coConstraintTableConditionalBinding.getValue());

		    		    						if(conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("COMPACT")) {
			    		    						 coConstraintsElement = coConstraintSerializationService.SerializeCoConstraintCompact(mergedCoConstraintTable);
		    		    						}
		    		    						if(conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("VERBOSE")) {
			    		    						 coConstraintsElement = coConstraintSerializationService.SerializeCoConstraintVerbose(mergedCoConstraintTable);
		    		    						}
//		    		    						if(conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("NOEXPORT")) {
//			    		    						 coConstraintsElement = new Element("");
//		    		    						}
//		    		    						System.out.println("Coconstraint XML :" + coConstraintsElement.toXML());
		    		    		    	        if (coConstraintsElement != null) {
		    		    		    	        	conformanceProfileElement.appendChild(coConstraintsElement);
		    		    		    	        }
		    		    					}
		    		    				}
		    				}
		    			}
		    			
		    		}
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
	  private Element serializeMsgStructElement(IgDataModel igDataModel, MsgStructElement msgStructElm, int depth, ConformanceProfileExportConfiguration conformanceProfileExportConfiguration)
	      throws SerializationException {
	    try {
	      Element msgStructElement;
	      if (msgStructElm instanceof Group) {
	        msgStructElement = serializeGroup(igDataModel, (Group) msgStructElm, depth, conformanceProfileExportConfiguration);
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
	        msgStructElement.addAttribute(new Attribute("position", String.valueOf(msgStructElm.getPosition())));


	      }
	      return msgStructElement;
	    } catch (SegmentNotFoundException e) {
	      throw new MsgStructElementSerializationException(e, msgStructElm);
	    }
	  }

	  /**
	   * @param segmentRef @return @throws
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

	  private Element serializeGroup(IgDataModel igDataModel, Group group, int depth, ConformanceProfileExportConfiguration conformanceProfileExportConfiguration) throws SerializationException {
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
	    groupElement.addAttribute(new Attribute("position", String.valueOf(group.getPosition())));
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
	        Element child = this.serializeMsgStructElement(igDataModel, msgStructElm, depth + 1, conformanceProfileExportConfiguration);
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

	private List<Element> serializeDelta(List<StructureDelta> structureDeltaList, DeltaConfiguration deltaConfiguration){
		if (structureDeltaList.size() > 0) {
			List<Element> changesElements = new ArrayList<>();
			for (StructureDelta structureDelta : structureDeltaList) {

				List<Element> els = this.setChangedElements(structureDelta, deltaConfiguration);
				if(els != null && els.size()>0){
					for(Element el : els){
						changesElements.add(el);
					}
				}
			}
			return changesElements;
		}
		return null;
	}

	private List<Element> setChangedElements(StructureDelta structureDelta, DeltaConfiguration deltaConfiguration) {
		List<Element> changedElements = new ArrayList<>();
		if(structureDelta != null) {

				if(structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("name",structureDelta.getName().getCurrent()));
					changedElement.addAttribute(new Attribute("type",structureDelta.getType().getValue()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
					changedElements.add(changedElement);
				}
				if(structureDelta.getMinCardinality() != null && !structureDelta.getMinCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getMinCardinality().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMIN.name()));
					changedElements.add(changedElement);
				}
				if(structureDelta.getMaxCardinality() != null && !structureDelta.getMaxCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getMaxCardinality().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMAX.name()));
					changedElements.add(changedElement);
				}
				if(structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
					Element changedElement = new Element("Change");
					changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
					changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
					changedElement.addAttribute(new Attribute("property", PropertyType.SEGMENTREF.name()));
					changedElements.add(changedElement);
				}


			if(structureDelta.getChildren().size()>0  && structureDelta.getType().equals(Type.GROUP)){
				List<StructureDelta> childrenDelta = structureDelta.getChildren().stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
				if(childrenDelta != null){
					Element changedElement = new Element("Changes");
					changedElement.addAttribute(new Attribute("mode", deltaConfiguration.getMode().name()));

//		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
					changedElement.addAttribute(new Attribute("updatedColor", deltaConfiguration.getColors().get(DeltaAction.UPDATED)));
					changedElement.addAttribute(new Attribute("addedColor", deltaConfiguration.getColors().get(DeltaAction.ADDED)));
					changedElement.addAttribute(new Attribute("deletedColor", deltaConfiguration.getColors().get(DeltaAction.DELETED)));
					changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));

					List<Element> deltaElements = this.serializeDelta(childrenDelta, deltaConfiguration);
					if (deltaElements != null) {
						for (Element el : deltaElements){
							changedElement.appendChild(el);
						}

					}
					changedElements.add(changedElement);
				}
			}

		}
		return changedElements;
	}
	
	private String convertListToString(List<String> list) {
		if(list != null && !list.isEmpty()) {
			return String.join(", ", list);
		}
		return "";
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
