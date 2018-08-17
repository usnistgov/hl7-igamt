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
package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.LibSummary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;

/**
 * @author ena3
 *
 */
@Service
public class DatatypeLibraryServiceImpl implements DatatypeLibraryService {


  @Autowired
  DatatypeLibraryRepository datatypeLibraryRepository;

  @Autowired
  MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Override
  public DatatypeLibrary findById(CompositeKey id) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findById(id).get();
  }

  @Override
  public List<DatatypeLibrary> findAll() {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findAll();
  }


  @Override
  public void delete(CompositeKey id) {
    // TODO Auto-generated method stub
    datatypeLibraryRepository.deleteById(id);
  }


  @Override
  public DatatypeLibrary save(DatatypeLibrary DatatypeLibrary) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.save(DatatypeLibrary);
  }


  public List<DatatypeLibrary> findByUsername(String username) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findByUsername(username);
  }



  @Override
  public DatatypeLibrary findLatestById(String id) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    DatatypeLibrary ig = mongoTemplate.findOne(query, DatatypeLibrary.class);
    return ig;
  }


  @Override
  public List<DatatypeLibrary> finByScope(String scope) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findByDomainInfoScope(scope);
  }

  @Override
  public DatatypeLibrary createEmptyDatatypeLibrary()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
    // TODO Auto-generated method stub

    // TODO Auto-generated method stub
    File ig = new ClassPathResource("datatypeLibraryTemplate.json").getFile();
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    List<SectionTemplate> datatypeLibraryTemplate =
        objectMapper.readValue(ig, new TypeReference<List<SectionTemplate>>() {});
    DatatypeLibrary emptyLibrary = new DatatypeLibrary();
    emptyLibrary.setId(new CompositeKey());
    emptyLibrary.setMetadata(new DocumentMetadata());
    Set<TextSection> content = new HashSet<TextSection>();
    for (SectionTemplate template : datatypeLibraryTemplate) {
      content.add(createSectionContent(template));
    }
    emptyLibrary.setContent(content);
    return emptyLibrary;
  }

  private TextSection createSectionContent(SectionTemplate template) {
    // TODO Auto-generated method stub
    TextSection section = new TextSection();
    section.setId(new ObjectId().toString());
    section.setType(Type.fromString(template.getType()));
    section.setDescription("");
    section.setLabel(template.getLabel());
    section.setPosition(template.getPosition());

    if (template.getChildren() != null) {
      Set<TextSection> children = new HashSet<TextSection>();
      for (SectionTemplate child : template.getChildren()) {
        children.add(createSectionContent(child));
      }
      section.setChildren(children);
    }
    return section;

  }


  private Set<String> mapLinkToId(Set<Link> links) {
    Set<String> ids = links.stream().map(x -> x.getId().getId()).collect(Collectors.toSet());
    return ids;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#addDatatypes(java.util.
   * Set, gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary)
   */
  @Override
  public AddDatatypeResponseObject addDatatypes(Set<String> savedIds, DatatypeLibrary lib,
      Scope scope) throws AddingException {
    DatatypeRegistry reg = lib.getDatatypeRegistry();
    AddDatatypeResponseObject ret = new AddDatatypeResponseObject();
    if (reg != null) {
      if (reg.getChildren() != null) {
        Set<String> existants = mapLinkToId(reg.getChildren());
        savedIds.removeAll(existants);
        for (String id : savedIds) {
          Datatype datatype = datatypeService.getLatestById(id);
          if (datatype != null) {
            if (datatype instanceof ComplexDatatype) {
              ComplexDatatype p = (ComplexDatatype) datatype;
              Set<String> datatypeIds = getDatatypeResourceDependenciesIds(p);
              addDatatypes(datatypeIds, lib, ret);


            }
            if (datatype.getId().getId() != null) {
              Link link = new Link(datatype.getId(), datatype.getDomainInfo(),
                  reg.getChildren().size() + 1);
              ret.getDatatypes().add(datatype);
              reg.getChildren().add(link);
            } else {
              System.out.println(datatype.getName());
              System.out.println(datatype.getDomainInfo().getVersion());
              System.out.println(datatype.getDomainInfo().getScope());
            }
          }
        }
      }
    }
    return ret;

  }

  public void addDatatypes(Set<String> ids, DatatypeLibrary lib, AddDatatypeResponseObject ret)
      throws AddingException {
    // TODO Auto-generated method stub
    DatatypeRegistry reg = lib.getDerivedRegistry();
    if (reg != null) {
      if (reg.getChildren() != null) {
        Set<String> existants = mapLinkToId(reg.getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          Datatype datatype = datatypeService.getLatestById(id);
          if (datatype != null) {
            Link link =
                new Link(datatype.getId(), datatype.getDomainInfo(), reg.getChildren().size() + 1);
            reg.getChildren().add(link);
            ret.getDatatypes().add(datatype);
            if (datatype instanceof ComplexDatatype) {
              ComplexDatatype p = (ComplexDatatype) datatype;
              addDatatypes(getDatatypeResourceDependenciesIds(p), lib, ret);
              System.out.println("putting In Library" + p.getId().getId());
              reg.getChildren().add(link);
            }
          } else {


            throw new AddingException("Could not find Datata type  with id " + id);

          }
        }
      }
    }

  }

  private Set<String> getDatatypeResourceDependenciesIds(ComplexDatatype datatype) {
    // TODO Auto-generated method stub
    Set<String> datatypeIds = new HashSet<String>();
    for (Component c : datatype.getComponents()) {
      if (c.getRef() != null) {
        if (c.getRef().getId() != null) {
          datatypeIds.add(c.getRef().getId());
        }
      }
    }
    return datatypeIds;

  }

  @Override
  public UpdateResult updateAttribute(String id, String attributeName, Object value) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.fields().include(attributeName);
    Update update = new Update();
    update.set(attributeName, value);
    update.set("updateDate", new Date());
    return mongoTemplate.updateFirst(query, update, DatatypeLibrary.class);

  }

  @Override
  public List<DatatypeLibrary> findLatestByUsername(String username) {



    Criteria where = Criteria.where("username").is(username);

    Aggregation agg = newAggregation(match(where), group("id.id").max("id.version").as("version"));

    // Convert the aggregation result into a List
    List<CompositeKey> groupResults =
        mongoTemplate.aggregate(agg, DatatypeLibrary.class, CompositeKey.class).getMappedResults();

    Criteria where2 = Criteria.where("id").in(groupResults);
    Query qry = Query.query(where2);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");

    List<DatatypeLibrary> libs = mongoTemplate.find(qry, DatatypeLibrary.class);



    return libs;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#convertListToDisplayList(
   * java.util.List)
   */
  @Override
  public List<LibSummary> convertListToDisplayList(List<DatatypeLibrary> libs) {
    // TODO Auto-generated method stub

    // TODO Auto-generated method stub

    List<LibSummary> res = new ArrayList<LibSummary>();
    for (DatatypeLibrary lib : libs) {
      LibSummary element = new LibSummary();

      element.setCoverpage(lib.getMetadata().getCoverPicture());
      element.setDateUpdated(lib.getUpdateDate());
      element.setTitle(lib.getMetadata().getTitle());
      element.setSubtitle(lib.getMetadata().getSubTitle());
      // element.setConfrmanceProfiles(confrmanceProfiles);
      element.setCoverpage(lib.getMetadata().getCoverPicture());
      element.setId(lib.getId());
      element.setUsername(lib.getUsername());
      res.add(element);
    }
    return res;
  }



}
