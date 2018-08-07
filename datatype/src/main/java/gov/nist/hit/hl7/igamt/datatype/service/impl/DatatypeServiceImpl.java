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

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeValidationException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;


/**
 *
 * @author Maxence Lefort on Mar 1, 2018.
 */

@Service("datatypeService")
public class DatatypeServiceImpl implements DatatypeService {

  @Autowired
  private DatatypeRepository datatypeRepository;
  @Autowired
  private MongoTemplate mongoTemplate;


  @Override
  public Datatype findByKey(CompositeKey key) {
    return datatypeRepository.findById(key).get();
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
  public Datatype getLatestById(String id) {

    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    Datatype datatype = mongoTemplate.findOne(query, Datatype.class);
    return datatype;
  }


  @Override
  public List<Datatype> getLatestByScopeAndVersion(String scope, String hl7Version) {

    Criteria where = Criteria.where("domainInfo.scope").is(scope);
    where.andOperator(Criteria.where("domainInfo.version").is(hl7Version));
    Aggregation agg = newAggregation(match(where), group("id.id").max("id.version").as("version"));

    // Convert the aggregation result into a List
    List<CompositeKey> groupResults =
        mongoTemplate.aggregate(agg, Datatype.class, CompositeKey.class).getMappedResults();

    Criteria where2 = Criteria.where("id").in(groupResults);
    Query qry = Query.query(where2);
    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
    return datatypes;

  }


  @Override
  public List<Datatype> findByNameAndVersionAndScope(String name, String version, String scope) {
    Criteria where =
        Criteria.where("name").is(name).andOperator(Criteria.where("domainInfo.version").is(version)
            .andOperator(Criteria.where("domainInfo.scope").is(scope)));
    Query query = Query.query(where);
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    List<Datatype> datatypes = mongoTemplate.find(query, Datatype.class);
    return datatypes;
  }

  @Override
  public DatatypeStructure convertDomainToStructure(Datatype datatype) {
    if (datatype != null) {
      DatatypeStructure result = new DatatypeStructure();
      result.setId(datatype.getId());
      result.setScope(datatype.getDomainInfo().getScope());
      result.setVersion(datatype.getDomainInfo().getVersion());
      if (datatype.getExt() != null) {
        result.setLabel(datatype.getName() + "_" + datatype.getExt());
      } else {
        result.setLabel(datatype.getName());
      }
      result.setName(datatype.getName());
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToMetadata(gov.nist.hit.
   * hl7.igamt.datatype.domain.Datatype)
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#saveDatatype(gov.nist.hit.hl7.igamt.
   * datatype.domain.display.ChangedDatatype)
   */
  @Override
  public Datatype saveDatatype(ChangedDatatype changedDatatype) {
    if (changedDatatype != null && changedDatatype.getId() != null) {
      Datatype datatype = this.findLatestById(changedDatatype.getId());

      if (datatype != null) {
        if (changedDatatype.getMetadata() != null) {
          datatype.setDescription(changedDatatype.getMetadata().getDescription());
          datatype.setExt(changedDatatype.getMetadata().getExt());
          datatype.setName(changedDatatype.getMetadata().getName());
          datatype.setComment(changedDatatype.getMetadata().getAuthorNote());
          datatype.getDomainInfo().setScope(changedDatatype.getMetadata().getScope());
          datatype.getDomainInfo().setVersion(changedDatatype.getMetadata().getVersion());
        }

        if (changedDatatype.getPostDef() != null) {
          datatype.setPostDef(changedDatatype.getPostDef().getPostDef());
        }

        if (changedDatatype.getPreDef() != null) {
          datatype.setPreDef(changedDatatype.getPreDef().getPreDef());
        }

        if (changedDatatype.getStructure() != null) {
          datatype.setBinding(changedDatatype.getStructure().getBinding());
          Set<Component> components = new HashSet<Component>();
          for (ComponentDisplay cd : changedDatatype.getStructure().getChildren()) {
            components.add(cd.getData());
          }
          if (components.size() > 0) {
            ComplexDatatype cDatatype = (ComplexDatatype) datatype;
            cDatatype.setComponents(components);
          }
        }
      }
      return this.save(datatype);
    }

    return null;
  }

  @Override
  public List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version) {
    // TODO Auto-generated method stub



    Criteria where = Criteria.where("domainInfo.scope").is(scope);
    where.andOperator(Criteria.where("domainInfo.version").is(version));

    Aggregation agg = newAggregation(match(where), group("id.id").max("id.version").as("version"));

    // Convert the aggregation result into a List
    List<CompositeKey> groupResults =
        mongoTemplate.aggregate(agg, Datatype.class, CompositeKey.class).getMappedResults();

    Criteria where2 = Criteria.where("id").in(groupResults);
    Query qry = Query.query(where2);
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
      result.setConformanceStatements(datatype.getBinding().getConformanceStatements());
      return result;
    }
    return null;
  }



  private void validateComponent(Component f) throws ValidationException {
    if (f.getRef() == null || StringUtils.isEmpty(f.getRef().getId())) {
      throw new DatatypeValidationException("Datatype is missing");
    }
    Datatype d = getLatestById(f.getRef().getId());
    if (d == null) {
      throw new DatatypeValidationException("Datatype is missing");
    }
    ValidationUtil.validateUsage(f.getUsage(), 2);
    ValidationUtil.validateLength(f.getMinLength(), f.getMaxLength());
    ValidationUtil.validateConfLength(f.getConfLength());
  }


  /**
   * Validate the structure of the segment
   * 
   * @param structure
   * @throws DatatypeValidationException
   */
  @Override
  public void validate(DatatypeStructure structure) throws DatatypeValidationException {
    if (!structure.getScope().equals(Scope.HL7STANDARD)) {
      if (structure.getChildren() != null) {
        for (ComponentDisplay componentDisplay : structure.getChildren()) {
          Component f = componentDisplay.getData();
          try {
            validateComponent(f);
          } catch (ValidationException e) {
            throw new DatatypeValidationException(structure.getLabel() + "-" + f.getPosition());
          }
        }
      }
    }
  }

  @Override
  public void validate(DisplayMetadata metadata) throws DatatypeValidationException {
    if (!metadata.getScope().equals(Scope.HL7STANDARD)) {
      if (StringUtils.isEmpty(metadata.getName())) {
        throw new DatatypeValidationException("Name is missing");
      }
      if (StringUtils.isEmpty(metadata.getExt())) {
        throw new DatatypeValidationException("Ext is missing");
      }
    }
  }



  /**
   * TODO: anything more to validate ??
   */
  @Override
  public void validate(DatatypeConformanceStatement conformanceStatement)
      throws DatatypeValidationException {
    if (conformanceStatement != null) {
      for (ConformanceStatement statement : conformanceStatement.getConformanceStatements()) {
        if (StringUtils.isEmpty(statement.getIdentifier())) {
          throw new DatatypeValidationException("conformance statement identifier is missing");
        }
      }
    }
  }



  /**
   * TODO
   */
  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.segment.service.DatatypeService#convertToDatatype(gov.nist.hit.hl7.
   * igamt. segment.domain.display.DatatypeStructure)
   */
  @Override
  public Datatype convertToDatatype(DatatypeStructure structure) {
    Datatype datatype = this.findLatestById(structure.getId().getId());
    if (datatype != null) {
      datatype.setBinding(structure.getBinding());
      if (datatype instanceof ComplexDatatype) {
        ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
        if (structure.getChildren() != null && !structure.getChildren().isEmpty()) {
          Set<Component> components = new HashSet<Component>();
          for (ComponentDisplay fd : structure.getChildren()) {
            components.add(fd.getData());
          }
          complexDatatype.setComponents(components);
        }
        return complexDatatype;
      }
    }
    return datatype;
  }


  @Override
  public Datatype savePredef(PreDef predef) throws DatatypeNotFoundException {
    Datatype datatype = findLatestById(predef.getId().getId());
    if (datatype == null) {
      throw new DatatypeNotFoundException(predef.getId().getId());
    }
    datatype.setPreDef(predef.getPreDef());
    return save(datatype);
  }

  @Override
  public Datatype savePostdef(PostDef postdef) throws DatatypeNotFoundException {
    Datatype datatype = findLatestById(postdef.getId().getId());
    if (datatype == null) {
      throw new DatatypeNotFoundException(postdef.getId().getId());
    }
    datatype.setPostDef(postdef.getPostDef());
    return save(datatype);
  }


  @Override
  public Datatype saveMetadata(DisplayMetadata metadata)
      throws DatatypeNotFoundException, DatatypeValidationException {
    validate(metadata);
    Datatype segment = findLatestById(metadata.getId().getId());
    if (segment == null) {
      throw new DatatypeNotFoundException(metadata.getId().getId());
    }
    segment.setExt(metadata.getExt());
    segment.setDescription(metadata.getDescription());
    segment.setComment(metadata.getAuthorNote());
    return save(segment);
  }


  @Override
  public Datatype saveConformanceStatement(DatatypeConformanceStatement conformanceStatement)
      throws DatatypeNotFoundException, DatatypeValidationException {
    validate(conformanceStatement);
    Datatype segment = findLatestById(conformanceStatement.getId().getId());
    if (segment == null) {
      throw new DatatypeNotFoundException(conformanceStatement.getId().getId());
    }
    segment.getBinding().setConformanceStatements(conformanceStatement.getConformanceStatements());
    return save(segment);
  }


}
