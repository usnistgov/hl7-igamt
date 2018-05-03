/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.util.CompositeKeyUtil;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("valuesetService")
public class ValuesetServiceImpl implements ValuesetService {

  @Autowired
  private ValuesetRepository valuesetRepository;
  
  @Autowired
  private MongoTemplate mongoTemplate;
  
  @Override
  public Valueset findById(CompositeKey id) {
    return valuesetRepository.findOne(id);
  }
  
  @Override
  public Valueset create(Valueset valueset) {
    valueset.setId(new CompositeKey());
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }
  
  @Override
  public Valueset createFromLegacy(Valueset valueset, String legacyId) {
    valueset.setId(new CompositeKey(legacyId));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset save(Valueset valueset) {
    valueset.setId(CompositeKeyUtil.updateVersion(valueset.getId()));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public List<Valueset> findAll() {
    return valuesetRepository.findAll();
  }

  @Override
  public void delete(Valueset valueset) {
    valuesetRepository.delete(valueset);
  }

  @Override
  public void delete(CompositeKey id) {
    valuesetRepository.delete(id);
  }

  @Override
  public void removeCollection() {
    valuesetRepository.deleteAll();
  }

@Override
public List<Valueset> findByDomainInfoVersion(String version) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoVersion(version);
}

@Override
public List<Valueset> findByDomainInfoScope(String scope) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoScope(scope);
}

@Override
public List<Valueset> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersion(scope,  verion);
}

@Override
public List<Valueset> findByBindingIdentifier(String bindingIdentifier) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByBindingIdentifier(bindingIdentifier);
}

@Override
public List<Valueset> findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(String scope, String version,
		String bindingIdentifier) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(scope, version, bindingIdentifier);
}

@Override
public List<Valueset> findByDomainInfoVersionAndBindingIdentifier(String version, String bindingIdentifier) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoVersionAndBindingIdentifier(version,  bindingIdentifier) ;
}

@Override
public List<Valueset> findByDomainInfoScopeAndBindingIdentifier(String scope, String bindingIdentifier) {
	// TODO Auto-generated method stub
	return valuesetRepository.findByDomainInfoScopeAndBindingIdentifier(scope, bindingIdentifier);
}

@Override
public Valueset getLatestById(String id) {
	// TODO Auto-generated method stub  Query query = new Query();
	  Query query = new Query();

	  query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
	  query.with(new Sort(Sort.Direction.DESC, "_id.version"));
	  query.limit(1);
	  Valueset valueset = mongoTemplate.findOne(query, Valueset.class);
	  return valueset;
}
  
}
