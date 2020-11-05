package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.delta.domain.ConformanceStatementDelta;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.ResourceDelta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaExportConfigMode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConformanceProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.exception.MsgStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

import java.util.ArrayList;
import java.util.HashMap;
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

    @Autowired
    private FroalaSerializationUtil frolaCleaning;

    @Autowired
    BindingSerializationService bindingSerializationService;

    @Override
    public Element serializeConformanceProfile(ConformanceProfileDataModel conformanceProfileDataModel, IgDataModel igDataModel, int level, int position,
                                               ConformanceProfileExportConfiguration conformanceProfileExportConfiguration, Boolean deltaMode) throws ResourceSerializationException {
        ConformanceProfile conformanceProfile = conformanceProfileDataModel.getModel();
        if (conformanceProfile != null) {
            try {
                Element conformanceProfileElement = igDataModelSerializationService.serializeResource(conformanceProfileDataModel.getModel(), Type.CONFORMANCEPROFILE, position, conformanceProfileExportConfiguration);

                List<CoConstraintBinding> coConstraintDelta = null;
                // Calculate conformanceProfile delta if the conformanceProfile has an origin

                if (deltaMode && conformanceProfile.getOrigin() != null && conformanceProfileExportConfiguration.isDeltaMode()) {
                    ResourceDelta resourceDelta = deltaService.delta(Type.CONFORMANCEPROFILE, conformanceProfile);
                    if (resourceDelta != null) {
                        List<StructureDelta> structureDelta = resourceDelta.getStructureDelta();

                        List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
                        List<ConformanceStatementDelta> confStDeltaChanged = resourceDelta.getConformanceStatementDelta().stream().filter(d -> !d.getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
                        List<CoConstraintBinding> coConstraintDeltaChanged = null;
                        if (resourceDelta.getCoConstraintBindings() != null) {
                            coConstraintDeltaChanged = resourceDelta.getCoConstraintBindings().stream().filter(d -> !d.getDelta().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
                        }
                        coConstraintDelta = resourceDelta.getCoConstraintBindings();
                        if ((structureDeltaChanged != null && structureDeltaChanged.size() > 0) || (confStDeltaChanged != null && confStDeltaChanged.size() > 0) || (coConstraintDeltaChanged != null && coConstraintDeltaChanged.size() > 0)) {
                            Element changesElement = new Element("Changes");
                            changesElement.addAttribute(new Attribute("mode", conformanceProfileExportConfiguration.getDeltaConfig().getMode().name()));
                            changesElement.addAttribute(new Attribute("updatedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.UPDATED)));
                            changesElement.addAttribute(new Attribute("addedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.ADDED)));
                            changesElement.addAttribute(new Attribute("deletedColor", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.DELETED)));
                            if (structureDeltaChanged != null && structureDeltaChanged.size() > 0) {
                                List<Element> deltaElements = this.serializeDelta(structureDeltaChanged, conformanceProfileExportConfiguration.getDeltaConfig());
                                if (deltaElements != null) {
                                    for (Element el : deltaElements) {
                                        changesElement.appendChild(el);
                                    }


                                }
                            }

                            if (confStDeltaChanged != null && confStDeltaChanged.size() > 0) {
                                List<Element> deltaConfStatements = this.serializeDeltaConf(confStDeltaChanged, conformanceProfileExportConfiguration.getDeltaConfig());
                                if (deltaConfStatements != null) {
                                    for (Element el : deltaConfStatements) {
                                        changesElement.appendChild(el);
                                    }

                                }
                            }
                            conformanceProfileElement.appendChild(changesElement);


                        } else {
                            return null;
                        }

                    } else {
                        return null;
                    }


                }
                if (conformanceProfileExportConfiguration.getIdentifier()) {
                    conformanceProfileElement.addAttribute(new Attribute("identifier",
                            conformanceProfile.getIdentifier() != null ? conformanceProfile.getIdentifier() : ""));
                }
                if (conformanceProfileExportConfiguration.getMessageType()) {
                    conformanceProfileElement.addAttribute(new Attribute("messageType",
                            conformanceProfile.getMessageType() != null ? conformanceProfile.getMessageType()
                                    : ""));
                }
                if (conformanceProfileExportConfiguration.getEvent()) {
                    conformanceProfileElement.addAttribute(new Attribute("event",
                            conformanceProfile.getEvent() != null ? conformanceProfile.getEvent() : ""));
                }
                if (conformanceProfileExportConfiguration.getStructID()) {
                    conformanceProfileElement.addAttribute(new Attribute("structID",
                            conformanceProfile.getStructID() != null ? conformanceProfile.getStructID() : ""));
                }
                if (conformanceProfileExportConfiguration.getMetadataConfig().isAuthor()) {
                    conformanceProfileElement.addAttribute(new Attribute("author",
                            conformanceProfile.getAuthors() != null ? convertListToString(conformanceProfile.getAuthors()) : ""));
                }
                if (conformanceProfileExportConfiguration.getMetadataConfig().isOrganization()) {
                    conformanceProfileElement.addAttribute(new Attribute("organization",
                            conformanceProfile.getOrganization() != null ? conformanceProfile.getOrganization() : ""));
                }
                if (conformanceProfileExportConfiguration.getMetadataConfig().isType()) {
                    conformanceProfileElement.addAttribute(new Attribute("type",
                            conformanceProfile.getProfileType() != null ? conformanceProfile.getProfileType().name() : ""));
                }
                if (conformanceProfileExportConfiguration.getMetadataConfig().isRole()) {
                    conformanceProfileElement.addAttribute(new Attribute("role",
                            conformanceProfile.getRole() != null ? conformanceProfile.getRole().name() : ""));
                }
                if (!conformanceProfileDataModel.getConformanceStatements().isEmpty() || !conformanceProfileDataModel.getPredicateMap().isEmpty()) {
                    Element constraints = constraintSerializationService.serializeConstraints(conformanceProfileDataModel.getConformanceStatements(), conformanceProfileDataModel.getPredicateMap(), conformanceProfileExportConfiguration.getConstraintExportConfiguration());
                    if (constraints != null) {
                        conformanceProfileElement.appendChild(constraints);
                    }
                }
                
        	      Map<String, Boolean > bindedPaths = conformanceProfile.getChildren().stream().filter(  field  -> field != null && ExportTools.CheckUsage(conformanceProfileExportConfiguration.getSegmentORGroupsMessageExport(), field.getUsage())).collect(Collectors.toMap( x -> x.getId(), x -> true ));


                if (conformanceProfile.getBinding() != null) {
                    Element bindingElement = bindingSerializationService.serializeBinding(conformanceProfile.getBinding(), conformanceProfileDataModel.getValuesetMap(), conformanceProfileDataModel.getModel().getName(), bindedPaths);
                    if (bindingElement != null) {
                        conformanceProfileElement.appendChild(bindingElement);
                    }
                }



                if (conformanceProfile.getChildren() != null
                        && conformanceProfile.getChildren().size() > 0) {
                    Element commentsElement = new Element("Comments");
                    Element definitionTextsElement = new Element("DefinitionTexts");
                    for (SegmentRefOrGroup segmentRefOrGroup : conformanceProfile.getChildren()) {
                        if (segmentRefOrGroup.getComments() != null) {
                            for (Comment comment : segmentRefOrGroup.getComments()) {
                                Element commentElement = new Element("Comment");
                                commentElement.addAttribute(new Attribute("name", segmentRefOrGroup.getName()));
                                commentElement.addAttribute(new Attribute("description", comment.getDescription()));
                                commentsElement.appendChild(commentElement);
                            }

                        }
                        if (segmentRefOrGroup.getText() != null) {
                            Element definitionText = new Element("DefinitionText");
                            definitionText
                                    .addAttribute(new Attribute("text", segmentRefOrGroup.getText()));
                            definitionText.addAttribute(new Attribute("name", segmentRefOrGroup.getName()));
                            definitionTextsElement.appendChild(definitionText);
                        }
                    }

                    conformanceProfileElement.appendChild(commentsElement);
                    conformanceProfileElement.appendChild(definitionTextsElement);


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
                if (deltaMode && conformanceProfile.getOrigin() != null && conformanceProfileExportConfiguration.isDeltaMode() && coConstraintDelta != null && coConstraintDelta.size() > 0) {
                    Element coConstraintsBindingsElement = new Element("coConstraintsBindingsElement");
                    conformanceProfileElement.appendChild(coConstraintsBindingsElement);
                    if (conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE) ||
                            conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_CHANGED_ONLY) ||
                            conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_OLD_VALUES)) {
                        coConstraintDelta = coConstraintDelta.stream().filter(d -> !d.getDelta().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
                    }
                    for (CoConstraintBinding coConstraintBinding : coConstraintDelta) {
                        Element coConstraintBindingElement = new Element("coConstraintBindingElement");
                        coConstraintsBindingsElement.appendChild(coConstraintBindingElement);
                        if (coConstraintBinding != null) {
                            if (coConstraintBinding.getContext() != null) {
                                Element coConstraintContext = new Element("coConstraintContext");
                                coConstraintContext.appendChild(coConstraintBinding.getContext().getName());
                                coConstraintBindingElement.appendChild(coConstraintContext);
                            }
                            if (coConstraintBinding.getBindings() != null) {
                                if (conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE) ||
                                        conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_CHANGED_ONLY) ||
                                        conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_OLD_VALUES)) {
                                    coConstraintBinding.setBindings(coConstraintBinding.getBindings().stream().filter(d -> !d.getDelta().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList()));
                                }
                                for (CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings()) {
                                    if (coConstraintBindingSegment != null) {
                                        Element coConstraintBindingSegmentElement = new Element("coConstraintBindingSegmentElement");
                                        coConstraintBindingElement.appendChild(coConstraintBindingSegmentElement);
                                        Element coConstraintSegmentName = new Element("coConstraintSegmentName");
                                        coConstraintSegmentName.appendChild(coConstraintBindingSegment.getSegment().getName());
                                        coConstraintBindingSegmentElement.appendChild(coConstraintSegmentName);
                                        if (conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE) ||
                                                conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_CHANGED_ONLY) ||
                                                conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_OLD_VALUES)) {
                                            coConstraintBindingSegment.setTables(coConstraintBindingSegment.getTables().stream().filter(d -> !d.getDelta().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList()));
                                        }
                                        for (CoConstraintTableConditionalBinding coConstraintTableConditionalBinding : coConstraintBindingSegment.getTables()) {
                                            CoConstraintTable mergedCoConstraintTable = coConstraintService.resolveRefAndMerge(coConstraintTableConditionalBinding.getValue());
                                            Element coConstraintTableConditionalBindingElement = new Element("coConstraintTableConditionalBindingElement");
                                            if(coConstraintTableConditionalBinding.getDelta().equals(DeltaAction.ADDED) || coConstraintTableConditionalBinding.getDelta().equals(DeltaAction.DELETED)){
                                                coConstraintTableConditionalBindingElement.addAttribute(new Attribute("background", conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(coConstraintTableConditionalBinding.getDelta())));
                                            }
                                            coConstraintBindingSegmentElement.appendChild(coConstraintTableConditionalBindingElement);

                                            if (coConstraintTableConditionalBinding.getConditionDelta() != null) {
                                                if (conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIGHLIGHT_WITH_OLD_VALUES)
                                                        || conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_OLD_VALUES)) {

                                                    Element coConstraintCondition = new Element("coConstraintCondition");

                                                    if(coConstraintTableConditionalBinding.getConditionDelta().getPrevious() != null){
                                                        Element span = new Element("span");
                                                        span.addAttribute(new Attribute("style", "background-color: " + conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.DELETED)));
                                                        span.appendChild(coConstraintTableConditionalBinding.getConditionDelta().getPrevious());
                                                        coConstraintCondition.appendChild(span);
                                                    }
                                                    if(coConstraintTableConditionalBinding.getConditionDelta().getCurrent() != null){
                                                        Element span = new Element("span");
                                                        span.addAttribute(new Attribute("style", "background-color: " + conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.ADDED)));
                                                        span.appendChild(coConstraintTableConditionalBinding.getConditionDelta().getCurrent());
                                                        coConstraintCondition.appendChild(span);
                                                    }
                                                    coConstraintTableConditionalBindingElement.appendChild(coConstraintCondition);

                                                } else {

                                                    Element coConstraintCondition = new Element("coConstraintCondition");
                                                    Element span = new Element("span");
                                                    String color = null;
                                                    if (coConstraintTableConditionalBinding.getConditionDelta().getDelta().equals(DeltaAction.CHANGED)) {
                                                        color = conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(DeltaAction.UPDATED);
                                                    } else {
                                                        color = conformanceProfileExportConfiguration.getDeltaConfig().getColors().get(coConstraintTableConditionalBinding.getConditionDelta().getDelta());
                                                    }

                                                    if(coConstraintTableConditionalBinding.getConditionDelta().getCurrent() != null){
                                                        span.addAttribute(new Attribute("style", "background-color: " + color));
                                                        span.appendChild(coConstraintTableConditionalBinding.getConditionDelta().getCurrent());
                                                        coConstraintCondition.appendChild(span);
                                                        coConstraintTableConditionalBindingElement.appendChild(coConstraintCondition);
                                                    }



                                                }
                                            } else {
                                                if (coConstraintTableConditionalBinding.getCondition() != null && !conformanceProfileExportConfiguration.getDeltaConfig().getMode().equals(DeltaExportConfigMode.HIDE_WITH_CHANGED_ONLY)) {
                                                    Element coConstraintCondition = new Element("coConstraintCondition");
                                                    coConstraintCondition.appendChild(coConstraintTableConditionalBinding.getCondition().getDescription());
                                                    coConstraintTableConditionalBindingElement.appendChild(coConstraintCondition);
                                                }
                                            }

                                            if (conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("COMPACT")) {
                                                Element coConstraintsTable = new Element("coConstraintsTable");
                                                coConstraintsTable.appendChild(coConstraintSerializationService.SerializeCoConstraintCompactDelta(mergedCoConstraintTable, coConstraintDelta, conformanceProfileExportConfiguration));

                                                coConstraintTableConditionalBindingElement.appendChild(coConstraintsTable);
                                            }
                                            if (conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("VERBOSE")) {
//
                                                Element coConstraintsTable = new Element("coConstraintsTable");
                                                coConstraintsTable.appendChild(coConstraintSerializationService.SerializeCoConstraintVerbose(mergedCoConstraintTable));
                                                coConstraintTableConditionalBindingElement.appendChild(coConstraintsTable);
                                            }
//
                                        }
                                    }
                                }
                            }

                        }
//		    			conformanceProfileElement.appendChild(getCoConstraintsBindingsElement);

                    }

                }
                else {
                    if (conformanceProfile.getCoConstraintsBindings() != null) {
                        Element coConstraintsBindingsElement = new Element("coConstraintsBindingsElement");
                        conformanceProfileElement.appendChild(coConstraintsBindingsElement);
                        for (CoConstraintBinding coConstraintBinding : conformanceProfile.getCoConstraintsBindings()) {
                            Element coConstraintBindingElement = new Element("coConstraintBindingElement");
                            coConstraintsBindingsElement.appendChild(coConstraintBindingElement);
                            if (coConstraintBinding != null) {
                                if (coConstraintBinding.getContext() != null) {
                                    Element coConstraintContext = new Element("coConstraintContext");
                                    coConstraintContext.appendChild(coConstraintBinding.getContext().getName());
                                    coConstraintBindingElement.appendChild(coConstraintContext);
                                }
                                if (coConstraintBinding.getBindings() != null) {
                                    for (CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings()) {
                                        if (coConstraintBindingSegment != null) {
                                            Element coConstraintBindingSegmentElement = new Element("coConstraintBindingSegmentElement");
                                            coConstraintBindingElement.appendChild(coConstraintBindingSegmentElement);
//		    								coConstraintBindingSegmentElement.appendChild(coConstraintContext);
                                            Element coConstraintSegmentName = new Element("coConstraintSegmentName");
                                            coConstraintSegmentName.appendChild(coConstraintBindingSegment.getSegment().getName());
                                            coConstraintBindingSegmentElement.appendChild(coConstraintSegmentName);
                                            for (CoConstraintTableConditionalBinding coConstraintTableConditionalBinding : coConstraintBindingSegment.getTables()) {
                                                CoConstraintTable mergedCoConstraintTable = coConstraintService.resolveRefAndMerge(coConstraintTableConditionalBinding.getValue());
                                                Element coConstraintTableConditionalBindingElement = new Element("coConstraintTableConditionalBindingElement");
                                                coConstraintBindingSegmentElement.appendChild(coConstraintTableConditionalBindingElement);
                                                if (coConstraintTableConditionalBinding.getCondition() != null) {
                                                    Element coConstraintCondition = new Element("coConstraintCondition");
                                                    coConstraintCondition.appendChild(coConstraintTableConditionalBinding.getCondition().getDescription());
                                                    coConstraintTableConditionalBindingElement.appendChild(coConstraintCondition);
                                                }
                                                if (conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("COMPACT")) {
                                                    Element coConstraintsTable = new Element("coConstraintsTable");
                                                    coConstraintsTable.appendChild(coConstraintSerializationService.SerializeCoConstraintCompact(mergedCoConstraintTable));

                                                    coConstraintTableConditionalBindingElement.appendChild(coConstraintsTable);
                                                }
                                                if (conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("VERBOSE")) {
//		    		    							if(coConstraintTableConditionalBinding.getCondition() != null) {
//			    		    						 Element coConstraintCondition = new Element("coConstraintCondition");
//			    		    							coConstraintCondition.appendChild(coConstraintTableConditionalBinding.getCondition().getDescription());
//				    		    						coConstraintsElement.appendChild(coConstraintCondition);
//		    		    							}
                                                    Element coConstraintsTable = new Element("coConstraintsTable");
                                                    coConstraintsTable.appendChild(coConstraintSerializationService.SerializeCoConstraintVerbose(mergedCoConstraintTable));
                                                    coConstraintTableConditionalBindingElement.appendChild(coConstraintsTable);
                                                }
//		    		    						if(conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("NOEXPORT")) {
//			    		    						 coConstraintsElement = new Element("");
//		    		    						}
//		    		    						System.out.println("Coconstraint XML :" + coConstraintsElement.toXML());
//		    		    		    	        if (coConstraintsElement != null) {
//		    		    		    	        	getCoConstraintsBindingsElement.appendChild(coConstraintsElement);
//		    		    		    	        }
                                            }
                                        }
                                    }
                                }

                            }
//		    			conformanceProfileElement.appendChild(getCoConstraintsBindingsElement);

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
                    new Attribute("text", segmentRef.getText() != null ? frolaCleaning.cleanFroalaInput(segmentRef.getText()) : ""));
            segmentRefElement.addAttribute(
                    new Attribute("max", segmentRef.getMax() != null ? segmentRef.getMax() : ""));
            segmentRefElement.addAttribute(new Attribute("min", String.valueOf(segmentRef.getMin())));
            segmentRefElement.addAttribute(new Attribute("type", Type.SEGMENTREF.name()));
            segmentRefElement.addAttribute(new Attribute("usage",
                    segmentRef.getUsage() != null ? segmentRef.getUsage().toString() : ""));
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

    private List<Element> serializeDelta(List<StructureDelta> structureDeltaList, DeltaConfiguration deltaConfiguration) {
        if (structureDeltaList.size() > 0) {
            List<Element> changesElements = new ArrayList<>();
            for (StructureDelta structureDelta : structureDeltaList) {

                List<Element> els = this.setChangedElements(structureDelta, deltaConfiguration);
                if (els != null && els.size() > 0) {
                    for (Element el : els) {
                        changesElements.add(el);
                    }
                }
            }
            return changesElements;
        }
        return null;
    }

    private List<Element> serializeDeltaConf(List<ConformanceStatementDelta> confStDeltaChanged, DeltaConfiguration deltaConfiguration) {
        if (confStDeltaChanged.size() > 0) {
            List<Element> changesElements = new ArrayList<Element>();
            for (ConformanceStatementDelta conformanceStatementDelta : confStDeltaChanged) {

                List<Element> els = this.setChangedConfStatements(conformanceStatementDelta);
                if (els != null && els.size() > 0) {
                    for (Element el : els) {
                        changesElements.add(el);
                    }
                }
            }
            return changesElements;
        }
        return null;
    }

    private List<Element> setChangedConfStatements(ConformanceStatementDelta conformanceStatementDelta) {
        List<Element> changedElements = new ArrayList<>();

        if (conformanceStatementDelta != null) {
            if (conformanceStatementDelta.getAction().equals(DeltaAction.DELETED) || conformanceStatementDelta.getAction().equals(DeltaAction.ADDED)) {
                Element addedDesc = new Element("Change");
                String value = "";
                if(conformanceStatementDelta.getAction().equals(DeltaAction.DELETED)){
                    value = conformanceStatementDelta.getIdentifier().getPrevious();
                }
                if(conformanceStatementDelta.getAction().equals(DeltaAction.ADDED)){
                    value = conformanceStatementDelta.getIdentifier().getCurrent();
                }
                addedDesc.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
                addedDesc.addAttribute(new Attribute("identifier", value));
                addedDesc.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
                addedDesc.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));

                Element addedId = new Element("Change");
                addedId.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
                addedId.addAttribute(new Attribute("identifier", value));
                addedId.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
                addedId.addAttribute(new Attribute("property", PropertyType.IDENTIFIER.name()));

                if(conformanceStatementDelta.getAction().equals(DeltaAction.DELETED) ){
                    Element addedConf = new Element("Change");
                    addedConf.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
                    addedConf.addAttribute(new Attribute("identifier", value));
                    addedConf.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
                    addedConf.addAttribute(new Attribute("property", Type.CONFORMANCESTATEMENT.getValue()));
                    addedId.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getIdentifier().getPrevious()));
                    changedElements.add(addedConf);

                    addedDesc.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getDescription().getPrevious()));
                    addedId.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getIdentifier().getPrevious()));

                }

                changedElements.add(addedDesc);
                changedElements.add(addedId);


            } else {
                if (conformanceStatementDelta.getDescription() != null && !conformanceStatementDelta.getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
                    Element changedElement = new Element("Change");
                    changedElement.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
                    changedElement.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
                    changedElement.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
                    changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
                    changedElement.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getDescription().getPrevious()));
                    changedElements.add(changedElement);

                }
            }
        }
        return changedElements;
    }

    private List<Element> setChangedElements(StructureDelta structureDelta, DeltaConfiguration deltaConfiguration) {
        List<Element> changedElements = new ArrayList<>();
        if (structureDelta != null) {
            if (structureDelta.getAction().equals(DeltaAction.DELETED) || structureDelta.getAction().equals(DeltaAction.ADDED)) {
                Element addedUsage = new Element("Change");
                addedUsage.addAttribute(new Attribute("type", Type.SEGMENTREF.getValue()));
                addedUsage.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                addedUsage.addAttribute(new Attribute("action", structureDelta.getAction().name()));
                addedUsage.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
                changedElements.add(addedUsage);


                Element addedMinC = new Element("Change");
                addedMinC.addAttribute(new Attribute("type", Type.SEGMENTREF.getValue()));
                addedMinC.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                addedMinC.addAttribute(new Attribute("action", structureDelta.getAction().name()));
                addedMinC.addAttribute(new Attribute("property", PropertyType.CARDINALITYMIN.name()));
                changedElements.add(addedMinC);

                Element addedMaxC = new Element("Change");
                addedMaxC.addAttribute(new Attribute("type", Type.SEGMENTREF.getValue()));
                addedMaxC.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                addedMaxC.addAttribute(new Attribute("action", structureDelta.getAction().name()));
                addedMaxC.addAttribute(new Attribute("property", PropertyType.CARDINALITYMAX.name()));
                changedElements.add(addedMaxC);

                Element addedSeg = new Element("Change");
                addedSeg.addAttribute(new Attribute("type", Type.SEGMENTREF.getValue()));
                addedSeg.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                addedSeg.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
                addedSeg.addAttribute(new Attribute("property", PropertyType.SEGMENTREF.name()));
                changedElements.add(addedSeg);


                if (structureDelta.getPredicate() != null && !structureDelta.getPredicate().getAction().equals(DeltaAction.UNCHANGED)) {
                    if (structureDelta.getPredicate().getFalseUsage() != null && !structureDelta.getPredicate().getFalseUsage().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getFalseUsage().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.FALSEUSAGE.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getFalseUsage().getPrevious().name()));
                        changedElements.add(changedElement);
                    }

                    if (structureDelta.getPredicate().getTrueUsage() != null && !structureDelta.getPredicate().getTrueUsage().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getTrueUsage().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.TRUEUSAGE.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getTrueUsage().getPrevious().name()));
                        changedElements.add(changedElement);
                    }

                    if (structureDelta.getPredicate().getDescription() != null && !structureDelta.getPredicate().getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getDescription().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getDescription().getPrevious()));
                        changedElements.add(changedElement);
                    }

                }
            } else {
                if (structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
                    Element changedElement = new Element("Change");
                    changedElement.addAttribute(new Attribute("name", structureDelta.getName().getCurrent()));
                    changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                    changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                    changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
                    changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
                    changedElement.addAttribute(new Attribute("oldValue", structureDelta.getUsage().getPrevious().name()));

                    changedElements.add(changedElement);
                }
                if (structureDelta.getMinCardinality() != null && !structureDelta.getMinCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
                    Element changedElement = new Element("Change");
                    changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                    changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                    changedElement.addAttribute(new Attribute("action", structureDelta.getMinCardinality().getAction().name()));
                    changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMIN.name()));
                    changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMinCardinality().getPrevious().toString()));

                    changedElements.add(changedElement);
                }
                if (structureDelta.getMaxCardinality() != null && !structureDelta.getMaxCardinality().getAction().equals(DeltaAction.UNCHANGED)) {
                    Element changedElement = new Element("Change");
                    changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                    changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                    changedElement.addAttribute(new Attribute("action", structureDelta.getMaxCardinality().getAction().name()));
                    changedElement.addAttribute(new Attribute("property", PropertyType.CARDINALITYMAX.name()));
                    changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMaxCardinality().getPrevious()));

                    changedElements.add(changedElement);
                }
                if (structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
                    Element changedElement = new Element("Change");
                    changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                    changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                    changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
                    changedElement.addAttribute(new Attribute("property", PropertyType.SEGMENTREF.name()));
                    changedElement.addAttribute(new Attribute("oldValue", structureDelta.getReference().getLabel().getPrevious()));

                    changedElements.add(changedElement);
                }

                if (structureDelta.getPredicate() != null && !structureDelta.getPredicate().getAction().equals(DeltaAction.UNCHANGED)) {
                    if (structureDelta.getPredicate().getFalseUsage() != null && !structureDelta.getPredicate().getFalseUsage().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getFalseUsage().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.FALSEUSAGE.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getFalseUsage().getPrevious().name()));
                        changedElements.add(changedElement);
                    }

                    if (structureDelta.getPredicate().getTrueUsage() != null && !structureDelta.getPredicate().getTrueUsage().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getTrueUsage().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.TRUEUSAGE.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getTrueUsage().getPrevious().name()));
                        changedElements.add(changedElement);
                    }

                    if (structureDelta.getPredicate().getDescription() != null && !structureDelta.getPredicate().getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
                        Element changedElement = new Element("Change");
                        changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
                        changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
                        changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getDescription().getAction().name()));
                        changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
                        changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getDescription().getPrevious()));
                        changedElements.add(changedElement);
                    }

                }
            }
            if (structureDelta.getChildren().size() > 0 && structureDelta.getType().equals(Type.GROUP)) {
                List<StructureDelta> childrenDelta = structureDelta.getChildren().stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
                if (childrenDelta != null) {
                    Element changedElement = new Element("Changes");
                    changedElement.addAttribute(new Attribute("mode", deltaConfiguration.getMode().name()));

//		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
                    changedElement.addAttribute(new Attribute("updatedColor", deltaConfiguration.getColors().get(DeltaAction.UPDATED)));
                    changedElement.addAttribute(new Attribute("addedColor", deltaConfiguration.getColors().get(DeltaAction.ADDED)));
                    changedElement.addAttribute(new Attribute("deletedColor", deltaConfiguration.getColors().get(DeltaAction.DELETED)));
                    changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));

                    List<Element> deltaElements = this.serializeDelta(childrenDelta, deltaConfiguration);
                    if (deltaElements != null) {
                        for (Element el : deltaElements) {
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
        if (list != null && !list.isEmpty()) {
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
