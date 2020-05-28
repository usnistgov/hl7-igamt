package gov.nist.hit.hl7.igamt.common.base.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;

@Repository("documentStructureRepository")
	public interface DocumentStructureRepository extends MongoRepository<DocumentStructure, String> {
	
	  public DocumentStructure findOneById(String id);


}
