package gov.nist.hit.hl7.igamt.ig.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.util.BindingSummaryFilter;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.model.CoConstraintTableReference;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.BindingSummaryItem;
import gov.nist.hit.hl7.igamt.ig.model.IgProfileResourceSubSet;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.display.model.PublishingInfo;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CompositeProfileCreationWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.exceptions.ImportValueSetException;
import gov.nist.hit.hl7.igamt.ig.model.FilterIGInput;
import gov.nist.hit.hl7.igamt.ig.model.FilterResponse;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.service.impl.exception.CoConstraintXMLSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service("igService")
public interface IgService {

  public Ig findById(String id);

  public List<Ig> findAll();

  public void delete(String id);

  public Ig save(Ig ig);

  public List<Ig> findByUsername(String username);

  public List<Ig> findByUsername(String username, Scope scope);

  public List<Ig> finByScope(String string);

  public Ig createEmptyIg() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

  public Ig createIg(CreationWrapper wrapper, String username) throws Exception;

  public List<Ig> findIgIdsForUser(String username);

  public List<DocumentSummary> convertListToDisplayList(List<Ig> igdouments);

  public Ig findIgContentById(String id);

  public Ig findIgMetadataById(String id);

  public TextSection findSectionById(Set<TextSection> content, String sectionId);

  public List<Ig> findAllUsersIG();

  public List<Ig> findAllPreloadedIG();
  
  public List<Ig> findAllSharedIG(String username, Scope scope);

  public void delete(Ig ig) throws ForbiddenOperationException;

  Set<ConformanceStatement> conformanceStatementsSummary(Ig igdoument);

  public IgDocumentConformanceStatement convertDomainToConformanceStatement(Ig igdoument);

  public IGContentMap collectData(Ig igdoument);

  public Valueset getValueSetInIg(String id, String vsId) throws ValuesetNotFoundException, IGNotFoundException;

  public IgDataModel generateDataModel(Ig ig) throws Exception;

  public InputStream exportValidationXMLByZip(IgDataModel igModel, String[] conformanceProfileIds, String[] compositeProfileIds) throws Exception;
  
  public Set<RelationShip> findUsage(Set<RelationShip> relations, Type type, String elementId);
  
  public Set<RelationShip> buildRelationShip(Ig ig, Type type);
  
  public Set<RelationShip> builAllRelations(Ig ig) ;
    
  UpdateResult updateAttribute(String id, String attributeName, Object value, Class<?> entityClass, boolean updateDate);
  IgProfileResourceSubSet getIgProfileResourceSubSet(Ig ig, Set<String> conformanceProfiles, Set<String> compositeProfiles) throws Exception;
  Ig getIgProfileResourceSubSetAsIg(Ig ig, Set<String> conformanceProfiles, Set<String> compositeProfiles) throws Exception;

  public ProfileComponent createProfileComponent(Ig ig, String name, List<DisplayElement> children);

  public CompositeProfileStructure createCompositeProfile(Ig ig,
                                                          CompositeProfileCreationWrapper wrapper);  
  public String findDefaultHL7VersionById(String id);

  String findDefaultHL7Version(Ig ig);

  void removeChildren(String id);

  void updateChildrenAttribute(Ig ig, String attributeName, Object value, boolean updateDate)
      throws IGUpdateException;

  public FilterResponse getFilterResponse(String id, FilterIGInput filter) throws EntityNotFound;

  public void publishIG(Ig ig, PublishingInfo info) throws IGNotFoundException, IGUpdateException;

  public FilterResponse getUnused(String id) throws EntityNotFound;

  public Set<String> findUnused(Ig ig, Type registryType);

  public List<String> deleteUnused(Ig ig, Type registryType, List<String> ids) throws EntityNotFound, ForbiddenOperationException;

  void lockIg(Ig ig) throws IGNotFoundException, IGUpdateException;

  String getResourceVersionSyncToken(Date updateDate);

  List<Ig> findByIdIn(List<String> ids);
  
  List<Ig> findByPrivateAudienceEditor(String username);
  List<Ig> findByPrivateAudienceViewer(String username);
  List<Ig> findByPublicAudienceAndStatusPublished();
  List<Ig> findAllPrivateIGs();
  
  public Valueset importValuesetsFromCSV(String igId, MultipartFile csvFile) throws ImportValueSetException;

  CoConstraintTable getCoConstraintTable(ConformanceProfile conformanceProfile, CoConstraintTableReference reference, boolean removeDerivedIndicator);

  List<IgamtObjectError> importCoConstraintTable(
          ConformanceProfile conformanceProfile,
          CoConstraintTableReference reference,
          CoConstraintTable table
  ) throws Exception;

  List<BindingSummaryItem> getBindingSummary(Ig ig, BindingSummaryFilter filter ) throws ResourceNotFoundException;
}
