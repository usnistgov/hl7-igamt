package gov.nist.hit.hl7.resource.change.service.impl;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;

@Service
public class ApplyCloneImpl implements ApplyClone {

	@Override
  public void updateResourceAttributes(Resource resource, String id, String username, DocumentInfo info) {
	this.updateAbstractDomainAttributes(resource, id, username);  
    resource.setDocumentInfo(info);
  }
	@Override
  public void updateAbstractDomainAttributes(AbstractDomain resource, String id, String username ) {
	  
	    resource.setUsername(username);
	    resource.setUpdateDate(new Date());
	    resource.setCreationDate(new Date());
	    resource.setActiveInfo(new ActiveInfo());
	    resource.setPublicationInfo(new PublicationInfo() );
	    resource.setCreatedFrom(resource.getId());
	    resource.setStatus(null);
	    resource.setFrom(resource.getId());
	    resource.setVersion(null);
	    resource.setSharedUsers(new ArrayList<String>());
	    resource.getSharedUsers().add(username);// TODO Move to document level
	    resource.setCurrentAuthor(username); // TODO Move to document level
	    resource.setId(id);
	    
	  }
  
}