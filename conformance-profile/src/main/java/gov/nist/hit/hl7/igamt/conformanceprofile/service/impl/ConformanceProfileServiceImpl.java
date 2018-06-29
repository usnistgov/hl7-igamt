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
package gov.nist.hit.hl7.igamt.conformanceprofile.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ChangedConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.MsgStructElementDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;


/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
@Service("conformanceProfileService")
public class ConformanceProfileServiceImpl implements ConformanceProfileService {

  @Autowired
  ConformanceProfileRepository conformanceProfileRepository;
  @Autowired
  private MongoTemplate mongoTemplate;

  @Override
  public ConformanceProfile findByKey(CompositeKey key) {
    return conformanceProfileRepository.findById(key).get();
  }

  @Override
  public ConformanceProfile create(ConformanceProfile conformanceProfile) {
    conformanceProfile.setId(new CompositeKey());
    return conformanceProfileRepository.save(conformanceProfile);
  }

  @Override
  public ConformanceProfile save(ConformanceProfile conformanceProfile) {
    // conformanceProfile.setId(CompositeKeyUtil.updateVersion(conformanceProfile.getId()));
    return conformanceProfileRepository.save(conformanceProfile);
  }

  @Override
  public List<ConformanceProfile> findAll() {
    return conformanceProfileRepository.findAll();
  }

  @Override
  public void delete(ConformanceProfile conformanceProfile) {
    conformanceProfileRepository.delete(conformanceProfile);
  }

  @Override
  public void delete(CompositeKey key) {
    conformanceProfileRepository.deleteById(key);
  }

  @Override
  public void removeCollection() {
    conformanceProfileRepository.deleteAll();

  }

  @Override
  public List<ConformanceProfile> findByIdentifier(String identifier) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByIdentifier(identifier);
  }

  @Override
  public List<ConformanceProfile> findByMessageType(String messageType) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByMessageType(messageType);
  }

  @Override
  public List<ConformanceProfile> findByEvent(String messageType) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByEvent(messageType);
  }

  @Override
  public List<ConformanceProfile> findByStructID(String messageType) {
    return conformanceProfileRepository.findByStructID(messageType);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoVersion(String version) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoVersion(version);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScope(String scope) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScope(scope);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope,
      String verion) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
  }

  @Override
  public List<ConformanceProfile> findByName(String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByName(name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope,
        version, name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoVersionAndName(String version, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoVersionAndName(version, name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndName(String scope, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndName(scope, name);
  }

  @Override
  public ConformanceProfile findLatestById(String id) {
    ConformanceProfile conformanceProfile = conformanceProfileRepository
        .findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version")).get(0);
    return conformanceProfile;
  }

  @Override
  public ConformanceProfileStructure convertDomainToStructure(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {

      ObjectMapper mapper = new ObjectMapper();
      try {
        String jsonInString = mapper.writeValueAsString(conformanceProfile);
        System.out.println(jsonInString);
      } catch (JsonProcessingException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }

      ConformanceProfileStructure result = new ConformanceProfileStructure();
      result.setBinding(conformanceProfile.getBinding());
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());

      for (MsgStructElement child : conformanceProfile.getChildren()) {
        if (child instanceof Group) {
          // System.out.println(child.getName());
        } else if (child instanceof SegmentRef) {
          // System.out.println(((SegmentRef) child).getRef().getId());
        }
        result.addStructure(this.convertMsgStructElement(child));
      }
      return result;
    }
    return null;
  }

  private MsgStructElementDisplay convertMsgStructElement(MsgStructElement msgStructElement) {
    if (msgStructElement != null) {
      MsgStructElementDisplay result = new MsgStructElementDisplay();
      result.setData(msgStructElement);
      if (msgStructElement instanceof Group) {
        Group g = (Group) msgStructElement;
        for (MsgStructElement child : g.getChildren()) {
          result.addChild(this.convertMsgStructElement(child));
        }
      }
      return result;
    }
    return null;
  }

  @Override
  public DisplayConformanceProfileMetadata convertDomainToMetadata(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfileMetadata result = new DisplayConformanceProfileMetadata();
      // result.setAuthorNotes(conformanceProfile.getAuthorNotes());
      result.setDescription(conformanceProfile.getDescription());
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      // result.setUsageNote(conformanceProfile.getUsageNotes());

      return result;
    }
    return null;
  }

  @Override
  public DisplayConformanceProfilePreDef convertDomainToPredef(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfilePreDef result = new DisplayConformanceProfilePreDef();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setPreDef(conformanceProfile.getPreDef());
      return result;
    }
    return null;
  }

  @Override
  public DisplayConformanceProfilePostDef convertDomainToPostdef(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfilePostDef result = new DisplayConformanceProfilePostDef();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setPostDef(conformanceProfile.getPostDef());
      return result;
    }
    return null;
  }

  @Override
  public ConformanceProfile saveConformanceProfile(
      ChangedConformanceProfile changedConformanceProfile) {
    if (changedConformanceProfile != null && changedConformanceProfile.getId() != null) {
      ConformanceProfile conformanceProfile =
          this.findLatestById(changedConformanceProfile.getId());

      if (conformanceProfile != null) {
        if (changedConformanceProfile.getMetadata() != null) {
          // conformanceProfile.setAuthorNotes(changedConformanceProfile.getMetadata().getAuthorNotes());
          conformanceProfile
              .setDescription(changedConformanceProfile.getMetadata().getDescription());
          conformanceProfile.setDomainInfo(changedConformanceProfile.getMetadata().getDomainInfo());
          conformanceProfile.setIdentifier(changedConformanceProfile.getMetadata().getIdentifier());
          conformanceProfile
              .setMessageType(changedConformanceProfile.getMetadata().getMessageType());
          conformanceProfile.setName(changedConformanceProfile.getMetadata().getName());
          conformanceProfile.setStructID(changedConformanceProfile.getMetadata().getStructId());
          // conformanceProfile.setUsageNotes(changedConformanceProfile.getMetadata().getUsageNote());
        }

        if (changedConformanceProfile.getPostDef() != null) {
          conformanceProfile.setPostDef(changedConformanceProfile.getPostDef().getPostDef());
        }

        if (changedConformanceProfile.getPreDef() != null) {
          conformanceProfile.setPreDef(changedConformanceProfile.getPreDef().getPreDef());
        }

        if (changedConformanceProfile.getStructure() != null) {
          conformanceProfile.setBinding(changedConformanceProfile.getStructure().getBinding());
          Set<MsgStructElement> msgStructElements = new HashSet<MsgStructElement>();
          // TODO need to visit MSGElements
          conformanceProfile.setChildren(msgStructElements);
        }
      }
      return this.save(conformanceProfile);
    }

    return null;
  }

  @Override
  public ConformanceProfile findDisplayFormat(CompositeKey id) {
    List<ConformanceProfile> cps = conformanceProfileRepository.findDisplayFormat(id);
    if (cps != null && !cps.isEmpty()) {
      return cps.get(0);
    }
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public ConformanceProfile getLatestById(String id) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    ConformanceProfile conformanceProfile = mongoTemplate.findOne(query, ConformanceProfile.class);
    return conformanceProfile;
  }

  @Override
  public ConformanceProfileConformanceStatement convertDomainToConformanceStatement(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      ConformanceProfileConformanceStatement result = new ConformanceProfileConformanceStatement();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setConformanceStatements(conformanceProfile.getBinding().getConformanceStatements());
      return result;
    }
    return null;
  }

}
