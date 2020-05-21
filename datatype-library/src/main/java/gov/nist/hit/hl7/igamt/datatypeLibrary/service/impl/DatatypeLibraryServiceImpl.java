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
import java.util.Map;
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

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
//import gov.nist.hit.hl7.igamt.common.base.model.PublicationEntry;
//import gov.nist.hit.hl7.igamt.common.base.model.PublicationSummary;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.LibraryDisplayInfoService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.STATUS;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author ena3
 *
 */
@Service
public class DatatypeLibraryServiceImpl implements DatatypeLibraryService {


  @Autowired
  DatatypeLibraryRepository datatypeLibraryRepository;
  
  @Autowired
  LibraryDisplayInfoService display;

  @Autowired
  MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;
  @Autowired
  ValuesetService valuesetService;

  @Override
  public DatatypeLibrary findById(String id) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findById(id).orElse(null);
  }

  @Override
  public List<DatatypeLibrary> findAll() {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findAll();
  }


  @Override
  public void delete(String id) {
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
  public List<DatatypeLibrary> finByScope(String scope) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findByDomainInfoScope(scope);
  }

  @Override
  public DatatypeLibrary createEmptyDatatypeLibrary()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
    // TODO Auto-generated method stub

    // TODO Auto-generated method stub
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    List<SectionTemplate> datatypeLibraryTemplate =
        objectMapper.readValue(DatatypeLibraryServiceImpl.class.getResourceAsStream("/datatypeLibraryTemplate.json"), new TypeReference<List<SectionTemplate>>() {});
    DatatypeLibrary emptyLibrary = new DatatypeLibrary();
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
    Set<String> ids = links.stream().map(x -> x.getId()).collect(Collectors.toSet());
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
  public AddDatatypeResponseObject addDatatypes(Set<String> ids, DatatypeLibrary lib) throws AddingException {
      // TODO Auto-generated method stub
      AddDatatypeResponseObject ret = new AddDatatypeResponseObject();
      if (lib.getDatatypeRegistry() != null) {
          if (lib.getDatatypeRegistry().getChildren() != null) {
              Set<String> existants = mapLinkToId(lib.getDatatypeRegistry().getChildren());
              ids.removeAll(existants);
              for (String id : ids) {
                  Datatype datatype = datatypeService.findById(id);
                  if (datatype != null) {
                      if (datatype instanceof ComplexDatatype) {
                          ComplexDatatype p = (ComplexDatatype) datatype;
                          if (p.getBinding() != null) {
                              Set<String> vauleSetBindingIds = processBinding(p.getBinding());
                              AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, lib);
                              for (Valueset vs : valueSetAdded.getValueSets()) {
                                  if (!ret.getValueSets().contains(vs)) {
                                      ret.getValueSets().add(vs);
                                  }
                              }
                          }
                          Set<String> datatypeIds = getDatatypeResourceDependenciesIds(p);
                          addDatatypes(datatypeIds, lib, ret);
                      }
                      Link link = new Link(datatype.getId(), datatype.getDomainInfo(),
                              lib.getDatatypeRegistry().getChildren().size() + 1);
                      link.setParentId(datatype.getParentId());
                      link.setParentType(datatype.getParentType());
                      ret.getDatatypes().add(datatype);
                      lib.getDatatypeRegistry().getChildren().add(link);

                  }else {
                      throw new AddingException("Could not find Datatype with id : "+id);
                  }
              }
          }
      }
      return ret;
  }
  public void addDatatypes(Set<String> ids, DatatypeLibrary lib, AddDatatypeResponseObject ret)
      throws AddingException {
  // TODO Auto-generated method stub
  if (lib.getDatatypeRegistry() != null) {
      if (lib.getDatatypeRegistry().getChildren() != null) {
          Set<String> existants = mapLinkToId(lib.getDatatypeRegistry().getChildren());
          ids.removeAll(existants);
          for (String id : ids) {
              Datatype datatype = datatypeService.findById(id);
              if (datatype != null) {
                  if (datatype.getBinding() != null) {
                      Set<String> vauleSetBindingIds = processBinding(datatype.getBinding());
                      AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, lib);
                      for (Valueset vs : valueSetAdded.getValueSets()) {
                          if (!ret.getValueSets().contains(vs)) {
                              ret.getValueSets().add(vs);
                          }
                      }
                  }
                  Link link =
                          new Link(datatype.getId(), datatype.getDomainInfo(), lib.getDatatypeRegistry().getChildren().size() + 1);
                  lib.getDatatypeRegistry().getChildren().add(link);
                  ret.getDatatypes().add(datatype);
                  link.setParentType(datatype.getParentType());
                  link.setParentId(datatype.getParentId());
                  if (datatype instanceof ComplexDatatype) {
                      ComplexDatatype p = (ComplexDatatype) datatype;
                      addDatatypes(getDatatypeResourceDependenciesIds(p), lib, ret);
                  }
              } else {
                  throw new AddingException("Could not find Datata type  with id " + id);
              }
          }
      }
  }
}

  @Override
  public AddValueSetResponseObject addValueSets(Set<String> ids, DatatypeLibrary lib) throws AddingException {
      // TODO Auto-generated method stub
      ValueSetRegistry reg = lib.getValueSetRegistry();
      AddValueSetResponseObject ret = new AddValueSetResponseObject();
      if (reg != null) {
          if (reg.getChildren() != null) {
              Set<String> existants = mapLinkToId(reg.getChildren());
              ids.removeAll(existants);
              for (String id : ids) {
                  Valueset valueSet = valuesetService.findById(id);
                  if (valueSet != null) {
                      Link link =
                              new Link(valueSet.getId(), valueSet.getDomainInfo(), reg.getChildren().size() + 1);
                      reg.getChildren().add(link);
                      ret.getValueSets().add(valueSet);
                  } else {
                      throw new AddingException("Could not find Value Set  with id " + id);
                  }
              }
          }
      }
      return ret;
  }
  
  private Set<String> processBinding(ResourceBinding binding) {
    // TODO Auto-generated method stub
    Set<String> vauleSetIds = new HashSet<String>();
    if (binding.getChildren() != null) {
        for (StructureElementBinding child : binding.getChildren()) {
            if (child.getValuesetBindings() != null) {
                for (ValuesetBinding vs : child.getValuesetBindings()) {
                    if(vs.getValueSets() !=null) {
                        for(String s: vs.getValueSets()) {
                                vauleSetIds.add(s);
                        }
                    }
                }
            }
        }
    }
    return vauleSetIds;
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
    query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
    query.fields().include(attributeName);
    Update update = new Update();
    update.set(attributeName, value);
    update.set("updateDate", new Date());
    return mongoTemplate.updateFirst(query, update, DatatypeLibrary.class);

  }

  @Override
  public List<DatatypeLibrary> findByUsername(String username, Scope scope) {
    Criteria where = Criteria.where("username").is(username)
        .andOperator(Criteria.where("domainInfo.scope").is(scope.toString()), Criteria.where("status").ne(Status.PUBLISHED));
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("datatypeRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    qry.fields().include("sharedUsers");
    qry.fields().include("currentAuthor");

    List<DatatypeLibrary> igs = mongoTemplate.find(qry, DatatypeLibrary.class);
    return igs;
  }
  
  

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#convertListToDisplayList(
   * java.util.List)
   */
  @Override
  public List<DocumentSummary> convertListToDisplayList(List<DatatypeLibrary> libs) {
    // TODO Auto-generated method stub

    List<DocumentSummary> list = new ArrayList<DocumentSummary>();
    for (DatatypeLibrary lib : libs) {
      DocumentSummary element = new DocumentSummary();

      element.setCoverpage(lib.getMetadata().getCoverPicture());
      element.setDateUpdated(lib.getUpdateDate());
      element.setTitle(lib.getMetadata().getTitle());
      element.setSubtitle(lib.getMetadata().getSubTitle());
      // element.setConfrmanceProfiles(confrmanceProfiles);
      element.setCoverpage(lib.getMetadata().getCoverPicture());
      element.setId(lib.getId());
      element.setDerived(lib.isDerived());
      element.setUsername(lib.getUsername());
      element.setStatus(lib.getStatus());
      element.setSharePermission(lib.getSharePermission());
      element.setSharedUsers(lib.getSharedUsers());
      element.setCurrentAuthor(lib.getCurrentAuthor());
      List<String> datatypesNames = new ArrayList<String>();
      DatatypeRegistry datatypeRegistry = lib.getDatatypeRegistry();
      if (datatypeRegistry != null) {
        if (datatypeRegistry.getChildren() != null) {
          for (Link i : datatypeRegistry.getChildren()) {
            Datatype datatype =
                datatypeService.findById(i.getId());
            if (datatype != null) {
              datatypesNames
              .add(datatype.getLabel());
            }
          }
        }
      }
      element.setElements(datatypesNames);
      list.add(element);
    }
    return list;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#findLatestPublished()
   */
  @Override
  public List<DatatypeLibrary> findPublished() {
    // TODO Auto-generated method stub


    Criteria where = Criteria.where("publicationInfo.status").is(STATUS.PUBLISHED);

    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("publicationInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("datatypeRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    List<DatatypeLibrary> libs = mongoTemplate.find(qry, DatatypeLibrary.class);

    return libs;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#addDatatypes(java.util.Set, gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary, gov.nist.hit.hl7.igamt.common.base.domain.Scope)
   */
  @Override
  public AddDatatypeResponseObject addDatatypes(Set<String> savedIds, DatatypeLibrary lib,
      Scope scope) throws AddingException {
    // TODO Auto-generated method stub
    return null;
  }
  
  @Override
  public TextSection findSectionById(Set<TextSection> content, String sectionId) {
    // TODO Auto-generated method stub
    for (TextSection s : content) {
      TextSection ret = findSectionInside(s, sectionId);
      if (ret != null) {
        return ret;
      }
    }
    return null;
  }

  private TextSection findSectionInside(TextSection s, String sectionId) {
    // TODO Auto-generated method stub
    if (s.getId().equals(sectionId)) {
      return s;
    }
    if (s.getChildren() != null && s.getChildren().size() > 0) {
      for (TextSection ss : s.getChildren()) {
        TextSection ret = findSectionInside(ss, sectionId);
        if (ret != null) {
          return ret;
        }
      }
      return null;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService#getPublicationSummary()
   */
//  @Override
//  public PublicationSummary getPublicationSummary(String id) {
//    // TODO Auto-generated method stub
//    PublicationSummary summary= new PublicationSummary();
//    summary.entries= new ArrayList<PublicationEntry>();
//    List<Datatype> toPublish = this.datatypeService.findByParentId(id);
//    System.out.println(toPublish.size());
//    
//    for(Datatype d : toPublish) {
//      summary.entries.add(getPublicationEntry(d));
//    }
//    return summary;
//  }
//
//  /**
//   * @param d
//   * @return
//   */
//  private PublicationEntry getPublicationEntry(Datatype d) {
//    // TODO Auto-generated method stub
//    PublicationEntry entry = new PublicationEntry();
//    List<String> availableExtensions = new ArrayList<String>();
//
//    entry.display = display.convertDatatype(d);
//    entry.suggested = d.getExt();
//    Criteria where = Criteria.where("name").is(d.getName())
//        .andOperator(Criteria.where("domainInfo.scope").is(Scope.SDTF.toString()));
//   Query qry = Query.query(where);
//   List<String> used=  this.mongoTemplate.findDistinct(qry, "ext", "datatype", Datatype.class, String.class);
//   Map<String, Boolean> map = used.stream().collect(Collectors.toMap(x ->  x, x->true));
//   for(int i= 1; i<10; i++) {
//    if(!map.containsKey(String.valueOf("0"+i))) {
//      availableExtensions.add("0"+i);
//    }
//   }
//   for(int i=10; i<100; i++ ) {
//     if(!map.containsKey(String.valueOf(i))) {
//       availableExtensions.add(String.valueOf(i));
//     }
//   }
//   if(!map.containsKey(d.getExt())) {
//     entry.suggested= availableExtensions.get(0);
//   }
//   entry.availableExtensions = availableExtensions;
//  return entry;
//  }
}


