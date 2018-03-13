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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.MessageRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.impl.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Group;
import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.ConformanceStatement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.Constraint;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.Predicate;

/**
 *
 * @author Maxence Lefort on Mar 12, 2018.
 */
public class ConformanceProfileConversionServiceImpl implements ConversionService {

  @Autowired
  private ConformanceProfileRepository conformanceProfileRepository = (ConformanceProfileRepository) context.getBean("conformanceProfileRepository");
  
  @Autowired
  private MessageRepository messageRepository = (MessageRepository) legacyContext.getBean("messageRepository");
  
  @Override
  public void convert() {
    List<Message> messages = messageRepository.findAll();
    for(Message message : messages) {
      if(message != null) {
        ConformanceProfile conformanceProfile = convertConformanceProfile(message);
        conformanceProfileRepository.save(conformanceProfile);
      }
    }
  }

  public ConformanceProfile convertConformanceProfile(Message message) {
    ConformanceProfile conformanceProfile = new ConformanceProfile();
    conformanceProfile.setId(new CompositeKey(message.getId()));
    Set<MsgStructElement> children = new HashSet<>();
    for(SegmentRefOrGroup segmentRefOrGroup : message.getChildren()) {
      children.add(this.convertSegmentRefOrGroup(segmentRefOrGroup));
    }
    conformanceProfile.setChildren(children);
    conformanceProfile.setComment(message.getComment());
    conformanceProfile.setCreatedFrom(message.getCreatedFrom());
    conformanceProfile.setDescription(message.getDescription());
    DomainInfo domainInfo = new DomainInfo();
    Set<String> compatibilityVersion = new HashSet<String>();
    compatibilityVersion.add(message.getHl7Version());
    domainInfo.setCompatibilityVersion(compatibilityVersion);
    domainInfo.setScope(ConversionUtil.convertScope(message.getScope()));
    domainInfo.setVersion(message.getVersion());
    conformanceProfile.setDomainInfo(domainInfo);
    conformanceProfile.setName(message.getName());
    conformanceProfile.setPostDef(message.getDefPostText());
    conformanceProfile.setPreDef(message.getDefPreText());
    PublicationInfo publicationInfo = new PublicationInfo();
    publicationInfo.setPublicationDate(ConversionUtil.convertPublicationDate(message.getPublicationDate()));
    publicationInfo.setPublicationVersion(message.getVersion());
    conformanceProfile.setPublicationInfo(publicationInfo);
    //TODO check with Woo
    Set<Constraint> constraints = new HashSet<>();
    for(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.ConformanceStatement oldConformanceStatement : message.getConformanceStatements()) {
      ConformanceStatement conformanceStatement = new ConformanceStatement();
      conformanceStatement.setIdentifier(oldConformanceStatement.getId());
      constraints.add(conformanceStatement);
    }
    for(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.Predicate oldPredicate : message.getPredicates()) {
      Predicate predicate = new Predicate();
      predicate.setFalseUsage(ConversionUtil.convertUsage(oldPredicate.getFalseUsage()));
      predicate.setTrueUsage(ConversionUtil.convertUsage(oldPredicate.getTrueUsage()));
      constraints.add(predicate);
    }
    conformanceProfile.setConstraints(constraints);
    //TODO add binding
    //conformanceProfile.setBinding(binding);
    //TODO set username
    //conformanceProfile.setUsername(username);    
    return conformanceProfile;
  }

  private MsgStructElement convertSegmentRefOrGroup(SegmentRefOrGroup segmentRefOrGroup) {
    MsgStructElement msgStructElement;
    if(segmentRefOrGroup instanceof gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group) {
      gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group oldGroup = (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group) segmentRefOrGroup;
      msgStructElement = new Group();
      ((Group)msgStructElement).setName(oldGroup.getName());
      Set<MsgStructElement> children = new HashSet<>();
      for(SegmentRefOrGroup groupSegmentRefOrGroup : oldGroup.getChildren()) {
        children.add(convertSegmentRefOrGroup(groupSegmentRefOrGroup));
      }
      ((Group)msgStructElement).setChildren(children);
      msgStructElement.setType(Type.GROUP);
    } else {
      msgStructElement = new SegmentRef();
      ((SegmentRef)msgStructElement).setRef(new Ref(((gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRef)segmentRefOrGroup).getRef().getId()));
      msgStructElement.setType(Type.SEGMENTREF);
    }
    if(msgStructElement != null) {
      msgStructElement.setCustom(segmentRefOrGroup.isAdded());
      msgStructElement.setId(segmentRefOrGroup.getId());
      msgStructElement.setMax(Integer.valueOf(segmentRefOrGroup.getMax()));
      msgStructElement.setMin(segmentRefOrGroup.getMin());
      msgStructElement.setPosition(segmentRefOrGroup.getPosition());
      msgStructElement.setText("");
      msgStructElement.setUsage(ConversionUtil.convertUsage(segmentRefOrGroup.getUsage()));
    }
    return msgStructElement;
  }
  
}
