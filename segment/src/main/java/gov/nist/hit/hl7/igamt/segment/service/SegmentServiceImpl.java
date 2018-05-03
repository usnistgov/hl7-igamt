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
package gov.nist.hit.hl7.igamt.segment.service;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.util.CompositeKeyUtil;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */

@Service("segmentService")
public class SegmentServiceImpl implements SegmentService {

  @Autowired
  private SegmentRepository segmentRepository;
  @Autowired
  private MongoTemplate mongoTemplate;
  
  @Override
  public Segment findByKey(CompositeKey key) {
    return segmentRepository.findOne(key);
  }
  
  @Override
  public Segment create(Segment segment) {
    segment.setId(new CompositeKey());
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public Segment save(Segment segment) {
   // segment.setId(CompositeKeyUtil.updateVersion(segment.getId()));
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public List<Segment> findAll() {
    return segmentRepository.findAll();
  }

  @Override
  public void delete(Segment segment) {
    segmentRepository.delete(segment);
  }

  @Override
  public void delete(CompositeKey key) {
    segmentRepository.delete(key);
  }

  @Override
  public void removeCollection() {
    segmentRepository.deleteAll();
  }

@Override
public List<Segment> findByDomainInfoVersion(String version) {
	// TODO Auto-generated method stub
	return segmentRepository.findByDomainInfoVersion(version) ;
}

@Override
public List<Segment> findByDomainInfoScope(String scope) {
	// TODO Auto-generated method stub
	return findByDomainInfoScope(scope);
}

@Override
public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String version) {
	// TODO Auto-generated method stub
	return segmentRepository.findByDomainInfoScopeAndDomainInfoVersion(scope,version);
}

@Override
public List<Segment> findByName(String name) {
	// TODO Auto-generated method stub
	return segmentRepository.findByName(name);
}

@Override
public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name) {
	// TODO Auto-generated method stub
	return segmentRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope,version,name);
}

@Override
public List<Segment> findByDomainInfoVersionAndName(String version, String name) {
	// TODO Auto-generated method stub
	return  segmentRepository.findByDomainInfoVersionAndName(version,name);
}

@Override
public List<Segment> findByDomainInfoScopeAndName(String scope, String name) {
	// TODO Auto-generated method stub
	return segmentRepository.findByDomainInfoScopeAndName(scope,name);
}
@Override  
public Segment getLatestById(String id) {
	  Query query = new Query();
	  query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
	  query.with(new Sort(Sort.Direction.DESC, "_id.version"));
	  query.limit(1);
	  Segment segment = mongoTemplate.findOne(query, Segment.class);
	  return segment;
	}
}
