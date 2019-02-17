package gov.nist.hit.hl7.igamt.xreference.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.xreference.model.ReferenceType;
import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;

public interface RelationShipService {
  
  public List<RelationShip> findAllDependencies(String id);
  public void deleteDependencies(String id);
  public List<RelationShip> findCrossReferences(String id);
  public RelationShip save(RelationShip relation);
  public List<RelationShip> findAll();
  public void deleteAll();
  public void saveAll(List<RelationShip> relations);
  List<RelationShip> findByPath(String path);


}
