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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.display.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItem;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeValidationException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("datatypeService")
public class DatatypeServiceImpl implements DatatypeService {

  @Autowired
  private DatatypeRepository datatypeRepository;

  @Autowired
  CommonService commonService;
  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  private ConformanceStatementRepository conformanceStatementRepository;
  
  @Autowired
  private PredicateRepository predicateRepository;

  @Override
  public Datatype findById(String key) {
    return datatypeRepository.findById(key).orElse(null);
  }

  @Override
  public Datatype create(Datatype datatype) {
    datatype.setId(new String());
    datatype = datatypeRepository.save(datatype);
    return datatype;
  }

  @Override
  public Datatype save(Datatype datatype) {
    // datatype.setId(StringUtil.updateVersion(datatype.getId()));
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
  public void delete(String key) {
    datatypeRepository.deleteById(key);
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
  public List<Datatype> findByScope(Scope scope) {
    return datatypeRepository.findByScope(scope);
  }

  @Override
  public List<Datatype> findByScopeAndVersion(String scope, String hl7Version) {

    Criteria where = Criteria.where("domainInfo.scope").is(scope);
    where.andOperator(Criteria.where("domainInfo.version").is(hl7Version));

    Query qry = Query.query(where);
    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
    return datatypes;

  }


  @Override
  public List<Datatype> findByNameAndVersionAndScope(String name, String version, String scope) {
    Criteria where =
        Criteria.where("name").is(name).andOperator(Criteria.where("domainInfo.version").is(version)
            .andOperator(Criteria.where("domainInfo.scope").is(scope)));
    Query query = Query.query(where);

    List<Datatype> datatypes = mongoTemplate.find(query, Datatype.class);
    return datatypes;
  }

  @Override
  public Datatype findOneByNameAndVersionAndScope(String name, String version, String scope) {
    Criteria where =
        Criteria.where("name").is(name).andOperator(Criteria.where("domainInfo.version").is(version)
            .andOperator(Criteria.where("domainInfo.scope").is(scope)));
    Query query = Query.query(where);
    Datatype datatypes = mongoTemplate.findOne(query, Datatype.class);
    return datatypes;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToMetadata(gov.nist.hit.
   * hl7.igamt.datatype.domain.Datatype)
   */

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToPredef(gov.nist.hit.hl7.
   * igamt.datatype.domain.Datatype)
   */
  @Override
  public PreDef convertDomainToPredef(Datatype datatype) {
    if (datatype != null) {
      PreDef result = new PreDef();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + "_" + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setPreDef(datatype.getPreDef());
      return result;
    }
    return null;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToPostdef(gov.nist.hit.hl7
   * .igamt.datatype.domain.Datatype)
   */
  @Override
  public PostDef convertDomainToPostdef(Datatype datatype) {
    if (datatype != null) {
      PostDef result = new PostDef();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + "_" + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setPostDef(datatype.getPostDef());
      return result;
    }
    return null;
  }

  @Override
  public List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version) {
    // TODO Auto-generated method stub



    Criteria where = Criteria.where("domainInfo.scope").is(scope)
            .andOperator(Criteria.where("domainInfo.version").is(version));
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("description");
    List<Datatype> Datatypes = mongoTemplate.find(qry, Datatype.class);



    return Datatypes;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToConformanceStatement(gov
   * .nist.hit.hl7.igamt.datatype.domain.Datatype)
   */
  @Override
  public DatatypeConformanceStatement convertDomainToConformanceStatement(Datatype datatype) {
    if (datatype != null) {
      DatatypeConformanceStatement result = new DatatypeConformanceStatement();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setName(datatype.getName());
      if (datatype.getBinding() != null)
        result.setConformanceStatements(this.collectCS(datatype.getBinding().getConformanceStatementIds()));
      return result;
    }
    return null;
  }



  /**
   * @param conformanceStatementIds
   * @return
   */
  private Set<ConformanceStatement> collectCS(Set<String> conformanceStatementIds) {
    Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
    if(conformanceStatementIds != null){
      for(String id : conformanceStatementIds){
        result.add(this.conformanceStatementRepository.findById(id).get());
      }
    }
    
    return result;
  }

  private void validateComponent(Component f) throws ValidationException {
    if (f.getRef() == null || StringUtils.isEmpty(f.getRef().getId())) {
      throw new DatatypeValidationException("Datatype is missing");
    }
    Datatype d = findById(f.getRef().getId());
    if (d == null) {
      throw new DatatypeValidationException("Datatype is missing");
    }
    ValidationUtil.validateUsage(f.getUsage(), 2);
    ValidationUtil.validateLength(f.getMinLength(), f.getMaxLength());
    ValidationUtil.validateConfLength(f.getConfLength());
  }

  @Override
  public Link cloneDatatype(HashMap<String, String> datatypesMap,
      HashMap<String, String> valuesetsMap, Link l, String username) {
    // TODO Auto-generated method stub

    Datatype old = this.findById(l.getId());
    Datatype elm = old.clone();
    Link newLink = new Link();
    if (datatypesMap.containsKey(l.getId())) {
      newLink.setId(datatypesMap.get(l.getId()));
    } else {
      ;

      String newKey = new ObjectId().toString();
      newLink.setId(newKey);
      datatypesMap.put(l.getId(), newKey);
    }
    updateDependencies(elm, datatypesMap, valuesetsMap);
    elm.setId(newLink.getId());
    this.save(elm);
    return newLink;

  }

  private void updateDependencies(Datatype elm, HashMap<String, String> datatypesMap,
      HashMap<String, String> valuesetsMap) {
    // TODO Auto-generated method stub

    if (elm instanceof ComplexDatatype) {
      for (Component c : ((ComplexDatatype) elm).getComponents()) {
        if (c.getRef() != null) {
          if (c.getRef().getId() != null) {
            if (datatypesMap.containsKey(c.getRef().getId())) {
              c.getRef().setId(datatypesMap.get(c.getRef().getId()));
            }
          }
        }

      }

    }
    if (elm.getBinding() != null) {
      updateBindings(elm.getBinding(), valuesetsMap);
    }
  }

  private void updateBindings(ResourceBinding binding, HashMap<String, String> valuesetsMap) {
    // TODO Auto-generated method stub
    Set<String> vauleSetIds = new HashSet<String>();
    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getValuesetBindings() != null) {
          for (ValuesetBinding vs : child.getValuesetBindings()) {
            if (vs.getValuesetId() != null) {
              if (valuesetsMap.containsKey(vs.getValuesetId())) {
                vs.setValuesetId(valuesetsMap.get(vs.getValuesetId()));
              }
            }
          }
        }
      }
    }
  }

  @Override
  public Set<?> convertComponentStructure(Datatype datatype, String idPath, String path,
      String viewScope) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

    if (viewScope.equals(ViewScope.SEGMENT.toString())) {
      if (datatype instanceof ComplexDatatype) {
        ComplexDatatype childDatatype = (ComplexDatatype) datatype;
        if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
          Set<ComponentStructureTreeModel> result = new HashSet<ComponentStructureTreeModel>();

          for (Component c : childDatatype.getComponents()) {
            Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
            if (childChildDt != null) {
              ComponentStructureTreeModel componentStructureTreeModel =
                  new ComponentStructureTreeModel();
              ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
              cModel.setViewScope(ViewScope.SEGMENT);
              cModel.setIdPath(idPath + "-" + c.getId());
              cModel.setPath(path + "-" + c.getPosition());
              cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
              StructureElementBinding cSeb =
                  this.findStructureElementBindingByComponentIdForDatatype(datatype, c.getId());
              if (cSeb != null)
                cModel.addBinding(this.createBindingDisplay(cSeb, datatype.getId(),
                    ViewScope.DATATYPE, 2, valueSetsMap));

              componentStructureTreeModel.setData(cModel);
              if (childChildDt instanceof ComplexDatatype) {
                ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
                if (componentDatatype.getComponents() != null
                    && componentDatatype.getComponents().size() > 0) {
                  for (Component sc : componentDatatype.getComponents()) {
                    Datatype childChildChildDt =
                        this.findDatatype(sc.getRef().getId(), datatypesMap);
                    if (childChildChildDt != null) {
                      SubComponentStructureTreeModel subComponentStructureTreeModel =
                          new SubComponentStructureTreeModel();
                      SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
                      scModel.setViewScope(ViewScope.SEGMENT);
                      scModel.setIdPath(idPath + "-" + c.getId() + "-" + sc.getId());
                      scModel.setPath(path + "-" + c.getPosition() + "-" + sc.getPosition());
                      scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
                      StructureElementBinding childCSeb =
                          this.findStructureElementBindingByComponentIdFromStructureElementBinding(
                              cSeb, sc.getId());
                      if (childCSeb != null)
                        scModel.addBinding(this.createBindingDisplay(childCSeb, datatype.getId(),
                            ViewScope.DATATYPE, 2, valueSetsMap));
                      StructureElementBinding scSeb =
                          this.findStructureElementBindingByComponentIdForDatatype(childChildDt,
                              sc.getId());
                      if (scSeb != null)
                        scModel.addBinding(this.createBindingDisplay(scSeb, childChildDt.getId(),
                            ViewScope.DATATYPE, 3, valueSetsMap));
                      subComponentStructureTreeModel.setData(scModel);
                      componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
                    } else {
                      // TODO need to handle exception
                    }
                  }
                }
              }
              result.add(componentStructureTreeModel);
            } else {
              // TODO need to handle exception
            }
          }
          return result;
        }
      }
    } else if (viewScope.equals(ViewScope.DATATYPE.toString())) {
      if (datatype instanceof ComplexDatatype) {
        ComplexDatatype componentDatatype = (ComplexDatatype) datatype;
        if (componentDatatype.getComponents() != null
            && componentDatatype.getComponents().size() > 0) {
          Set<SubComponentStructureTreeModel> result =
              new HashSet<SubComponentStructureTreeModel>();
          for (Component sc : componentDatatype.getComponents()) {
            Datatype childChildChildDt = this.findDatatype(sc.getRef().getId(), datatypesMap);
            if (childChildChildDt != null) {
              SubComponentStructureTreeModel subComponentStructureTreeModel =
                  new SubComponentStructureTreeModel();
              SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
              scModel.setViewScope(ViewScope.DATATYPE);
              scModel.setIdPath(idPath + "-" + sc.getId());
              scModel.setPath(path + "-" + sc.getPosition());
              scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
              StructureElementBinding scSeb =
                  this.findStructureElementBindingByComponentIdForDatatype(datatype, sc.getId());
              if (scSeb != null)
                scModel.addBinding(this.createBindingDisplay(scSeb, datatype.getId(),
                    ViewScope.DATATYPE, 3, valueSetsMap));
              subComponentStructureTreeModel.setData(scModel);
              result.add(subComponentStructureTreeModel);
            } else {
              // TODO need to handle exception
            }
          }
          return result;
        }
      }
    }
    return null;
  }

  @Override
  public DatatypeStructureDisplay convertDomainToStructureDisplay(Datatype datatype, boolean readOnly) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

    DatatypeStructureDisplay result = new DatatypeStructureDisplay();
    
    result.complete(result, datatype, SectionType.STRUCTURE,readOnly);
    if (datatype.getExt() != null) {
      result.setLabel(datatype.getName() + "_" + datatype.getExt());
    } else {
      result.setLabel(datatype.getName());
    }
    result.setName(datatype.getName());
    if (datatype instanceof ComplexDatatype) {
      ComplexDatatype dt = (ComplexDatatype) datatype;

      if (dt.getComponents() != null && dt.getComponents().size() > 0) {
        for (Component c : dt.getComponents()) {
          Datatype childDt = this.findDatatype(c.getRef().getId(), datatypesMap);
          if (childDt != null) {
            ComponentStructureTreeModel componentStructureTreeModel =
                new ComponentStructureTreeModel();
            ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
            cModel.setViewScope(ViewScope.DATATYPE);
            cModel.setIdPath(c.getId());
            cModel.setPath(c.getPosition() + "");
            cModel.setDatatypeLabel(this.createDatatypeLabel(childDt));
            StructureElementBinding cSeb =
                this.findStructureElementBindingByComponentIdForDatatype(datatype, c.getId());
            if (cSeb != null)
              cModel.addBinding(this.createBindingDisplay(cSeb, datatype.getId(),
                  ViewScope.DATATYPE, 1, valueSetsMap));
            componentStructureTreeModel.setData(cModel);

            if (childDt instanceof ComplexDatatype) {
              ComplexDatatype childDatatype = (ComplexDatatype) childDt;
              if (childDatatype.getComponents() != null
                  && childDatatype.getComponents().size() > 0) {
                for (Component sc : childDatatype.getComponents()) {
                  Datatype childChildDt = this.findDatatype(sc.getRef().getId(), datatypesMap);
                  if (childChildDt != null) {
                    SubComponentStructureTreeModel subComponentStructureTreeModel =
                        new SubComponentStructureTreeModel();
                    SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(c);
                    scModel.setViewScope(ViewScope.DATATYPE);
                    scModel.setIdPath(c.getId() + "-" + sc.getId());
                    scModel.setPath(c.getPosition() + "-" + sc.getPosition());
                    scModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
                    StructureElementBinding childSeb =
                        this.findStructureElementBindingByComponentIdFromStructureElementBinding(
                            cSeb, sc.getId());
                    if (childSeb != null)
                      scModel.addBinding(this.createBindingDisplay(childSeb, datatype.getId(),
                          ViewScope.DATATYPE, 1, valueSetsMap));
                    StructureElementBinding scSeb = this
                        .findStructureElementBindingByComponentIdForDatatype(childDt, sc.getId());
                    if (scSeb != null)
                      scModel.addBinding(this.createBindingDisplay(scSeb, childDt.getId(),
                          ViewScope.DATATYPE, 2, valueSetsMap));
                    subComponentStructureTreeModel.setData(scModel);
                    componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
                  } else {
                    // TODO need to handle exception
                  }
                }
              }
            }
            result.addComponent(componentStructureTreeModel);
          } else {
            // TODO need to handle exception
          }
        }
      }
    }
    result.setType(Type.DATATYPE);
    return result;
  }

  private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId,
      ViewScope sourceType, int priority, HashMap<String, Valueset> valueSetsMap) {
    BindingDisplay bindingDisplay = new BindingDisplay();
    bindingDisplay.setSourceId(sourceId);
    bindingDisplay.setSourceType(sourceType);
    bindingDisplay.setPriority(priority);
    bindingDisplay.setComments(seb.getComments());
    bindingDisplay.setConstantValue(seb.getConstantValue());
    bindingDisplay.setExternalSingleCode(seb.getExternalSingleCode());
    bindingDisplay.setInternalSingleCode(seb.getInternalSingleCode());
    if(seb.getPredicateId() != null) bindingDisplay.setPredicate(this.predicateRepository.findById(seb.getPredicateId()).get());
    bindingDisplay.setValuesetBindings(this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap));
    return bindingDisplay;
  }

  private Datatype findDatatype(String id, HashMap<String, Datatype> datatypesMap) {
    Datatype dt = datatypesMap.get(id);
    if (dt == null) {
      dt = this.findById(id);
      datatypesMap.put(id, dt);
    }
    return dt;
  }

  private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
      HashMap<String, Valueset> valueSetsMap) {
    if (valuesetBindings != null) {
      Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
      for (ValuesetBinding vb : valuesetBindings) {
        Valueset vs = valueSetsMap.get(vb.getValuesetId());
        if (vs == null) {
          vs = this.valueSetService.findById(vb.getValuesetId());
          valueSetsMap.put(vs.getId(), vs);
        }
        if (vs != null) {
          DisplayValuesetBinding dvb = new DisplayValuesetBinding();
          dvb.setLabel(vs.getBindingIdentifier());
          dvb.setName(vs.getName());
          dvb.setStrength(vb.getStrength());
          dvb.setValuesetId(vb.getValuesetId());
          dvb.setValuesetLocations(vb.getValuesetLocations());
          result.add(dvb);
        }
      }
      return result;
    }
    return null;
  }

  private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt,
      String cid) {
    if (dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : dt.getBinding().getChildren()) {
        if (seb.getElementId().equals(cid))
          return seb;
      }
    }
    return null;
  }

  private StructureElementBinding findStructureElementBindingByComponentIdFromStructureElementBinding(
      StructureElementBinding seb, String cId) {
    if (seb != null && seb.getChildren() != null) {
      for (StructureElementBinding child : seb.getChildren()) {
        if (child.getElementId().equals(cId))
          return seb;
      }
    }
    return null;
  }



  @Override
  public List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(Set<String> ids, Datatype dt,
      String scope) {
    boolean isComplex = dt instanceof ComplexDatatype;

    List<DatatypeSelectItemGroup> ret = new ArrayList<DatatypeSelectItemGroup>();
    DatatypeSelectItemGroup flavros = new DatatypeSelectItemGroup();
    flavros.setLabel("Flavors");
    List<Datatype> dtFlavors = this.findFlavors(ids, dt.getId(), dt.getName());

    if (dtFlavors != null && !dtFlavors.isEmpty()) {
      dtFlavors.forEach(d -> flavros.getItems().add(createItem(d)));
      ret.add(flavros);
    }
    List<Datatype> others = this.findNonFlavor(ids, dt.getId(), dt.getName());
    if (others != null && !others.isEmpty()) {
      others =
          others.stream().filter(d -> applyRule(d, isComplex, scope)).collect(Collectors.toList());
    }
    if (!others.isEmpty()) {
      DatatypeSelectItemGroup othersgroup = new DatatypeSelectItemGroup();
      othersgroup.setLabel("others");
      others.forEach(d -> othersgroup.getItems().add(createItem(d)));
      ret.add(othersgroup);
    }
    return ret;
  }



  private boolean applyRule(Datatype d, boolean isComplex, String scope) {
    boolean secondComplex = d instanceof ComplexDatatype;
    // TODO Auto-generated method stub
    boolean ret = false;
    if (scope.equals(ViewScope.DATATYPE.toString())) {
      ret = !isComplex && !secondComplex;

    } else {

      if (isComplex) {
        ret = secondComplex == isComplex;
      } else {
        ret = true;
      }
    }
    return ret;
  }

  private DatatypeSelectItem createItem(Datatype dt) {
    // TODO Auto-generated method stub
    DatatypeSelectItem item = new DatatypeSelectItem(dt.getLabel(), this.createDatatypeLabel(dt));
    return item;

  }

  @Override
  public List<Datatype> findDisplayFormatByIds(Set<String> ids) {
    Query qry = new Query();
    qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("description");
    qry.fields().include("ext");
    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
    return datatypes;
  }

  private Set<ObjectId> convertIds(Set<String> ids) {
    // TODO Auto-generated method stub
    Set<ObjectId> results = new HashSet<ObjectId>();
    ids.forEach(id -> results.add(new ObjectId(id)));
    return results;
  }


  @Override
  public List<Datatype> findFlavors(Set<String> ids, String id, String name) {
    Query qry = new Query();
    qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
    qry.addCriteria(Criteria.where("name").is(name));

    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("_class");
    qry.fields().include("name");
    qry.fields().include("description");
    qry.fields().include("ext");
    qry.with(new Sort(Sort.Direction.ASC, "ext"));

    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
    return datatypes;
  }

  @Override
  public List<Datatype> findNonFlavor(Set<String> ids, String id, String name) {
    Query qry = new Query();
    qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
    qry.addCriteria(Criteria.where("name").ne(name));
    qry.with(new Sort(Sort.Direction.ASC, "name"));

    //
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("description");
    qry.fields().include("ext");
    qry.fields().include("_class");


    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
    return datatypes;
  }

  private DatatypeLabel createDatatypeLabel(Datatype dt) {
    DatatypeLabel label = new DatatypeLabel();
    label.setDomainInfo(dt.getDomainInfo());
    label.setExt(dt.getExt());
    label.setId(dt.getId());
    label.setLabel(dt.getLabel());
    if (dt instanceof ComplexDatatype)
      label.setLeaf(false);
    else
      label.setLeaf(true);
    label.setName(dt.getName());

    return label;
  }

  @Override
  public void applyChanges(Datatype d, List<ChangeItemDomain> cItems)
      throws JsonProcessingException, IOException {
    Collections.sort(cItems);
    for (ChangeItemDomain item : cItems) {
    	
    	
    	if(item.getPropertyType().equals(PropertyType.PREDEF)) {
    		item.setOldPropertyValue(d.getPreDef());
    		d.setPreDef((String)item.getPropertyValue());
    	
    	}else if(item.getPropertyType().equals(PropertyType.POSTDEF)) {
    		item.setOldPropertyValue(d.getPostDef());
    		d.setPostDef((String)item.getPropertyValue());
    	}else if(item.getPropertyType().equals(PropertyType.AUTHORNOTES)) {
    		item.setOldPropertyValue(d.getAuthorNotes());
    		d.setAuthorNotes((String)item.getPropertyValue());
    	
    	}else if(item.getPropertyType().equals(PropertyType.USAGENOTES)) {
    		item.setOldPropertyValue(d.getUsageNotes());
    		d.setUsageNotes((String)item.getPropertyValue());
    	}
      	else if(item.getPropertyType().equals(PropertyType.EXT)) {
    		item.setOldPropertyValue(d.getExt());
    		d.setExt((String)item.getPropertyValue());
    	}
    	else if (item.getPropertyType().equals(PropertyType.USAGE)) {
        Component c = this.findComponentById(d, item.getLocation());
        if (c != null) {
          item.setOldPropertyValue(c.getUsage());
          c.setUsage(Usage.valueOf((String) item.getPropertyValue()));
        }
      } else if (item.getPropertyType().equals(PropertyType.LENGTHMIN)) {
        Component c = this.findComponentById(d, item.getLocation());
        if (c != null) {
          item.setOldPropertyValue(c.getMinLength());
          if (item.getPropertyValue() == null) {
            c.setMinLength("NA");
          } else {
            c.setMinLength((String) item.getPropertyValue());
          }

        }
      } else if (item.getPropertyType().equals(PropertyType.LENGTHMAX)) {
        Component c = this.findComponentById(d, item.getLocation());
        if (c != null) {
          item.setOldPropertyValue(c.getMaxLength());
          if (item.getPropertyValue() == null) {
            c.setMaxLength("NA");
          } else {
            c.setMaxLength((String) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.CONFLENGTH)) {
        Component c = this.findComponentById(d, item.getLocation());
        if (c != null) {
          item.setOldPropertyValue(c.getConfLength());
          if (item.getPropertyValue() == null) {
            c.setConfLength("NA");
          } else {
            c.setConfLength((String) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.DATATYPE)) {
        Component c = this.findComponentById(d, item.getLocation());
        if (c != null) {
          item.setOldPropertyValue(c.getRef());
          ObjectMapper mapper = new ObjectMapper();
          String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
          c.setRef(mapper.readValue(jsonInString, Ref.class));
        }
      } else if (item.getPropertyType().equals(PropertyType.VALUESET)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
        item.setOldPropertyValue(seb.getValuesetBindings());
        seb.setValuesetBindings(
            this.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(
                Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
      } else if (item.getPropertyType().equals(PropertyType.SINGLECODE)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
        item.setOldPropertyValue(seb.getExternalSingleCode());
        seb.setExternalSingleCode(mapper.readValue(jsonInString, ExternalSingleCode.class));
      } else if (item.getPropertyType().equals(PropertyType.CONSTANTVALUE)) {
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
        item.setOldPropertyValue(seb.getConstantValue());
        if (item.getPropertyValue() == null) {
          seb.setConstantValue(null);
        } else {
          seb.setConstantValue((String) item.getPropertyValue());
        }
      } else if (item.getPropertyType().equals(PropertyType.DEFINITIONTEXT)) {
        Component f = this.findComponentById(d, item.getLocation());
        if (f != null) {
          item.setOldPropertyValue(f.getText());
          if (item.getPropertyValue() == null) {
            f.setText(null);
          } else {
            f.setText((String) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.COMMENT)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
        item.setOldPropertyValue(seb.getComments());
        seb.setComments(
            new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
      } else if (item.getPropertyType().equals(PropertyType.STATEMENT)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        if (item.getChangeType().equals(ChangeType.ADD)) {
          ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
          cs = this.conformanceStatementRepository.save(cs);
          d.getBinding().addConformanceStatement(cs.getId());
        } else if (item.getChangeType().equals(ChangeType.DELETE)) {
          item.setOldPropertyValue(item.getLocation());
          this.deleteConformanceStatementById(d, item.getLocation());
        } else if (item.getChangeType().equals(ChangeType.UPDATE)) {
          ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
          item.setOldPropertyValue(this.conformanceStatementRepository.findById(cs.getId()));
          cs = this.conformanceStatementRepository.save(cs);
        }
      }
    }
    this.save(d);
  }

  private String deleteConformanceStatementById(Datatype d, String location) {
    String toBeDeleted = null;
    for (String id : d.getBinding().getConformanceStatementIds()) {
      ConformanceStatement cs = this.conformanceStatementRepository.findById(id).get();
      if (cs.getIdentifier().equals(location))
        toBeDeleted = id;
    }

    if (toBeDeleted != null)
      d.getBinding().getConformanceStatementIds().remove(toBeDeleted);
    return toBeDeleted;
  }

  /**
   * @param hashSet
   * @return
   */
  private Set<ValuesetBinding> convertDisplayValuesetBinding(
      HashSet<DisplayValuesetBinding> displayValuesetBindings) {
    if (displayValuesetBindings != null) {
      Set<ValuesetBinding> result = new HashSet<ValuesetBinding>();
      for (DisplayValuesetBinding dvb : displayValuesetBindings) {
        ValuesetBinding vb = new ValuesetBinding();
        vb.setStrength(dvb.getStrength());
        vb.setValuesetId(dvb.getValuesetId());
        vb.setValuesetLocations(dvb.getValuesetLocations());
        result.add(vb);
      }
      return result;
    }
    return null;
  }

  /**
   * @param sebs
   * @param location
   * @return
   */
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(Datatype s,
      String location) {
    if (s.getBinding() == null) {
      ResourceBinding binding = new ResourceBinding();
      binding.setElementId(s.getId());
      s.setBinding(binding);
    }
    return this.findAndCreateStructureElementBindingByIdPath(s.getBinding(), location);
  }

  /**
   * @param binding
   * @param location
   * @return
   */
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      ResourceBinding binding, String location) {
    if (binding.getChildren() == null) {
      if (location.contains("-")) {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    } else {
      if (location.contains("-")) {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location.split("\\-")[0]))
            return this.findAndCreateStructureElementBindingByIdPath(seb,
                location.replace(location.split("\\-")[0] + "-", ""));
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location))
            return seb;
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    }
  }

  /**
   * @param seb
   * @param replace
   * @return
   */
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      StructureElementBinding binding, String location) {
    if (binding.getChildren() == null) {
      if (location.contains("-")) {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    } else {
      if (location.contains("-")) {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location.split("\\-")[0]))
            return this.findAndCreateStructureElementBindingByIdPath(seb,
                location.replace(location.split("\\-")[0] + "-", ""));
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location))
            return seb;
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    }
  }

  /**
   * @param s
   * @param location
   * @return
   */
  private Component findComponentById(Datatype d, String location) {
    if (d instanceof ComplexDatatype) {
      for (Component c : ((ComplexDatatype) d).getComponents()) {
        if (c.getId().equals(location))
          return c;
      }
    }

    return null;
  }

  @Override
  public void collectAssoicatedConformanceStatements(Datatype datatype, HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {    
    if(datatype.getDomainInfo().getScope().equals(Scope.USER)) {
      if(datatype instanceof ComplexDatatype) {
        ComplexDatatype cDT = (ComplexDatatype)datatype;
        for(Component c : cDT.getComponents()) {
          Datatype dt = this.findById(c.getRef().getId());
          if(dt != null){
            if(dt.getDomainInfo().getScope().equals(Scope.USER)) {
              if(dt.getBinding() != null && dt.getBinding().getConformanceStatementIds() != null && dt.getBinding().getConformanceStatementIds().size() > 0) {
                if(!associatedConformanceStatementMap.containsKey(dt.getLabel())) associatedConformanceStatementMap.put(dt.getLabel(), new ConformanceStatementsContainer(this.collectCS(dt.getBinding().getConformanceStatementIds()), Type.DATATYPE, dt.getId(), dt.getLabel()));
                this.collectAssoicatedConformanceStatements(dt, associatedConformanceStatementMap);
              }
            }            
          }

        }  
      }
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#makeLocationInfo(gov.nist.hit.hl7.igamt.datatype.domain.Datatype)
   */
  @Override
  public Binding makeLocationInfo(Datatype dt) {
    if(dt instanceof ComplexDatatype && dt.getBinding() != null) {
      for(StructureElementBinding seb : dt.getBinding().getChildren()){
        seb.setLocationInfo(makeLocationInfoForComponent((ComplexDatatype)dt, seb));  
      }
      return dt.getBinding();
    }
    return null;
  }

  /**
   * @param dt
   * @param seb
   * @return
   */
  @Override
  public LocationInfo makeLocationInfoForComponent(ComplexDatatype dt, StructureElementBinding seb) {
    if(dt != null && dt.getComponents() != null) {
      for(Component c : dt.getComponents()) {
        if(c.getId().equals(seb.getElementId())){
          
          for(StructureElementBinding childSeb : seb.getChildren()){
            Datatype childDT = this.findById(c.getRef().getId());
            if(childDT instanceof ComplexDatatype) childSeb.setLocationInfo(makeLocationInfoForSubComponent((ComplexDatatype)childDT, childSeb));  
          }
          
          return new LocationInfo(seb.getElementId(), LocationType.COMPONENT, c.getPosition(), c.getName());
        }
      }
    }
    return null;
  }

  /**
   * @param childDT
   * @param childSeb
   * @return
   */
  private LocationInfo makeLocationInfoForSubComponent(ComplexDatatype dt, StructureElementBinding seb) {
    if(dt != null && dt.getComponents() != null) {
      for(Component c : dt.getComponents()) {
        if(c.getId().equals(seb.getElementId())){          
          return new LocationInfo(seb.getElementId(), LocationType.SUBCOMPONENT, c.getPosition(), c.getName());
        }
      }
    }
    return null;
  }
}
