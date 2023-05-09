package gov.nist.hit.hl7.igamt.ig.repository;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

@Repository("igRepository")
public interface IgRepository extends MongoRepository<Ig, String> {

  @Query(value = "{ '_id._id' : ?0 }")
  List<Ig> findByUsername(String username);

  @Query(value = "{ $and :  [{ 'audience.type' : 'PRIVATE' }, { 'audience.editor' : ?0 }, { 'domainInfo.scope' :  'USER'}] }")
  List<Ig> findByPrivateAudienceEditor(String username);
  @Query(value = "{ $and :  [{ 'audience.type' : 'PRIVATE' }, { 'audience.viewers' : ?0 }, { 'domainInfo.scope' :  'USER'}] }")
  List<Ig> findByPrivateAudienceViewer(String username);
  @Query(value = "{ $and :  [{ 'audience.type' : 'PUBLIC' }, { status : 'PUBLISHED' }] }")
  List<Ig> findByPublicAudienceAndStatusPublished();
  @Query(value = "{ 'audience.type' : 'PRIVATE'}")
  List<Ig> findAllPrivateIGs();

  @Query(value = "{ '_id._id' : ?0 }")
  List<Ig> findLatestById(ObjectId id, Sort sort);

  List<Ig> findByDomainInfoScope(String scope);

  @Query(value = "{ 'username' : ?0 }", fields = "{_id : 1}")
  List<Ig> findIgIdsForUser(String username);

  @Query(value = "{ '_id' : ?0, 'datatypeRegistry.children._id' : { $all : [ ?1, ?2 ] } }",
      exists = true)
  boolean datatypesInSameIg(ObjectId igId, ObjectId dtSourceId, ObjectId dtTargetId);

  @Query(value = "{ '_id' : ?0, 'segmentRegistry.children._id' : { $all : [ ?1, ?2 ] } }",
      exists = true)
  boolean segmentsInSameIg(ObjectId igId, ObjectId segSourceId, ObjectId segTargetId);

  @Query(
      value = "{ '_id' : ?0, 'conformanceProfileRegistry.children._id' : { $all : [ ?1, ?2 ] } }",
      exists = true)
  boolean conformanceProfilesInSameIg(ObjectId igId, ObjectId cpSourceId, ObjectId cpTargetId);
  List<Ig> findByDerived(boolean derived);
  
  List<Ig> findByIdIn(List<String> ids);

}
