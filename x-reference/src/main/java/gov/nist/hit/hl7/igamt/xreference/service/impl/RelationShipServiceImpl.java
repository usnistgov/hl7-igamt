package gov.nist.hit.hl7.igamt.xreference.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.xreference.repository.RelationShipRepository;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;

@Service
public class RelationShipServiceImpl implements RelationShipService {

	@Autowired
	RelationShipRepository repo;

	@Override
	public List<RelationShip> findAllDependencies(String id) {
		return repo.findByParentId(id);
	}

	@Override
	public void deleteDependencies(String id) {
		repo.deleteByParentId(id);
	}

	@Override
	public List<RelationShip> findCrossReferences(String id) {
		return repo.findByChildId(id);
	}

	@Override
	public RelationShip save(RelationShip relation) {
		return repo.save(relation);
	}

	@Override
	public void saveAll(Set<RelationShip> relations) {
		repo.saveAll(relations);
	}

	@Override
	public List<RelationShip> findAll() {
		return (List<RelationShip>) repo.findAll();
	}

	@Override
	public void deleteAll() {
		repo.deleteAll();
	}

}
