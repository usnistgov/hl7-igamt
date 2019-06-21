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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
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
  public Valueset findById(String id) {
    return valuesetRepository.findById(id).orElse(null);
  }

  @Override
  public Valueset create(Valueset valueset) {
    valueset.setId(new String());
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset createFromLegacy(Valueset valueset, String legacyId) {
    valueset.setId(new String(legacyId));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset save(Valueset valueset) {
    // valueset.setId(StringUtil.updateVersion(valueset.getId()));
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
  public void delete(String id) {
    valuesetRepository.deleteById(id);
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
  public Valueset getLatestById(String id) {
    // TODO Auto-generated method stub Query query = new Query();
    Query query = new Query();

    query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
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
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("bindingIdentifier");
    List<Valueset> valueSets = mongoTemplate.find(qry, Valueset.class);



    return valueSets;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToMetadata(gov.nist.hit.
   * hl7.igamt.valueset.domain.Valueset)
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToPredef(gov.nist.hit.hl7.
   * igamt.valueset.domain.Valueset)
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToPostdef(gov.nist.hit.hl7
   * .igamt.valueset.domain.Valueset)
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertDomainToStructure(gov.nist.hit.
   * hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public ValuesetStructure convertDomainToStructure(Valueset valueset) {
    if (valueset != null) {
      ValuesetStructure result = new ValuesetStructure();
      result.setBindingIdentifier(valueset.getBindingIdentifier());
      result.setId(valueset.getId());
      result.setName(valueset.getName());
      result.setExtensibility(valueset.getExtensibility());
      result.setStability(valueset.getStability());
      result.setContentDefinition(valueset.getContentDefinition());
      Set<DisplayCode> displayCodes = new HashSet<DisplayCode>();
      Set<DisplayCodeSystem> displayCodeSystems = new HashSet<DisplayCodeSystem>();

      if (valueset.getCodeRefs() != null) {
        for (CodeRef codeRef : valueset.getCodeRefs()) {
          CodeSysRef codeSysRef = new CodeSysRef();
          codeSysRef.setCodeSystemType(CodeSystemType.EXTERNAL);
          codeSysRef.setRef(codeRef.getCodeSystemId());

          DisplayCode dCode = new DisplayCode();
          dCode.setCodeSysRef(codeSysRef);
          dCode.setId(codeRef.getCodeId());

          CodeSystem codeSystem = codeSystemService.findById(codeRef.getCodeSystemId());
          Code code = codeSystem.findCode(codeRef.getCodeId());

          if (code != null) {
            dCode.setDescription(code.getDescription());
            dCode.setValue(code.getValue());
            dCode.setUsage(codeRef.getUsage());
            dCode.setComments(code.getComments());
            displayCodes.add(dCode);
          }
        }
      }

      if (valueset.getCodes() != null) {
        for (InternalCode iCode : valueset.getCodes()) {
          CodeSysRef codeSysRef = new CodeSysRef();
          codeSysRef.setCodeSystemType(CodeSystemType.INTERNAL);
          codeSysRef.setRef(iCode.getCodeSystemId());
          DisplayCode dCode = new DisplayCode();
          dCode.setCodeSysRef(codeSysRef);
          dCode.setDescription(iCode.getDescription());
          dCode.setId(iCode.getId());
          dCode.setValue(iCode.getValue());
          dCode.setUsage(iCode.getUsage());
          dCode.setComments(iCode.getComments());
          displayCodes.add(dCode);
        }
      }

      if (valueset.getCodeSystemIds() != null) {
        for (String codeSystemId : valueset.getCodeSystemIds()) {
          CodeSystem codeSystem = codeSystemService.findById(codeSystemId);
          if (codeSystem != null) {
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

      if (valueset.getInternalCodeSystems() != null) {
        for (InternalCodeSystem iCodeSystem : valueset.getInternalCodeSystems()) {
          DisplayCodeSystem displayCodeSystem = new DisplayCodeSystem();
          displayCodeSystem.setCodeSysRef(iCodeSystem.getId());
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



  @Override
  public Set<DisplayCode> getCodeDisplay(Valueset valueset) {

    Set<DisplayCode> displayCodes = new HashSet<DisplayCode>();

    if (valueset.getCodeRefs() != null) {
      for (CodeRef codeRef : valueset.getCodeRefs()) {
        CodeSysRef codeSysRef = new CodeSysRef();
        codeSysRef.setCodeSystemType(CodeSystemType.EXTERNAL);
        codeSysRef.setRef(codeRef.getCodeSystemId());

        DisplayCode dCode = new DisplayCode();
        dCode.setCodeSysRef(codeSysRef);
        dCode.setId(codeRef.getCodeId());

        CodeSystem codeSystem = codeSystemService.findById(codeRef.getCodeSystemId());
        Code code = codeSystem.findCode(codeRef.getCodeId());

        if (code != null) {
          dCode.setDescription(code.getDescription());
          dCode.setValue(code.getValue());
          dCode.setUsage(codeRef.getUsage());
          dCode.setComments(code.getComments());
          displayCodes.add(dCode);
        }
      }
    }

    if (valueset.getCodes() != null) {
      for (InternalCode iCode : valueset.getCodes()) {
        CodeSysRef codeSysRef = new CodeSysRef();
        codeSysRef.setCodeSystemType(CodeSystemType.INTERNAL);
        codeSysRef.setRef(iCode.getCodeSystemId());
        DisplayCode dCode = new DisplayCode();
        dCode.setCodeSysRef(codeSysRef);
        dCode.setDescription(iCode.getDescription());
        dCode.setId(iCode.getId());
        dCode.setValue(iCode.getValue());
        dCode.setUsage(iCode.getUsage());
        dCode.setComments(iCode.getComments());
        displayCodes.add(dCode);
      }
    }

    return displayCodes;

  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#convertToValueset(gov.nist.hit.hl7.
   * igamt.valueset.domain.display.ValuesetStructure)
   */
  @Override
  public Valueset convertToValueset(ValuesetStructure structure) throws ValuesetNotFoundException {
    Valueset valueset = findById(structure.getId());
    if (valueset == null) {
      throw new ValuesetNotFoundException(structure.getId());
    }
    valueset.setExtensibility(structure.getExtensibility());
    valueset.setStability(structure.getStability());
    valueset.setContentDefinition(structure.getContentDefinition());
    Set<CodeRef> codeRefs = new HashSet<CodeRef>();
    Set<InternalCode> internalCodes = new HashSet<InternalCode>();
    Set<String> codeSystemIds = new HashSet<String>();
    Set<InternalCodeSystem> internalCodeSystems = new HashSet<InternalCodeSystem>();

    if (structure.getDisplayCodes() != null) {
      for (DisplayCode dCode : structure.getDisplayCodes()) {
        if (dCode.getCodeSysRef().getCodeSystemType().equals(CodeSystemType.EXTERNAL)) {
          CodeRef codeRef = new CodeRef();
          codeRef.setCodeId(dCode.getId());
          codeRef.setCodeSystemId(dCode.getCodeSysRef().getRef());
          codeRef.setUsage(dCode.getUsage());
          codeRefs.add(codeRef);
          if (!exist(codeRef.getCodeSystemId(), codeSystemIds))
            codeSystemIds.add(codeRef.getCodeSystemId());
        } else if (dCode.getCodeSysRef().getCodeSystemType().equals(CodeSystemType.INTERNAL)) {
          InternalCode internalCode = new InternalCode();
          internalCode.setCodeSystemId(dCode.getCodeSysRef().getRef());
          internalCode.setComments(dCode.getComments());
          internalCode.setDescription(dCode.getDescription());
          internalCode.setId(dCode.getId());
          internalCode.setUsage(dCode.getUsage());
          internalCode.setValue(dCode.getValue());
          internalCodes.add(internalCode);

          DisplayCodeSystem displayCodeSystem = this.findDisplayCodeSystem(
              dCode.getCodeSysRef().getRef(), structure.getDisplayCodeSystems());
          if (displayCodeSystem != null) {
            InternalCodeSystem internalCodeSystem = new InternalCodeSystem();
            internalCodeSystem.setDescription(displayCodeSystem.getDescription());
            internalCodeSystem.setIdentifier(displayCodeSystem.getIdentifier());
            internalCodeSystem.setUrl(displayCodeSystem.getUrl());
            internalCodeSystem.setId(displayCodeSystem.getCodeSysRef());
            if (!exist(internalCodeSystem, internalCodeSystems))
              internalCodeSystems.add(internalCodeSystem);
          }
        }
      }
    }
    valueset.setCodeRefs(codeRefs);
    valueset.setCodes(internalCodes);
    valueset.setCodeSystemIds(codeSystemIds);
    valueset.setInternalCodeSystems(internalCodeSystems);
    return save(valueset);
  }


  private boolean exist(String codeSystemId, Set<String> codeSystemIds) {
    for (String csId : codeSystemIds) {
      if (csId.equals(codeSystemId))
        return true;
    }
    return false;
  }

  private boolean exist(InternalCodeSystem internalCodeSystem,
      Set<InternalCodeSystem> internalCodeSystems) {
    for (InternalCodeSystem ics : internalCodeSystems) {
      if (ics.getIdentifier().equals(internalCodeSystem.getIdentifier()))
        return true;
    }
    return false;
  }

  private DisplayCodeSystem findDisplayCodeSystem(String ref,
      Set<DisplayCodeSystem> displayCodeSystems) {
    for (DisplayCodeSystem displayCodeSystem : displayCodeSystems) {
      if (displayCodeSystem.getCodeSysRef().equals(ref))
        return displayCodeSystem;
    }
    return null;
  }

  @Override
  public Valueset savePredef(ValuesetPreDef preDef) throws ValuesetNotFoundException {
    Valueset valueset = findById(preDef.getId());
    if (valueset == null) {
      throw new ValuesetNotFoundException(preDef.getId());
    }
    valueset.setPreDef(preDef.getPreDef());
    return save(valueset);
  }


  @Override
  public Valueset saveMetadata(ValuesetMetadata displayMetadata) throws ValuesetNotFoundException {
    Valueset valueset = findById(displayMetadata.getId());
    if (valueset == null) {
      throw new ValuesetNotFoundException(displayMetadata.getId());
    }
    valueset.setBindingIdentifier(displayMetadata.getBindingIdentifier());
    valueset.setName(displayMetadata.getName());
    valueset.setOid(displayMetadata.getOid());
    valueset.setUrl(displayMetadata.getUrl());
    valueset.setComment(displayMetadata.getAuthorNotes());
    return save(valueset);
  }

  @Override
  public Valueset savePostdef(ValuesetPostDef postDef) throws ValuesetNotFoundException {
    Valueset valueset = findById(postDef.getId());
    if (valueset == null) {
      throw new ValuesetNotFoundException(postDef.getId());
    }
    valueset.setPostDef(postDef.getPostDef());
    return save(valueset);
  }

  @Override
  public Link cloneValueSet(String newkey, Link l, String username, Scope scope) {
    Valueset old = this.findById(l.getId());
    Valueset elm = old.clone();
    elm.getDomainInfo().setScope(scope);
    elm.setOrigin(elm.getFrom());
    Link newLink = new Link();
    newLink = l.clone(newkey);
    newLink.setDomainInfo(elm.getDomainInfo());
    elm.setId(newkey);
    elm.setUsername(username);
    this.save(elm);
    return newLink;
  }

@Override
public List<Valueset> findByIdIn(Set<String> ids) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByIdIn(ids);
}

@Override
public List<Valueset> findDisplayFormatByIds(Set<String> ids) {
	// TODO Auto-generated method stub
	return null;
}
}
