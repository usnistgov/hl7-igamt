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
package gov.nist.hit.hl7.igamt.legacy.service.impl.conformanceprofile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMComponentDefinition;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMConstraints;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMPredicate;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRef;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate.PredicateType;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.MessageRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.BindingHandler;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Type;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class ConformanceProfileConversionServiceImpl implements ConversionService {

  @Autowired
  private MessageRepository oldMessageRepository =
      (MessageRepository) legacyContext.getBean("messageRepository");

  @Autowired
  private SegmentRepository oldSegmentRepository =
      (SegmentRepository) legacyContext.getBean("segmentRepository");

  @Autowired
  private DatatypeRepository oldDatatypeRepository =
      (DatatypeRepository) legacyContext.getBean("datatypeRepository");

  @Autowired
  private ConformanceProfileService convertedConformanceProfileService =
      (ConformanceProfileService) context.getBean("conformanceProfileService");
  
  private AccountRepository accountRepository =
      userContext.getBean(AccountRepository.class);

  @Override
  public void convert() {
    init();
    List<Message> oldMessages = oldMessageRepository.findAll();
    for (Message oldMessage : oldMessages) {
      ConformanceProfile convertedConformanceProfile = this.convertConformanceProfile(oldMessage);
      convertedConformanceProfileService.save(convertedConformanceProfile);
    }
    List<ConformanceProfile> conformanceProfiles = convertedConformanceProfileService.findAll();
    System.out.println(oldMessages.size() + " will be coverted!");
    System.out.println(conformanceProfiles.size() + " have be coverted!");
  }

  private ConformanceProfile convertConformanceProfile(Message oldMessage) {
    ConformanceProfile convertedConformanceProfile = new ConformanceProfile();

    for (SegmentRefOrGroup seog : oldMessage.getChildren()) {
      if (seog instanceof SegmentRef) {
        constructSegmentRef(convertedConformanceProfile.getChildren(), (SegmentRef) seog);
      } else if (seog instanceof Group) {
        constructSegmentGroup(convertedConformanceProfile.getChildren(), (Group) seog);
      }
    }

    convertedConformanceProfile.setId(new CompositeKey(oldMessage.getId()));
    convertedConformanceProfile.setCreatedFrom(oldMessage.getCreatedFrom());
    convertedConformanceProfile.setName(oldMessage.getName());
    convertedConformanceProfile.setStructID(oldMessage.getStructID());
    convertedConformanceProfile.setEvent(oldMessage.getEvent());
    convertedConformanceProfile.setMessageType(oldMessage.getMessageType());
    convertedConformanceProfile.setDescription(oldMessage.getDescription());
    DomainInfo domainInfo = new DomainInfo();
    // TODO need compatibilityVersion for message?
    // domainInfo.setCompatibilityVersion(new HashSet<String>(oldMessage.getHl7Version()));
    domainInfo.setScope(ConversionUtil.convertScope(oldMessage.getScope()));
    domainInfo.setVersion(oldMessage.getHl7Version());
    convertedConformanceProfile.setDomainInfo(domainInfo);
    convertedConformanceProfile.setIdentifier(oldMessage.getIdentifier());
    convertedConformanceProfile.setPostDef(oldMessage.getDefPostText());
    convertedConformanceProfile.setPreDef(oldMessage.getDefPreText());
    PublicationInfo publicationInfo = new PublicationInfo();
    try {
      publicationInfo.setPublicationDate(oldMessage.getPublicationDate() != null
          ? new SimpleDateFormat("yyyy/MMM/dd HH:mm:ss").parse(oldMessage.getPublicationDate())
          : null);
    } catch (ParseException e) {
      e.printStackTrace();
    } finally {
      publicationInfo.setPublicationDate(null);
    }
    // TODO why is it int?
    publicationInfo.setPublicationVersion(oldMessage.getPublicationVersion() + "");
    convertedConformanceProfile.setPublicationInfo(publicationInfo);
    convertedConformanceProfile.setComment(oldMessage.getComment());
    // TODO replace binding and set username
    convertedConformanceProfile
        .setBinding(new BindingHandler(oldSegmentRepository, oldDatatypeRepository)
            .convertResourceBinding(oldMessage));
    if (oldMessage.getAccountId() != null) {
      Account acc = accountRepository.findByAccountId(oldMessage.getAccountId());
      if (acc.getAccountId() != null) {
        if (acc.getUsername() != null) {
          convertedConformanceProfile.setUsername(acc.getUsername());
        }
      }
    }
    return convertedConformanceProfile;
  }

  /**
   * @param children
   * @param seog
   */
  private void constructSegmentGroup(Set<MsgStructElement> children, Group g) {
    gov.nist.hit.hl7.igamt.shared.domain.Group newGroup =
        new gov.nist.hit.hl7.igamt.shared.domain.Group();

    if (g.getAdded().equals(Constant.YES)) {
      newGroup.setCustom(true);
    } else {
      newGroup.setCustom(false);
    }
    newGroup.setId(g.getId());
    newGroup.setMax(g.getMax());
    newGroup.setMin(g.getMin());
    newGroup.setName(g.getName());
    newGroup.setPosition(g.getPosition());
    // Text???
    newGroup.setText(g.getAuthorNotes());
    newGroup.setType(Type.GROUP);
    newGroup.setUsage(ConversionUtil.convertUsage(g.getUsage()));

    for (SegmentRefOrGroup seog : g.getChildren()) {
      if (seog instanceof SegmentRef) {
        constructSegmentRef(newGroup.getChildren(), (SegmentRef) seog);
      } else if (seog instanceof Group) {
        constructSegmentGroup(newGroup.getChildren(), (Group) seog);
      }
    }

    newGroup.setBinding(
        new BindingHandler(oldSegmentRepository, oldDatatypeRepository).convertResourceBinding(g));

    children.add(newGroup);

  }

  /**
   * @param children
   * @param seog
   */
  private void constructSegmentRef(Set<MsgStructElement> children, SegmentRef sr) {
    gov.nist.hit.hl7.igamt.shared.domain.SegmentRef newSegmentRef =
        new gov.nist.hit.hl7.igamt.shared.domain.SegmentRef();

    if (sr.getAdded().equals(Constant.YES)) {
      newSegmentRef.setCustom(true);
    } else {
      newSegmentRef.setCustom(false);
    }
    newSegmentRef.setId(sr.getId());
    newSegmentRef.setMax(sr.getMax());
    newSegmentRef.setMin(sr.getMin());
    newSegmentRef.setPosition(sr.getPosition());
    Ref ref = new Ref();
    ref.setId(sr.getRef().getId());
    newSegmentRef.setRef(ref);
    // Text???
    newSegmentRef.setText(sr.getAuthorNotes());
    newSegmentRef.setType(Type.SEGMENTREF);
    newSegmentRef.setUsage(ConversionUtil.convertUsage(sr.getUsage()));

    children.add(newSegmentRef);
  }

  protected DateTimeConstraints convertDateTimeConstraints(DTMConstraints dtmConstraints) {
    if (dtmConstraints != null) {
      DateTimeConstraints dateTimeConstraints = new DateTimeConstraints();
      List<DateTimeComponentDefinition> dateTimeComponentDefinitions = new ArrayList<>();
      for (DTMComponentDefinition dtmComponentDefinition : dtmConstraints
          .getDtmComponentDefinitions()) {
        DateTimeComponentDefinition dateTimeComponentDefinition =
            this.convertDateTimeComponentDefinition(dtmComponentDefinition);
        if (dateTimeComponentDefinition != null) {
          dateTimeComponentDefinitions.add(dateTimeComponentDefinition);
        }
      }
      dateTimeConstraints.setDateTimeComponentDefinitions(dateTimeComponentDefinitions);
      return dateTimeConstraints;
    }
    return null;
  }

  protected DateTimeComponentDefinition convertDateTimeComponentDefinition(
      DTMComponentDefinition dtmComponentDefinition) {
    DTMPredicate dtmPredicate = dtmComponentDefinition.getDtmPredicate();
    DateTimeComponentDefinition dateTimeComponentDefinition =
        new DateTimeComponentDefinition(dtmComponentDefinition.getPosition().intValue(),
            dtmComponentDefinition.getName(), dtmComponentDefinition.getDescription(),
            ConversionUtil.convertUsage(dtmComponentDefinition.getUsage()),
            convertDateTimePredicate(dtmPredicate));
    return dateTimeComponentDefinition;
  }

  protected DateTimePredicate convertDateTimePredicate(DTMPredicate dtmPredicate) {
    if (dtmPredicate != null) {
      return new DateTimePredicate(ConversionUtil.convertUsage(dtmPredicate.getTrueUsage()),
          ConversionUtil.convertUsage(dtmPredicate.getFalseUsage()),
          convertDateTimeComponentDefinition(dtmPredicate.getTarget()), PredicateType.PRESENCE,
          dtmPredicate.getValue());

    }
    return null;
  }

  private void init() {
    convertedConformanceProfileService.removeCollection();
  }

}
