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
package gov.nist.hit.hl7.igamt.datatype.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;

/**
 *
 * @author Maxence Lefort on Mar 1, 2018.
 */

@Service("datatypeService")
public class DatatypeServiceImpl implements DatatypeService {

  @Autowired
  private DatatypeRepository datatypeRepository;

  @Override
  public Datatype findByKey(CompositeKey key) {
    return datatypeRepository.findOne(key);
  }

  @Override
  public Datatype create(Datatype datatype) {
    datatype.setId(new CompositeKey());
    datatype = datatypeRepository.save(datatype);
    return datatype;
  }

  @Override
  public Datatype save(Datatype datatype) {
    // datatype.setId(CompositeKeyUtil.updateVersion(datatype.getId()));
    datatype = datatypeRepository.save(datatype);
    return datatype;
  }

  @Override
  public List<Datatype> findAll() {
    return datatypeRepository.findAll();
  }

  @Override
  public void delete(Datatype datatype) {
    datatypeRepository.delete(datatype);
  }

  @Override
  public void delete(CompositeKey key) {
    datatypeRepository.delete(key);
  }

  @Override
  public void removeCollection() {
    datatypeRepository.deleteAll();
  }

  @Override
  public List<Datatype> findByDomainInfoVersion(String version) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoVersion(version);
  }

  @Override
  public List<Datatype> findByDomainInfoScope(String scope) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoScope(scope);
  }

  @Override
  public List<Datatype> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
  }

  @Override
  public List<Datatype> findByName(String name) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByName(name);
  }

  @Override
  public List<Datatype> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope, version,
        name);
  }

  @Override
  public List<Datatype> findByDomainInfoVersionAndName(String version, String name) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoVersionAndName(version, name);
  }

  @Override
  public List<Datatype> findByDomainInfoScopeAndName(String scope, String name) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByDomainInfoScopeAndName(scope, name);
  }

  @Override
  public Datatype findLatestById(String id) {
    Datatype datatype = datatypeRepository
        .findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version")).get(0);
    return datatype;
  }

  @Override
  public List<Datatype> findByScope(Scope scope) {
    return datatypeRepository.findByScope(scope);
  }

  @Override
  public DatatypeStructure convertDomainToStructure(Datatype datatype) {
    if (datatype != null) {
      DatatypeStructure result = new DatatypeStructure();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setBinding(datatype.getBinding());

      if (datatype instanceof ComplexDatatype) {
        ComplexDatatype cDt = (ComplexDatatype) datatype;
        if (cDt.getComponents() != null && cDt.getComponents().size() > 0) {
          for (Component c : cDt.getComponents()) {
            ComponentDisplay componentDisplay = new ComponentDisplay();
            componentDisplay.setData(c);
            result.addChild(componentDisplay);
          }
        }
      }
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToMetadata(gov.nist.hit.hl7.igamt.datatype.domain.Datatype)
   */
  @Override
  public DisplayMetadata convertDomainToMetadata(Datatype datatype) {
    if (datatype != null) {
      DisplayMetadata result = new DisplayMetadata();
      result.setAuthorNote(datatype.getComment());
      result.setDescription(datatype.getDescription());
      result.setExt(datatype.getExt());
      result.setId(datatype.getId());
      result.setName(datatype.getName());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToPredef(gov.nist.hit.hl7.igamt.datatype.domain.Datatype)
   */
  @Override
  public PreDef convertDomainToPredef(Datatype datatype) {
    if (datatype != null) {
      PreDef result = new PreDef();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setPreDef(datatype.getPreDef());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToPostdef(gov.nist.hit.hl7.igamt.datatype.domain.Datatype)
   */
  @Override
  public PostDef convertDomainToPostdef(Datatype datatype) {
    if (datatype != null) {
      PostDef result = new PostDef();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setPostDef(datatype.getPreDef());
      return result;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#saveDatatype(gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype)
   */
  @Override
  public Datatype saveDatatype(ChangedDatatype changedDatatype) {
    if(changedDatatype != null && changedDatatype.getId() != null){
      Datatype datatype = this.findLatestById(changedDatatype.getId());
      
      if(datatype != null){
        if(changedDatatype.getMetadata() != null){
          datatype.setDescription(changedDatatype.getMetadata().getDescription());
          datatype.setExt(changedDatatype.getMetadata().getExt());
          datatype.setName(changedDatatype.getMetadata().getName());
          datatype.setComment(changedDatatype.getMetadata().getAuthorNote());
          datatype.getDomainInfo().setScope(changedDatatype.getMetadata().getScope());
          datatype.getDomainInfo().setVersion(changedDatatype.getMetadata().getVersion());
        }
        
        if(changedDatatype.getPostDef() != null){
          datatype.setPostDef(changedDatatype.getPostDef().getPostDef());
        }
        
        if(changedDatatype.getPreDef() != null){
          datatype.setPreDef(changedDatatype.getPreDef().getPreDef());
        }
        
        if(changedDatatype.getStructure() != null){
          changedDatatype.getStructure().getChildren();
          datatype.setBinding(changedDatatype.getStructure().getBinding());
          Set<Component> components = new HashSet<Component>();
          for(ComponentDisplay cd : changedDatatype.getStructure().getChildren()){
            components.add(cd.getData());
          }
          if(components.size() > 0){
            ComplexDatatype cDatatype = (ComplexDatatype)datatype;
            cDatatype.setComponents(components);  
          }
        }
      }
      return this.save(datatype);   
    }
   
    return null;
  }
}
