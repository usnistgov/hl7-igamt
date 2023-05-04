package gov.nist.hit.hl7.igamt.workspace.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;

@Repository
public interface WorkspaceRepo extends MongoRepository<Workspace, String>{

	List<Workspace> findByUsername(String username);

}
