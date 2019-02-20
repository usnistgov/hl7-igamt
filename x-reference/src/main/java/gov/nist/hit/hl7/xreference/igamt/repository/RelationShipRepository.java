package gov.nist.hit.hl7.xreference.igamt.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;

@Repository
public interface RelationShipRepository extends CrudRepository<RelationShip, String> {
  
  
 List<RelationShip> findByChildId(String id);
 List<RelationShip> findByParentId(String id);
 void deleteByParentId(String id);
 void deleteByChildId(String id);
 List<RelationShip> findByPath(String path);
 
 

  
}
