package gov.nist.hit.hl7.igamt.ig.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service("igService")
public interface IgService {

  public Ig findById(String id);

  public List<Ig> findAll();

  public void delete(String id);

  public Ig save(Ig ig);

  public Ig clone(Ig ig, String username, CopyInfo info);

  public List<Ig> findByUsername(String username);

  public List<Ig> findByUsername(String username, Scope scope);

  public List<Ig> finByScope(String string);

  public Ig createEmptyIg() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

  public List<Ig> findIgIdsForUser(String username);

  public List<DocumentSummary> convertListToDisplayList(List<Ig> igdouments);

  public Ig findIgContentById(String id);

  public Ig findIgMetadataById(String id);

  public TextSection findSectionById(Set<TextSection> content, String sectionId);

  //UpdateResult updateAttribute(String id, String attributeName, Object value);

  public List<Ig> findAllUsersIG();

  public List<Ig> findAllPreloadedIG();
  
  public List<Ig> findAllSharedIG(String username, Scope scope);

  public void delete(Ig ig);

  Set<ConformanceStatement> conformanceStatementsSummary(Ig igdoument);

  public IgDocumentConformanceStatement convertDomainToConformanceStatement(Ig igdoument);

  public IGContentMap collectData(Ig igdoument);

  void buildDependencies(IGContentMap contentMap);


  public Valueset getValueSetInIg(String id, String vsId) throws ValuesetNotFoundException, IGNotFoundException;

  public IgDataModel generateDataModel(Ig ig) throws Exception;

  public InputStream exportValidationXMLByZip(IgDataModel igModel, String[] conformanceProfileIds, String[] compositeProfileIds) throws CloneNotSupportedException, IOException, ClassNotFoundException, ProfileSerializationException, TableSerializationException;
  public Set<RelationShip> findUsage(Set<RelationShip> relations, Type type, String elementId);
  public Set<RelationShip> buildRelationShip(Ig ig, Type type);
  public Set<RelationShip> builAllRelations(Ig ig) ;
  public void publishIG(Ig ig) throws IGNotFoundException, IGUpdateException;
  UpdateResult updateAttribute(String id, String attributeName, Object value, Class<?> entityClass);
  public void updateSharedUser(String id, SharedUsersInfo sharedUsersInfo);
  public Ig makeSelectedIg(Ig ig, ReqId reqIds);
  public void visitSegmentRefOrGroup(Set<SegmentRefOrGroup> srgs, Ig selectedIg, Ig all);
  public void collectVS(Set<StructureElementBinding> sebs, Ig selectedIg, Ig all);
  public void visitSegment(Set<Field> fields, Ig selectedIg, Ig all);
  public void visitDatatype(Set<Component> components, Ig selectedIg, Ig all);
}
