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

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.LibraryMetaData;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.SectionTemplate;

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



  @Override
  public DatatypeLibrary findById(CompositeKey id) {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findOne(id);
  }

  @Override
  public List<DatatypeLibrary> findAll() {
    // TODO Auto-generated method stub
    return datatypeLibraryRepository.findAll();
  }


  @Override
  public void delete(CompositeKey id) {
    // TODO Auto-generated method stub
    datatypeLibraryRepository.findOne(id);
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
    emptyLibrary.setMetaData(new LibraryMetaData());
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


}
