package gov.nist.hit.hl7.igamt.xreference.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;
import gov.nist.hit.hl7.igamt.xreference.repository.RelationShipRepository;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
@Service
public class RelationShipServiceImpl implements RelationShipService {
  
  
  @Autowired
  RelationShipRepository repo;
  

  
  @Override
  public List<RelationShip> findAllDependencies(String id){
    
   return repo.findByUsedInId(id);
    
  }
  @Override
  public void deleteDependencies(String id){
    
    repo.deleteByUsedInId(id);
     
  }
  @Override
  public List<RelationShip> findCrossReferences(String id){
    return repo.findByUsesId(id);
  }
  
  
  @Override
  public RelationShip save(RelationShip relation){
    return repo.save(relation);
  }
  
  
  @Override
  public void saveAll(List<RelationShip> relations){
    repo.saveAll(relations);
  }


}
