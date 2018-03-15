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
package gov.nist.hit.hl7.igamt.legacy.service.impl.segment;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMComponentDefinition;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMConstraints;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMPredicate;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate.PredicateType;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.BindingHandler;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class SegmentConversionServiceImpl implements ConversionService{
  @Autowired
  private SegmentService convertedSegmentService = (SegmentService) context.getBean("segmentService");
  
  @Autowired
  private SegmentRepository oldSegmentRepository = (SegmentRepository) legacyContext.getBean("segmentRepository");
  
  @Autowired
  private DatatypeRepository oldDatatypeRepository = (DatatypeRepository) legacyContext.getBean("datatypeRepository");
  


  
  @Override
  public void convert() {
    init();
    List<Segment> oldSegments = oldSegmentRepository.findAll();
    for(Segment oldSegment : oldSegments) {
      gov.nist.hit.hl7.igamt.segment.domain.Segment convertedSegment = this.convertSegment(oldSegment);
      convertedSegmentService.save(convertedSegment);
    }
    List<gov.nist.hit.hl7.igamt.segment.domain.Segment> segments = convertedSegmentService.findAll();
    System.out.println(oldSegments.size() + " will be coverted!");
    System.out.println(segments.size() + " have be coverted!");
  }
  
  private gov.nist.hit.hl7.igamt.segment.domain.Segment convertSegment(Segment oldSegment){
    gov.nist.hit.hl7.igamt.segment.domain.Segment convertedSegment = new gov.nist.hit.hl7.igamt.segment.domain.Segment();

    convertedSegment.setId(new CompositeKey(oldSegment.getId()));
    convertedSegment.setCreatedFrom(oldSegment.getCreatedFrom());
    convertedSegment.setName(oldSegment.getName());
    convertedSegment.setDescription(oldSegment.getDescription());
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setScope(ConversionUtil.convertScope(oldSegment.getScope()));
    domainInfo.setVersion(oldSegment.getVersion());
    convertedSegment.setDomainInfo(domainInfo);
    convertedSegment.setExt(oldSegment.getExt());
    convertedSegment.setPostDef(oldSegment.getText2());
    convertedSegment.setPreDef(oldSegment.getText1());
    PublicationInfo publicationInfo = new PublicationInfo();
    publicationInfo.setPublicationDate(ConversionUtil.convertPublicationDate(oldSegment.getPublicationDate()));
    publicationInfo.setPublicationVersion(oldSegment.getVersion());
    convertedSegment.setPublicationInfo(publicationInfo);
    convertedSegment.setComment(oldSegment.getComment());
    //TODO replace binding and set username
    
    convertedSegment.setBinding(new BindingHandler(oldSegmentRepository, oldDatatypeRepository).convertBindingForSegment(oldSegment));
    convertedSegment.setUsername("");
    return convertedSegment;
  }
  
  protected DateTimeConstraints convertDateTimeConstraints(DTMConstraints dtmConstraints) {
    if(dtmConstraints != null) {
      DateTimeConstraints dateTimeConstraints = new DateTimeConstraints();
      List<DateTimeComponentDefinition> dateTimeComponentDefinitions =
          new ArrayList<>();
      for(DTMComponentDefinition dtmComponentDefinition : dtmConstraints.getDtmComponentDefinitions()) {
        DateTimeComponentDefinition dateTimeComponentDefinition = this.convertDateTimeComponentDefinition(dtmComponentDefinition);
        if(dateTimeComponentDefinition != null) {
          dateTimeComponentDefinitions.add(dateTimeComponentDefinition);
        }
      }
      dateTimeConstraints.setDateTimeComponentDefinitions(dateTimeComponentDefinitions);
      return dateTimeConstraints;
    }
    return null;
  }
  
  protected DateTimeComponentDefinition convertDateTimeComponentDefinition(DTMComponentDefinition dtmComponentDefinition) {
    DTMPredicate dtmPredicate = dtmComponentDefinition.getDtmPredicate();
    DateTimeComponentDefinition dateTimeComponentDefinition = new DateTimeComponentDefinition(dtmComponentDefinition.getPosition().intValue(), dtmComponentDefinition.getName(), dtmComponentDefinition.getDescription(), ConversionUtil.convertUsage(dtmComponentDefinition.getUsage()), convertDateTimePredicate(dtmPredicate));
    return dateTimeComponentDefinition;
  }
  
  protected DateTimePredicate convertDateTimePredicate(DTMPredicate dtmPredicate) {
    if(dtmPredicate != null){
      return new DateTimePredicate(ConversionUtil.convertUsage(dtmPredicate.getTrueUsage()), ConversionUtil.convertUsage(dtmPredicate.getFalseUsage()), convertDateTimeComponentDefinition(dtmPredicate.getTarget()), PredicateType.PRESENCE, dtmPredicate.getValue());
      
    }
    return null;
  }
  
  private void init() {
    convertedSegmentService.removeCollection();
  }

}
