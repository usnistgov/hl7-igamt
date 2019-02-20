package gov.nist.hit.hl7.xreference.igamt.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;

@Repository
public interface RelationShipRepository extends CrudRepository<RelationShip, String> {
  
  
 List<RelationShip> findByChild(String id);
 List<RelationShip> findByParent(String id);
 void deleteByParent(String id);
 void deleteByChild(String id);
 List<RelationShip> findByPath(String path);
 
 

  
}
