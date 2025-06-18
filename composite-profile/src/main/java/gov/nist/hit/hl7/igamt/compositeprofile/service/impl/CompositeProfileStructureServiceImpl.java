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
package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.compositeprofile.repository.CompositeProfileStructureRepository;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;


/**
 * 
 * Created by Jungyub Woo on Feb 20, 2018.
 */

@Service("compositeProfileStructureService")
public class CompositeProfileStructureServiceImpl implements CompositeProfileStructureService {
  @Autowired
  CompositeProfileStructureRepository compositeProfileStructureRepository;
  @Autowired
  ApplyChange applyChange;

  @Override
  public CompositeProfileStructure findById(String id) {
    return compositeProfileStructureRepository.findById(id).orElse(null);
  }

  @Override
  public CompositeProfileStructure create(CompositeProfileStructure compositeProfileStructure) {
    compositeProfileStructure.setId(null);
    return compositeProfileStructureRepository.save(compositeProfileStructure);
  }

  @Override
  public CompositeProfileStructure save(CompositeProfileStructure compositeProfileStructure) {
    return compositeProfileStructureRepository.save(compositeProfileStructure);
  }

  @Override
  public List<CompositeProfileStructure> findAll() {
    return compositeProfileStructureRepository.findAll();
  }

  @Override
  public void delete(CompositeProfileStructure compositeProfileStructure) {
    compositeProfileStructureRepository.delete(compositeProfileStructure);
  }

  @Override
  public void delete(String id) {
    compositeProfileStructureRepository.deleteById(id);
  }

  @Override
  public void removeCollection() {
    compositeProfileStructureRepository.deleteAll();

  }
  
  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService#findByIdIn(java.util.Set)
   */
  @Override
  public List<CompositeProfileStructure> findByIdIn(Set<String> ids) {
    // TODO Auto-generated method stub
    return compositeProfileStructureRepository.findByIdIn(ids);
  }

  
  @Override
  public void applyChanges(CompositeProfileStructure pc, List<ChangeItemDomain> cItems) throws ApplyChangeException {

    Map<PropertyType,ChangeItemDomain> singlePropertyMap = applyChange.convertToSingleChangeMap(cItems);
    this.applyMetaData(pc, singlePropertyMap);
    this.save(pc);
  }

  private void applyMetaData( CompositeProfileStructure cp, Map<PropertyType, ChangeItemDomain> singlePropertyMap) throws ApplyChangeException{

    applyChange.applyResourceChanges(cp, singlePropertyMap);
    ObjectMapper mapper = new ObjectMapper();

    if (singlePropertyMap.containsKey(PropertyType.NAME)) {
      singlePropertyMap.get(PropertyType.NAME).setOldPropertyValue(cp.getName());
      cp.setName((String) singlePropertyMap.get(PropertyType.NAME).getPropertyValue());
    }
    
    if (singlePropertyMap.containsKey(PropertyType.FLAVORSEXTENSION)) {
      singlePropertyMap.get(PropertyType.FLAVORSEXTENSION).setOldPropertyValue(cp.getName());
      cp.setFlavorsExtension((String) singlePropertyMap.get(PropertyType.FLAVORSEXTENSION).getPropertyValue());
    }
    if (singlePropertyMap.containsKey(PropertyType.PROFILEIDENTIFIER)) {
      try {
        String jsonInString = mapper.writeValueAsString(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).getPropertyValue());
        singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).setOldPropertyValue(cp.getPreCoordinatedMessageIdentifier());
        MessageProfileIdentifier profileIdentifier= mapper.readValue(jsonInString, MessageProfileIdentifier.class);
        cp.setPreCoordinatedMessageIdentifier(profileIdentifier);
      } catch (IOException e) {
        throw new ApplyChangeException(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER));
      }
    } 

  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService#saveAll(java.util.Set)
   */
  @Override
  public List<CompositeProfileStructure> saveAll(
      Set<CompositeProfileStructure> compositeProfileStructures) {
    return this.compositeProfileStructureRepository.saveAll(compositeProfileStructures);
  }
}
