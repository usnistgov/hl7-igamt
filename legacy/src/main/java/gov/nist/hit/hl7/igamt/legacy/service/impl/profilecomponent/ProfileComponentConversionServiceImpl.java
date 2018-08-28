/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.legacy.service.impl.profilecomponent;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Comment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DatatypeLink;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DynamicMappingDefinition;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DynamicMappingItem;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponent;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SubProfileComponent;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBindingStrength;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetOrSingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.ConformanceStatement;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.Predicate;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.legacy.repository.MessageRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent.Level;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyComment;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConfLength;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConformanceStatement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDefinitionText;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDynamicMapping;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyPredicate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertySingleCode;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyUsage;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class ProfileComponentConversionServiceImpl implements ConversionService {

  @Autowired
  private ProfileComponentRepository oldProfileComponentRepository =
      (ProfileComponentRepository) legacyContext.getBean("profileComponentRepository");

  @Autowired
  private gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository convertedProfileComponentService =
      context.getBean(
          gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository.class);

  @Autowired
  private SegmentRepository oldSegmentRepository =
      (SegmentRepository) legacyContext.getBean("segmentRepository");

  @Autowired
  private MessageRepository oldMessageRepository =
      (MessageRepository) legacyContext.getBean("messageRepository");

  @Override
  public void convert() {
    init();
    List<ProfileComponent> oldProfileComponents = oldProfileComponentRepository.findAll();
    for (ProfileComponent oldProfileComponent : oldProfileComponents) {
      this.convertProfileComponents(oldProfileComponent);
    }
    List<gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent> profileComponents =
        convertedProfileComponentService.findAll();
    System.out.println(oldProfileComponents.size() + " will be coverted!");
    System.out.println(profileComponents.size() + " have be coverted!");
  }

  /**
   * @param oldProfileComponent
   * @return
   */
  private void convertProfileComponents(ProfileComponent oldProfileComponent) {
    gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent convertedProfileComponent =
        new gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent();
    convertedProfileComponent.setId(new CompositeKey(oldProfileComponent.getId()));

    for (SubProfileComponent spc : oldProfileComponent.getChildren()) {

      if (spc.getFrom().equals("segment")) {
        convertedProfileComponent.setLevel(Level.SEGMENT);
        convertedProfileComponent.setSourceId(spc.getSource().getSegmentId());
        if (convertedProfileComponent.getSourceId() != null) {
          Segment oldSeg = null;
          Optional<Segment> optional =
              oldSegmentRepository.findById(convertedProfileComponent.getSourceId());
          if (optional.isPresent()) {
            oldSeg = optional.get();
            convertedProfileComponent.setStructure(oldSeg.getName());
          }
        }
      } else if (spc.getFrom().equals("message")) {
        convertedProfileComponent.setLevel(Level.MESSAGE);
        convertedProfileComponent.setSourceId(spc.getSource().getMessageId());

        if (convertedProfileComponent.getSourceId() != null) {
          Message oldMsg = null;
          Optional<Message> optional =
              oldMessageRepository.findById(convertedProfileComponent.getSourceId());
          if (optional.isPresent()) {
            oldMsg = optional.get();
            convertedProfileComponent.setStructure(oldMsg.getStructID());
          }
        }
      }

      ProfileComponentItem item = new ProfileComponentItem();
      item.setPath(spc.getPath());
      String newMax = spc.getAttributes().getMax();
      if (newMax != null) {
        PropertyCardinalityMax propertyCardinalityMax = new PropertyCardinalityMax();
        propertyCardinalityMax.setMax(newMax);
        item.addItemProperty(propertyCardinalityMax);
      }

      Integer newMin = spc.getAttributes().getMin();
      if (newMin != null) {
        PropertyCardinalityMin propertyCardinalityMin = new PropertyCardinalityMin();
        propertyCardinalityMin.setMin(newMin);
        item.addItemProperty(propertyCardinalityMin);
      }

      String maxLength = spc.getAttributes().getMaxLength();
      if (maxLength != null) {
        PropertyLengthMax propertyLengthMax = new PropertyLengthMax();
        propertyLengthMax.setMax(maxLength);
        item.addItemProperty(propertyLengthMax);
      }

      String minLength = spc.getAttributes().getMinLength();
      if (minLength != null) {
        PropertyLengthMin propertyLengthMin = new PropertyLengthMin();
        propertyLengthMin.setMin(minLength);
        item.addItemProperty(propertyLengthMin);
      }


      String confLength = spc.getAttributes().getConfLength();
      if (confLength != null) {
        PropertyConfLength propertyConfLength = new PropertyConfLength();
        propertyConfLength.setConfLength(confLength);
        item.addItemProperty(propertyConfLength);
      }

      DatatypeLink newDatatypeLink = spc.getAttributes().getDatatype();
      if (newDatatypeLink != null) {
        PropertyDatatype propertyDatatype = new PropertyDatatype();
        propertyDatatype.setDatatypeId(newDatatypeLink.getId());
        item.addItemProperty(propertyDatatype);
      }

      Usage usage = spc.getAttributes().getUsage();
      if (usage != null) {
        PropertyUsage propertyUsage = new PropertyUsage();
        propertyUsage.setUsage(ConversionUtil.convertUsage(usage));
        item.addItemProperty(propertyUsage);
      }

      List<Comment> comments = spc.getComments();
      if (comments != null && comments.size() > 0) {
        for (Comment c : comments) {
          PropertyComment propertyComment = new PropertyComment();
          gov.nist.hit.hl7.igamt.common.binding.domain.Comment newComment =
              new gov.nist.hit.hl7.igamt.common.binding.domain.Comment();
          newComment.setDateupdated(c.getLastUpdatedDate());
          newComment.setDescription(c.getDescription());
          propertyComment.setComment(newComment);
          item.addItemProperty(propertyComment);
        }
      }

      comments = spc.getAttributes().getComments();
      if (comments != null && comments.size() > 0) {
        for (Comment c : comments) {
          PropertyComment propertyComment = new PropertyComment();
          gov.nist.hit.hl7.igamt.common.binding.domain.Comment newComment =
              new gov.nist.hit.hl7.igamt.common.binding.domain.Comment();
          newComment.setDateupdated(c.getLastUpdatedDate());
          newComment.setDescription(c.getDescription());
          propertyComment.setComment(newComment);
          item.addItemProperty(propertyComment);
        }
      }

      // NO singleElementValue Data
      // spc.getSingleElementValues();

      // NO Ref data
      // spc.getAttributes().getRef();

      // No CoConstraintsTable Data
      // spc.getAttributes().getCoConstraintsTable();

      // No Tables Value
      // spc.getAttributes().getTables();


      DynamicMappingDefinition oldDynamicMappingDefinition =
          spc.getAttributes().getDynamicMappingDefinition();
      if (oldDynamicMappingDefinition != null) {
        PropertyDynamicMapping propertyDynamicMapping = new PropertyDynamicMapping();
        DynamicMappingInfo dynamicMappingInfo = new DynamicMappingInfo();

        for (DynamicMappingItem oldItem : oldDynamicMappingDefinition.getDynamicMappingItems()) {
          gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem newItem =
              new gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem();
          newItem.setDatatypeId(oldItem.getDatatypeId());
          newItem.setValue(oldItem.getFirstReferenceValue());
          dynamicMappingInfo.addItem(newItem);
        }
        dynamicMappingInfo.setReferencePath(
            oldDynamicMappingDefinition.getMappingStructure().getSecondRefereceLocation());
        dynamicMappingInfo.setVariesDatatypePath(
            oldDynamicMappingDefinition.getMappingStructure().getTargetLocation());

        propertyDynamicMapping.setDynamicMappingInfo(dynamicMappingInfo);
        item.addItemProperty(propertyDynamicMapping);
      }


      String oldText = spc.getAttributes().getText();
      if (oldText != null) {
        PropertyDefinitionText propertyDefinitionText = new PropertyDefinitionText();
        propertyDefinitionText.setDefinitionText(oldText);
        item.addItemProperty(propertyDefinitionText);
      }

      PropertyValueSet propertyValueSet = new PropertyValueSet();
      PropertySingleCode propertySingleCode = new PropertySingleCode();

      List<ValueSetOrSingleCodeBinding> oldValueSetOrSingleCodeBindings = spc.getValueSetBindings();
      if (oldValueSetOrSingleCodeBindings != null && oldValueSetOrSingleCodeBindings.size() > 0) {
        for (ValueSetOrSingleCodeBinding vsosc : oldValueSetOrSingleCodeBindings) {
          if (vsosc.getType().equals("valueset")) {
            ValueSetBinding oldValueSetBinding = (ValueSetBinding) vsosc;

            gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding vb =
                new gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding();
            if (oldValueSetBinding.getBindingStrength().equals(ValueSetBindingStrength.R)) {
              vb.setStrength(ValuesetStrength.R);
            } else if (oldValueSetBinding.getBindingStrength().equals(ValueSetBindingStrength.S)) {
              vb.setStrength(ValuesetStrength.S);
            } else if (oldValueSetBinding.getBindingStrength().equals(ValueSetBindingStrength.U)) {
              vb.setStrength(ValuesetStrength.U);
            } else {
              vb.setStrength(ValuesetStrength.R);
            }
            vb.setValuesetId(oldValueSetBinding.getTableId());
            if (oldValueSetBinding.getBindingLocation() == null) {
              vb.addValuesetLocation(1);
            } else if (oldValueSetBinding.getBindingLocation().equals("1")) {
              vb.addValuesetLocation(1);
            } else if (oldValueSetBinding.getBindingLocation().equals("2")) {
              vb.addValuesetLocation(2);
            } else if (oldValueSetBinding.getBindingLocation().equals("3")) {
              vb.addValuesetLocation(3);
            } else if (oldValueSetBinding.getBindingLocation().equals("4")) {
              vb.addValuesetLocation(4);
            } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4")) {
              vb.addValuesetLocation(1);
              vb.addValuesetLocation(4);
            } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4 or 10")) {
              vb.addValuesetLocation(1);
              vb.addValuesetLocation(4);
              vb.addValuesetLocation(10);
            }
            propertyValueSet.addValuesetBinding(vb);
          } else if (vsosc.getType().equals("code")) {
            SingleCodeBinding scb = (SingleCodeBinding) vsosc;
            ExternalSingleCode externalSingleCode = new ExternalSingleCode();
            externalSingleCode.setCodeSystem(scb.getCode().getCodeSystem());
            externalSingleCode.setValue(scb.getCode().getValue());
            propertySingleCode.setExternalSingleCode(externalSingleCode);
          }
        }

      }

      if (propertyValueSet.getValuesetBindings() != null
          && propertyValueSet.getValuesetBindings().size() > 0)
        item.addItemProperty(propertyValueSet);
      if (propertySingleCode.getExternalSingleCode() != null)
        item.addItemProperty(propertySingleCode);

      List<ConformanceStatement> csList = spc.getAttributes().getConformanceStatements();
      if (csList != null && csList.size() > 0) {
        for (ConformanceStatement oldCS : csList) {
          PropertyConformanceStatement propertyConformanceStatement =
              new PropertyConformanceStatement();
          propertyConformanceStatement.setAssertionScript(oldCS.getAssertion());
          propertyConformanceStatement.setConstraintId(oldCS.getConstraintId());
          propertyConformanceStatement.setDescription(oldCS.getDescription());
          item.addItemProperty(propertyConformanceStatement);
        }
      }

      Predicate oldPredicate = spc.getAttributes().getPredicate();
      if (oldPredicate != null) {
        if (oldPredicate.getContext().getType().equals("segment")) {
          ProfileComponentItem pitem = new ProfileComponentItem();
          pitem.setPath(convertedProfileComponent.getStructure());
          PropertyPredicate propertyPredicate = new PropertyPredicate();
          propertyPredicate.setAssertion(oldPredicate.getAssertion());
          propertyPredicate.setConstraintTarget(oldPredicate.getConstraintTarget());
          propertyPredicate.setDescription(oldPredicate.getDescription());
          propertyPredicate.setFalseUsage(ConversionUtil.convertUsage(oldPredicate.getTrueUsage()));
          propertyPredicate.setTrueUsage(ConversionUtil.convertUsage(oldPredicate.getFalseUsage()));
          pitem.addItemProperty(propertyPredicate);
          convertedProfileComponent.addProfileComponentItem(pitem);
        } else if (oldPredicate.getContext().getType().equals("message")) {
          ProfileComponentItem pitem = new ProfileComponentItem();
          pitem.setPath(
              convertedProfileComponent.getStructure() + "." + oldPredicate.getContext().getPath());
          PropertyPredicate propertyPredicate = new PropertyPredicate();
          propertyPredicate.setAssertion(oldPredicate.getAssertion());
          propertyPredicate.setConstraintTarget(oldPredicate.getConstraintTarget());
          propertyPredicate.setDescription(oldPredicate.getDescription());
          propertyPredicate.setFalseUsage(ConversionUtil.convertUsage(oldPredicate.getTrueUsage()));
          propertyPredicate.setTrueUsage(ConversionUtil.convertUsage(oldPredicate.getFalseUsage()));
          pitem.addItemProperty(propertyPredicate);
          convertedProfileComponent.addProfileComponentItem(pitem);
        }
      }
      convertedProfileComponent.addProfileComponentItem(item);

    }
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setScope(ConversionUtil.convertScope(oldProfileComponent.getScope()));
    PublicationInfo publicationInfo = new PublicationInfo();
    convertedProfileComponent.setComment(oldProfileComponent.getComment());
    convertedProfileComponent.setCreatedFrom(null);
    convertedProfileComponent.setDescription(oldProfileComponent.getDescription());
    convertedProfileComponent.setDomainInfo(domainInfo);
    convertedProfileComponent.setName(oldProfileComponent.getName());
    convertedProfileComponent.setPostDef(oldProfileComponent.getDefPostText());
    convertedProfileComponent.setPreDef(oldProfileComponent.getDefPreText());
    convertedProfileComponent.setPublicationInfo(publicationInfo);
    convertedProfileComponentService.save(convertedProfileComponent);
  }

  private void init() {
    // convertedProfileComponentService.removeCollection();
  }
}
