package gov.nist.hit.hl7.igamt.xreference.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;

@Repository
public interface RelationShipRepository extends CrudRepository<RelationShip, String> {
  
  
 List<RelationShip> findByUsesId(String id);
 List<RelationShip> findByUsedInId(String id);
 void deleteByUsedInId(String id);
 void deleteByUsesId(String id);
 
 

  
}
