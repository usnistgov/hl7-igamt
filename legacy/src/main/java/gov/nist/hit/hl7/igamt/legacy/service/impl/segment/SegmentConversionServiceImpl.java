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

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Field;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.BindingHandler;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.shared.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Type;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class SegmentConversionServiceImpl implements ConversionService {
  @Autowired
  private SegmentService convertedSegmentService =
      (SegmentService) context.getBean("segmentService");

  @Autowired
  private SegmentRepository oldSegmentRepository =
      (SegmentRepository) legacyContext.getBean("segmentRepository");

  @Autowired
  private DatatypeRepository oldDatatypeRepository =
      (DatatypeRepository) legacyContext.getBean("datatypeRepository");

  private AccountRepository accountRepository =
      (AccountRepository) userContext.getBean(AccountRepository.class);

  @Override
  public void convert() {
    init();
    List<Segment> oldSegments = oldSegmentRepository.findAll();
    for (Segment oldSegment : oldSegments) {
      gov.nist.hit.hl7.igamt.segment.domain.Segment convertedSegment =
          this.convertSegment(oldSegment);
      convertedSegmentService.save(convertedSegment);
    }
    List<gov.nist.hit.hl7.igamt.segment.domain.Segment> segments =
        convertedSegmentService.findAll();
    System.out.println(oldSegments.size() + " will be coverted!");
    System.out.println(segments.size() + " have be coverted!");
  }

  private gov.nist.hit.hl7.igamt.segment.domain.Segment convertSegment(Segment oldSegment) {
    gov.nist.hit.hl7.igamt.segment.domain.Segment convertedSegment =
        new gov.nist.hit.hl7.igamt.segment.domain.Segment();

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
    publicationInfo
        .setPublicationDate(ConversionUtil.convertPublicationDate(oldSegment.getPublicationDate()));
    publicationInfo.setPublicationVersion(oldSegment.getVersion());
    convertedSegment.setPublicationInfo(publicationInfo);
    convertedSegment.setComment(oldSegment.getComment());
    
    if(oldSegment.getName().equals("OBX") && oldSegment.getDynamicMappingDefinition().getDynamicMappingItems() != null && oldSegment.getDynamicMappingDefinition().getDynamicMappingItems().size() > 0){
      DynamicMappingInfo dynamicMappingInfo = new DynamicMappingInfo();
      dynamicMappingInfo.setReferencePath("2");
      dynamicMappingInfo.setVariesDatatypePath("5");
      
      for(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DynamicMappingItem oldDMItem : oldSegment.getDynamicMappingDefinition().getDynamicMappingItems()){
        DynamicMappingItem item = new DynamicMappingItem();
        item.setDatatypeId(oldDMItem.getDatatypeId());
        item.setValue(oldDMItem.getFirstReferenceValue());
        dynamicMappingInfo.addItem(item);
      }
      convertedSegment.setDynamicMappingInfo(dynamicMappingInfo);
      
    }

    if (oldSegment.getAccountId() != null) {
      Account acc = accountRepository.findByAccountId(oldSegment.getAccountId());
      if (acc.getAccountId() != null) {
        if (acc.getUsername() != null) {
          convertedSegment.setUsername(acc.getUsername());
        }
      }
    }
    
    if (oldSegment.getFields().size() > 0) {
      HashSet<gov.nist.hit.hl7.igamt.shared.domain.Field> convertedFields = new HashSet<>();
      for (Field f : oldSegment.getFields()) {
        gov.nist.hit.hl7.igamt.shared.domain.Field convertedField =
            new gov.nist.hit.hl7.igamt.shared.domain.Field();
        convertedField.setId(f.getId());
        convertedField.setName(f.getName());
        convertedField.setConfLength(f.getConfLength());
        convertedField.setCustom(false);
        if(f.getMin() != null) convertedField.setMin(f.getMin());
        if(f.getMax() != null) convertedField.setMax(f.getMax());
        convertedField.setMaxLength(f.getMaxLength());
        convertedField.setMinLength(f.getMinLength());
        convertedField.setPosition(f.getPosition());
        convertedField.setRef(new Ref(f.getDatatype().getId()));
        convertedField.setText(f.getText());
        convertedField.setType(Type.FIELD);
        convertedField.setUsage(ConversionUtil.convertUsage(f.getUsage()));
        convertedFields.add(convertedField);
      }
      convertedSegment.setChildren(convertedFields);
    }
    
    convertedSegment.setBinding(new BindingHandler(oldSegmentRepository, oldDatatypeRepository)
        .convertResourceBinding(oldSegment));
    return convertedSegment;
  }


  private void init() {
    convertedSegmentService.removeCollection();
  }

}
