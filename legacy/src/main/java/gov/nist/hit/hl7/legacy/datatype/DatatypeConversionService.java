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
package gov.nist.hit.hl7.legacy.datatype;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

/**
 *
 * @author Maxence Lefort on Mar 5, 2018.
 */
public class DatatypeConversionService extends ConversionService{

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
    gov.nist.hit.hl7.igamt.datatype.domain.Datatype convertedDatatype = new gov.nist.hit.hl7.igamt.datatype.domain.Datatype();
    convertedDatatype.setId(new CompositeKey(oldDatatype.getId()));
    convertedDatatype.setCreatedFrom(oldDatatype.getCreatedFrom());
    convertedDatatype.setName(oldDatatype.getName());
    convertedDatatype.setDescription(oldDatatype.getDescription());
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setCompatibilityVersion(new HashSet<String>(oldDatatype.getHl7versions()));
    domainInfo.setScope(this.convertScope(oldDatatype.getScope()));
    domainInfo.setVersion(oldDatatype.getVersion());
    convertedDatatype.setDomainInfo(domainInfo);
    convertedDatatype.setExt(oldDatatype.getExt());
    convertedDatatype.setPostDef(oldDatatype.getDefPostText());
    convertedDatatype.setPreDef(oldDatatype.getDefPreText());
    PublicationInfo publicationInfo = new PublicationInfo();
    try {
      publicationInfo.setPublicationDate(oldDatatype.getPublicationDate() != null ? new SimpleDateFormat("yyyy/MMM/dd HH:mm:ss").parse(oldDatatype.getPublicationDate()) : null);
    } catch (ParseException e) {
      e.printStackTrace();
    } finally {
      publicationInfo.setPublicationDate(null);
    }
    publicationInfo.setPublicationVersion(oldDatatype.getVersion());
    convertedDatatype.setPublicationInfo(publicationInfo);
    convertedDatatype.setPurposeAndUse(oldDatatype.getPurposeAndUse());
    //TODO check those
    convertedDatatype.setComment(oldDatatype.getComment());
    convertedDatatype.setBinding(null);
    convertedDatatype.setUsername("");
    return convertedDatatype;
  }

}
