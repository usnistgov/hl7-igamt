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
package gov.nist.hit.hl7.igamt.valueset.service.impl;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.util.compositeKey.CompositeKeyUtil;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeRef;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCode;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.CodeSysRef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.CodeSystemType;
import gov.nist.hit.hl7.igamt.valueset.domain.display.DisplayCode;
import gov.nist.hit.hl7.igamt.valueset.domain.display.DisplayCodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetMetadata;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPostDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPreDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetStructure;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("valuesetService")
public class ValuesetServiceImpl implements ValuesetService {

  @Autowired
  private ValuesetRepository valuesetRepository;
  
  @Autowired
  private CodeSystemService codeSystemService;
  
  @Autowired
  private MongoTemplate mongoTemplate;


  @Override
  public Valueset findById(CompositeKey id) {
    return valuesetRepository.findOne(id);
  }

  @Override
  public Valueset create(Valueset valueset) {
    valueset.setId(new CompositeKey());
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset createFromLegacy(Valueset valueset, String legacyId) {
    valueset.setId(new CompositeKey(legacyId));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset save(Valueset valueset) {
    valueset.setId(CompositeKeyUtil.updateVersion(valueset.getId()));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public List<Valueset> findAll() {
    return valuesetRepository.findAll();
  }

  @Override
  public void delete(Valueset valueset) {
    valuesetRepository.delete(valueset);
  }

  @Override
  public void delete(CompositeKey id) {
    valuesetRepository.delete(id);
  }

  @Override
  public void removeCollection() {
    valuesetRepository.deleteAll();
  }

  @Override
  public List<Valueset> findByDomainInfoVersion(String version) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoVersion(version);
  }

  @Override
  public List<Valueset> findByDomainInfoScope(String scope) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoScope(scope);
  }

  @Override
  public List<Valueset> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
  }

  @Override
  public List<Valueset> findByBindingIdentifier(String bindingIdentifier) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByBindingIdentifier(bindingIdentifier);
  }

  @Override
  public List<Valueset> findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(String scope,
      String version, String bindingIdentifier) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(scope,
        version, bindingIdentifier);
  }

  @Override
  public List<Valueset> findByDomainInfoVersionAndBindingIdentifier(String version,
      String bindingIdentifier) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoVersionAndBindingIdentifier(version,
        bindingIdentifier);
  }

  @Override
  public List<Valueset> findByDomainInfoScopeAndBindingIdentifier(String scope,
      String bindingIdentifier) {
    // TODO Auto-generated method stub
    return valuesetRepository.findByDomainInfoScopeAndBindingIdentifier(scope, bindingIdentifier);
  }

  @Override
  public Valueset findLatestById(String id) {
    Valueset valueset = valuesetRepository
        .findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version")).get(0);
    return valueset;
  }


  @Override
  public Valueset getLatestById(String id) {
    // TODO Auto-generated method stub Query query = new Query();
    Query query = new Query();

    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    Valueset valueset = mongoTemplate.findOne(query, Valueset.class);
    return valueset;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#findDisplayFormatByScopeAndVersion(java
   * .lang.String, java.lang.String)
   */
  @Override
  public List<Valueset> findDisplayFormatByScopeAndVersion(String scope, String version) {
    // TODO Auto-generated method stub



    Criteria where = Criteria.where("domainInfo.scope").is(scope);
    where.andOperator(Criteria.where("domainInfo.version").is(version));

    Aggregation agg = newAggregation(match(where), group("id.id").max("id.version").as("version"));

    // Convert the aggregation result into a List
    List<CompositeKey> groupResults =
        mongoTemplate.aggregate(agg, Valueset.class, CompositeKey.class).getMappedResults();

    Criteria where2 = Criteria.where("id").in(groupResults);
    Query qry = Query.query(where2);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("bindingIdentifier");
    List<Valueset> valueSets = mongoTemplate.find(qry, Valueset.class);



    return valueSets;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToMetadata(gov.nist.hit.hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public ValuesetMetadata convertDomainToMetadata(Valueset valueset) {
    if (valueset != null) {
      ValuesetMetadata result = new ValuesetMetadata();
      result.setAuthorNotes(valueset.getComment());
      result.setBindingIdentifier(valueset.getBindingIdentifier());
      result.setId(valueset.getId());
      result.setName(valueset.getName());
      result.setOid(valueset.getOid());
      result.setType(valueset.getSourceType());
      result.setUrl(valueset.getUrl());
      result.setScope(valueset.getDomainInfo().getScope());
      result.setVersion(valueset.getDomainInfo().getVersion());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToPredef(gov.nist.hit.hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public ValuesetPreDef convertDomainToPredef(Valueset valueset) {
    if (valueset != null) {
      ValuesetPreDef result = new ValuesetPreDef();
      result.setBindingIdentifier(valueset.getBindingIdentifier());
      result.setId(valueset.getId());
      result.setName(valueset.getName());
      result.setScope(valueset.getDomainInfo().getScope());
      result.setVersion(valueset.getDomainInfo().getVersion());
      result.setPreDef(valueset.getPreDef());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToPostdef(gov.nist.hit.hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public ValuesetPostDef convertDomainToPostdef(Valueset valueset) {
    if (valueset != null) {
      ValuesetPostDef result = new ValuesetPostDef();
      result.setBindingIdentifier(valueset.getBindingIdentifier());
      result.setId(valueset.getId());
      result.setName(valueset.getName());
      result.setScope(valueset.getDomainInfo().getScope());
      result.setVersion(valueset.getDomainInfo().getVersion());
      result.setPostDef(valueset.getPostDef());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToStructure(gov.nist.hit.hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public ValuesetStructure convertDomainToStructure(Valueset valueset) {
    if (valueset != null) {
      ValuesetStructure result = new ValuesetStructure();
      result.setBindingIdentifier(valueset.getBindingIdentifier());
      result.setId(valueset.getId());
      result.setName(valueset.getName());
      result.setScope(valueset.getDomainInfo().getScope());
      result.setVersion(valueset.getDomainInfo().getVersion());
      Set<DisplayCode> displayCodes = new HashSet<DisplayCode>();
      Set<DisplayCodeSystem> displayCodeSystems = new HashSet<DisplayCodeSystem>();
      
      if(valueset.getCodeRefs() != null){
        for(CodeRef codeRef:valueset.getCodeRefs()){
          CodeSysRef codeSysRef = new CodeSysRef();
          codeSysRef.setCodeSystemType(CodeSystemType.EXTERNAL);
          codeSysRef.setRef(codeRef.getCodeSystemId());
          
          DisplayCode dCode = new DisplayCode();
          dCode.setCodeSysRef(codeSysRef);
          dCode.setId(codeRef.getCodeId());
          
          CodeSystem codeSystem = codeSystemService.findLatestById(codeRef.getCodeSystemId());
          Code code = codeSystem.findCode(codeRef.getCodeId());
          
          if(code != null){
            dCode.setDescription(code.getDescription());
            dCode.setValue(code.getValue());
            displayCodes.add(dCode);            
          }
        }        
      }
      
      if(valueset.getCodes() != null){
        for(InternalCode iCode:valueset.getCodes()){
          CodeSysRef codeSysRef = new CodeSysRef();
          codeSysRef.setCodeSystemType(CodeSystemType.INTERNAL);
          codeSysRef.setRef(iCode.getCodeSystemId());
          DisplayCode dCode = new DisplayCode();
          dCode.setCodeSysRef(codeSysRef);
          dCode.setDescription(iCode.getDescription());
          dCode.setId(iCode.getId());
          dCode.setValue(iCode.getValue());
          displayCodes.add(dCode); 
        }
      }
      
      if(valueset.getCodeSystemIds() != null){
        for(String codeSystemId:valueset.getCodeSystemIds()){
          CodeSystem codeSystem = codeSystemService.findLatestById(codeSystemId);
          if(codeSystem != null){
            DisplayCodeSystem displayCodeSystem = new DisplayCodeSystem();
            displayCodeSystem.setCodeSysRef(codeSystemId);
            displayCodeSystem.setCodeSystemType(CodeSystemType.EXTERNAL);
            displayCodeSystem.setDescription(codeSystem.getDescription());
            displayCodeSystem.setIdentifier(codeSystem.getIdentifier());
            displayCodeSystem.setUrl(codeSystem.getUrl());
            displayCodeSystems.add(displayCodeSystem);
          }
        }
      }
      
      if(valueset.getInternalCodeSystems() != null){
        for(InternalCodeSystem iCodeSystem:valueset.getInternalCodeSystems()){
          DisplayCodeSystem displayCodeSystem = new DisplayCodeSystem();
          displayCodeSystem.setCodeSysRef(iCodeSystem.getIdentifier());
          displayCodeSystem.setCodeSystemType(CodeSystemType.INTERNAL);
          displayCodeSystem.setDescription(iCodeSystem.getDescription());
          displayCodeSystem.setIdentifier(iCodeSystem.getIdentifier());
          displayCodeSystem.setUrl(iCodeSystem.getUrl());
          displayCodeSystems.add(displayCodeSystem);
        }
      }
      
      result.setDisplayCodes(displayCodes);
      result.setDisplayCodeSystems(displayCodeSystems);
      result.setNumberOfCodes(displayCodes.size());
      
      return result;
    }
    return null;
  }
}
