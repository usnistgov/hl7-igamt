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
package gov.nist.hit.hl7.igamt.legacy.service.impl.datatype;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Component;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMComponentDefinition;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMConstraints;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DTMPredicate;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimePredicate.PredicateType;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.impl.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Type;

/**
 *
 * @author Maxence Lefort on Mar 5, 2018.
 */
public class DatatypeConversionServiceImpl implements ConversionService{

  @Autowired
  DatatypeRepository oldDatatypeRepository;
  
  @Autowired
  DatatypeService convertedDatatypeService;
  
  @Override
  public void convert() {
    List<Datatype> oldDatatypes = oldDatatypeRepository.findAll();
    for(Datatype oldDatatype : oldDatatypes) {
      gov.nist.hit.hl7.igamt.datatype.domain.Datatype convertedDatatype = this.convertDatatype(oldDatatype);
      convertedDatatypeService.create(convertedDatatype);
    }
    
  }
  
  private gov.nist.hit.hl7.igamt.datatype.domain.Datatype convertDatatype(Datatype oldDatatype){
    gov.nist.hit.hl7.igamt.datatype.domain.Datatype convertedDatatype;
    if(oldDatatype.getName().equals("DTM")) {
      convertedDatatype = new DateTimeDatatype();
      DTMConstraints dtmConstraints = oldDatatype.getDtmConstraints();
      if(dtmConstraints != null) {
        DateTimeConstraints dateTimeConstraints = this.convertDateTimeConstraints(dtmConstraints);
        ((DateTimeDatatype)convertedDatatype).setDateTimeConstraints(dateTimeConstraints);
      }
    } else if(oldDatatype.getComponents().size()>0) {
      convertedDatatype = new ComplexDatatype();
      HashSet<gov.nist.hit.hl7.igamt.shared.domain.Component> convertedComponents = new HashSet<>();
      for(Component component : oldDatatype.getComponents()) {
        gov.nist.hit.hl7.igamt.shared.domain.Component convertedComponent = new gov.nist.hit.hl7.igamt.shared.domain.Component();
        convertedComponent.setConfLength(component.getConfLength());
        convertedComponent.setCustom(false);
        convertedComponent.setMaxLength(component.getMaxLength());
        convertedComponent.setMinLength(component.getMinLength());
        convertedComponent.setPosition(component.getPosition());
        convertedComponent.setRef(new Ref(oldDatatype.getId()));
        convertedComponent.setText(component.getText());
        convertedComponent.setType(Type.COMPONENT);
        convertedComponent.setUsage(ConversionUtil.convertUsage(component.getUsage()));
        convertedComponents.add(convertedComponent);
      }
      ((ComplexDatatype)convertedDatatype).setComponents(convertedComponents);
    } else {
      convertedDatatype = new gov.nist.hit.hl7.igamt.datatype.domain.Datatype();
    }
    convertedDatatype.setId(new CompositeKey(oldDatatype.getId()));
    convertedDatatype.setCreatedFrom(oldDatatype.getCreatedFrom());
    convertedDatatype.setName(oldDatatype.getName());
    convertedDatatype.setDescription(oldDatatype.getDescription());
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setCompatibilityVersion(new HashSet<String>(oldDatatype.getHl7versions()));
    domainInfo.setScope(ConversionUtil.convertScope(oldDatatype.getScope()));
    domainInfo.setVersion(oldDatatype.getVersion());
    convertedDatatype.setDomainInfo(domainInfo);
    convertedDatatype.setExt(oldDatatype.getExt());
    convertedDatatype.setPostDef(oldDatatype.getDefPostText());
    convertedDatatype.setPreDef(oldDatatype.getDefPreText());
    PublicationInfo publicationInfo = new PublicationInfo();
    publicationInfo.setPublicationDate(ConversionUtil.convertPublicationDate(oldDatatype.getPublicationDate()));
    publicationInfo.setPublicationVersion(oldDatatype.getVersion());
    convertedDatatype.setPublicationInfo(publicationInfo);
    convertedDatatype.setPurposeAndUse(oldDatatype.getPurposeAndUse());
    convertedDatatype.setComment(oldDatatype.getComment());
    //TODO replace binding and set username
    convertedDatatype.setBinding(null);
    convertedDatatype.setUsername("");
    return convertedDatatype;
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
    //TODO change predicatetype
    return new DateTimePredicate(ConversionUtil.convertUsage(dtmPredicate.getTrueUsage()), ConversionUtil.convertUsage(dtmPredicate.getFalseUsage()), convertDateTimeComponentDefinition(dtmPredicate.getTarget()), PredicateType.PRESENCE, dtmPredicate.getValue());
  }

}
