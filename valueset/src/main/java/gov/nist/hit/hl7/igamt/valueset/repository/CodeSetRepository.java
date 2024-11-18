package gov.nist.hit.hl7.igamt.valueset.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;

@Repository
public interface CodeSetRepository extends MongoRepository<CodeSet, String> {

	@Query(value = "{ '_id._id' : ?0 }")
	List<CodeSet> findByUsername(String username);

	@Query(value = "{ $and :  [{ 'audience.type' : 'PRIVATE' }, { 'audience.editor' : ?0 }] }")
	List<CodeSet> findByPrivateAudienceEditor(String username);
	  
	@Query(value = "{ $and :  [{ 'audience.type' : 'PRIVATE' }, { 'audience.viewers' : ?0 }] }")
	List<CodeSet> findByPrivateAudienceViewer(String username);

	@Query(value = "{ 'audience.type' : 'PUBLIC' }")
	List<CodeSet> findByPublicAudienceAndStatusPublished();
	  
	@Query(value = "{ 'audience.type' : 'PRIVATE' }")
	List<CodeSet> findAllPrivateCodeSet();

}
