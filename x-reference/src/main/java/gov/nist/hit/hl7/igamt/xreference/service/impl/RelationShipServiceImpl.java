package gov.nist.hit.hl7.igamt.xreference.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.xreference.model.ReferenceType;
import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
import gov.nist.hit.hl7.xreference.igamt.repository.RelationShipRepository;
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
@Override
public List<RelationShip> findAll() {
	// TODO Auto-generated method stub
	System.out.println(repo.findAll());
	return (List<RelationShip>) repo.findAll();
}
@Override
public void deleteAll() {
	// TODO Auto-generated method stub
	repo.deleteAll();
}
@Override
public List<RelationShip> findByPath(String path) {
	// TODO Auto-generated method stub
	return repo.findByPath(path);
}


}
