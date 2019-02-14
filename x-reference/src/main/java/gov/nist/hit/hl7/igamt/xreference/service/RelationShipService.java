package gov.nist.hit.hl7.igamt.xreference.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;

public interface RelationShipService {
  
  public List<RelationShip> findAllDependencies(String id);
  public void deleteDependencies(String id);
  public List<RelationShip> findCrossReferences(String id);
  public RelationShip save(RelationShip relation);
  public void saveAll(List<RelationShip> relations);

}
