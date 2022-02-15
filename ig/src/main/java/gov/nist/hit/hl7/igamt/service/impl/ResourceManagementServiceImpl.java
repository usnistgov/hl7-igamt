/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.service.impl;

import static org.hamcrest.CoreMatchers.instanceOf;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

import gov.nist.hit.hl7.igamt.ig.service.ResourceHelper;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ResourceManagementServiceImpl implements ResourceManagementService {
  
  @Autowired
  ResourceHelper resourceHelper;
  
  @Autowired
  ApplyClone applyClone;
  
  @Autowired
  FhirHandlerService fhirHandlerService;
  
  @Override
  public <T extends Resource> T createFlavor(Registry reg, String username, DocumentInfo documentInfo, Type resourceType, AddingInfo selected) throws EntityNotFound {

      T resource = this.getFlavor(username, documentInfo, resourceType, selected);
      resource = this.resourceHelper.saveByType(resource, resourceType);
      Link link = resourceHelper.generateLink(resource, documentInfo, reg.getChildren().size()+1);
      reg.getChildren().add(link);
      this.applyFlavorInfo(resource, selected);   
      return resource;
  }
  
  @Override
  public <T extends Resource> T getFlavor(String username, DocumentInfo documentInfo, Type resourceType, AddingInfo selected) throws EntityNotFound {

      T resource = this.resourceHelper.getResourceByType(selected.getOriginalId(), resourceType); 
      applyClone.updateResourceAttributes(resource, this.resourceHelper.generateAbstractDomainId(), username, documentInfo);
      this.applyFlavorInfo(resource, selected);   
      return resource;
  }
  
  
 
  
  /**
   * @param resource
   * @param addingInfo
   */
  private void applyFlavorInfo(Resource resource, AddingInfo addingInfo) {

    if(resource instanceof Datatype ) {
      ((Datatype) resource).setExt(addingInfo.getExt());
      if(resource.getDomainInfo().getScope().equals(Scope.SDTF)) {
        ((Datatype) resource).setFixedExtension(((Datatype) resource).getExt());
      }
    }else if(resource instanceof Segment ) {
      ((Segment) resource).setExt(addingInfo.getExt());
    }else if(resource instanceof Valueset) {
      this.applyValueSetFlavorInfo(((Valueset) resource), addingInfo);
    }else if( resource instanceof CompositeProfileStructure) {
      ((CompositeProfileStructure)resource).setName(addingInfo.getExt());
    }else if (resource instanceof ProfileComponent) {
      ((Segment) resource).setExt(addingInfo.getExt());
    }else if (resource instanceof ConformanceProfile) {
      ((ConformanceProfile)resource).setName(addingInfo.getExt());
    }
    resource.getDomainInfo().setScope(Scope.USER);

  }

// TODDOO review requirment
  private void applyValueSetFlavorInfo(Valueset valueset, AddingInfo addingInfo) {
    valueset.setBindingIdentifier(addingInfo.getExt());
    if(valueset.getBindingIdentifier().equals("HL70396") && valueset.getSourceType().equals(SourceType.EXTERNAL)) {
      valueset.setSourceType(SourceType.INTERNAL);
      valueset.setOrigin(valueset.getId());
      Set<Code> vsCodes = fhirHandlerService.getValusetCodeForDynamicTable();
      valueset.setCodes(vsCodes);
      
    }

  }



}
