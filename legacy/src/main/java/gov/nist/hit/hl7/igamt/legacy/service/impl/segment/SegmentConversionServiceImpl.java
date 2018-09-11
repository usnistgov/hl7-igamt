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
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Field;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.BindingHandler;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;


/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class SegmentConversionServiceImpl implements ConversionService {
  @Autowired
  private SegmentRepository convertedSegmentService = context.getBean(SegmentRepository.class);

  @Autowired
  private gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository oldSegmentRepository =
      (gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository) legacyContext
          .getBean("segmentRepository");

  @Autowired
  private DatatypeRepository oldDatatypeRepository =
      (DatatypeRepository) legacyContext.getBean("datatypeRepository");

  private AccountRepository accountRepository = userContext.getBean(AccountRepository.class);

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
    domainInfo.setVersion(oldSegment.getHl7Version());
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

    if (oldSegment.getName().equals("OBX")) {
      DynamicMappingInfo dynamicMappingInfo = new DynamicMappingInfo();
      
      if(oldSegment.getDynamicMappingDefinition().getDynamicMappingItems() != null && oldSegment.getDynamicMappingDefinition().getDynamicMappingItems().size() > 0){
        for (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DynamicMappingItem oldDMItem : oldSegment.getDynamicMappingDefinition().getDynamicMappingItems()) {
          DynamicMappingItem item = new DynamicMappingItem();
          item.setDatatypeId(oldDMItem.getDatatypeId());
          item.setValue(oldDMItem.getFirstReferenceValue());
          dynamicMappingInfo.addItem(item);
        }        
      }
      
      convertedSegment.setDynamicMappingInfo(dynamicMappingInfo);
    }

    if (oldSegment.getAccountId() != null) {
      Account acc = accountRepository.findByAccountId(oldSegment.getAccountId());
      if (acc != null && acc.getAccountId() != null) {
        if (acc.getUsername() != null) {
          convertedSegment.setUsername(acc.getUsername());
        }
      }
    }


    if (oldSegment.getFields().size() > 0) {
      Set<gov.nist.hit.hl7.igamt.segment.domain.Field> fields = new HashSet<>();
      for (Field field : oldSegment.getFields()) {
        gov.nist.hit.hl7.igamt.segment.domain.Field newField =
            new gov.nist.hit.hl7.igamt.segment.domain.Field();
        newField.setConfLength(field.getConfLength());

        if (field.getAdded().equals(Constant.YES)) {
          newField.setCustom(true);
        } else {
          newField.setCustom(false);
        }
        newField.setId(field.getId());
        newField.setMax(field.getMax());
        newField.setMaxLength(field.getMaxLength());
        if (field.getMin() != null)
          newField.setMin(field.getMin());
        newField.setMinLength(field.getMinLength());
        newField.setName(field.getName());
        newField.setPosition(field.getPosition());
        newField.setRef(new Ref(field.getDatatype().getId()));
        newField.setText(field.getText());
        newField.setType(Type.FIELD);
        newField.setUsage(ConversionUtil.convertUsage(field.getUsage()));
        fields.add(newField);
        
        if(oldSegment.getName().equals("OBX")){
          if(newField.getPosition() == 2){
            convertedSegment.getDynamicMappingInfo().setReferenceFieldId(newField.getId());
          }else if(newField.getPosition() == 5){
            convertedSegment.getDynamicMappingInfo().setVariesFieldId(newField.getId());
          }
        }
      }
      convertedSegment.setChildren(fields);
    }

    convertedSegment.setBinding(new BindingHandler(oldSegmentRepository, oldDatatypeRepository)
        .convertResourceBinding(oldSegment));
    return convertedSegment;
  }


  private void init() {
    // convertedSegmentService.removeCollection();
  }

}
