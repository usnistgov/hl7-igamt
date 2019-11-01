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

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
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
	public Valueset findById(String id) {
		return valuesetRepository.findById(id).orElse(null);
	}

	@Override
	public Valueset create(Valueset valueset) {
		valueset.setId(new String());
		valueset = valuesetRepository.save(valueset);
		return valueset;
	}

	@Override
	public Valueset createFromLegacy(Valueset valueset, String legacyId) {
		valueset.setId(new String(legacyId));
		valueset = valuesetRepository.save(valueset);
		return valueset;
	}

	@Override
	public Valueset save(Valueset valueset) {
		// valueset.setId(StringUtil.updateVersion(valueset.getId()));
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
	public void delete(String id) {
		valuesetRepository.deleteById(id);
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
		return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
	}

	@Override
	public List<Valueset> findByBindingIdentifier(String bindingIdentifier) {
		// TODO Auto-generated method stub
		return valuesetRepository.findByBindingIdentifier(bindingIdentifier);
	}

	@Override
	public List<Valueset> findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(String scope,
			String version, String bindingIdentifier) {
		// TODO Auto-generated method stub
		return valuesetRepository.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(scope,
				version, bindingIdentifier);
	}

	@Override
	public List<Valueset> findByDomainInfoVersionAndBindingIdentifier(String version,
			String bindingIdentifier) {
		// TODO Auto-generated method stub
		return valuesetRepository.findByDomainInfoVersionAndBindingIdentifier(version,
				bindingIdentifier);
	}

	@Override
	public List<Valueset> findByDomainInfoScopeAndBindingIdentifier(String scope,
			String bindingIdentifier) {
		// TODO Auto-generated method stub
		return valuesetRepository.findByDomainInfoScopeAndBindingIdentifier(scope, bindingIdentifier);
	}


	@Override
	public Valueset getLatestById(String id) {
		// TODO Auto-generated method stub Query query = new Query();
		Query query = new Query();

		query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
		Valueset valueset = mongoTemplate.findOne(query, Valueset.class);
		return valueset;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.valueset.service.ValuesetService#findDisplayFormatByScopeAndVersion(java
	 * .lang.String, java.lang.String)
	 */
	@Override
	public List<Valueset> findDisplayFormatByScopeAndVersion(String scope, String version) {
		// TODO Auto-generated method stub
		Criteria where = Criteria.where("domainInfo.scope").is(scope);
		where.andOperator(Criteria.where("domainInfo.version").is(version));
		Query qry = Query.query(where);
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("bindingIdentifier");
		qry.fields().include("numberOfCodes");
		List<Valueset> valueSets = mongoTemplate.find(qry, Valueset.class);
		return valueSets;
	}

	@Override
	public List<Valueset> findDisplayFormatByScope(String scope) {
		// TODO Auto-generated method stub
		Criteria where = Criteria.where("domainInfo.scope").is(scope);
		Query qry = Query.query(where);
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("bindingIdentifier");
		qry.fields().include("numberOfCodes");
		List<Valueset> valueSets = mongoTemplate.find(qry, Valueset.class);
		return valueSets;
	}

	private boolean exist(String codeSystemId, Set<String> codeSystemIds) {
		for (String csId : codeSystemIds) {
			if (csId.equals(codeSystemId))
				return true;
		}
		return false;
	}

	@Override
	public Link cloneValueSet(String newkey, Link l, String username, Scope scope) {
		Valueset old = this.findById(l.getId());
		Valueset elm = old.clone();
		elm.getDomainInfo().setScope(scope);
		elm.setOrigin(l.getId());
		elm.setFrom(l.getId());
		Link newLink = new Link();
		newLink.setOrigin(elm.getId());
		newLink = l.clone(newkey);
		newLink.setOrigin(l.getId());
		newLink.setDomainInfo(elm.getDomainInfo());
		elm.setId(newkey);
		elm.setUsername(username);
		this.save(elm);
		return newLink;
	}

	@Override
	public List<Valueset> findByIdIn(Set<String> ids) {
		// TODO Auto-generated method stub
		return valuesetRepository.findByIdIn(ids);
	}

	@Override
	public void applyChanges(Valueset s, List<ChangeItemDomain> cItems, String documentId)
			throws JsonProcessingException, IOException {
		Collections.sort(cItems);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		for (ChangeItemDomain item : cItems) {
			if (item.getPropertyType().equals(PropertyType.PREDEF)) {
				item.setOldPropertyValue(s.getPreDef());
				s.setPreDef((String) item.getPropertyValue());

			} else if (item.getPropertyType().equals(PropertyType.POSTDEF)) {
				item.setOldPropertyValue(s.getPostDef());
				s.setPostDef((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.AUTHORNOTES)) {
				item.setOldPropertyValue(s.getAuthorNotes());
				s.setAuthorNotes((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.USAGENOTES)) {
				item.setOldPropertyValue(s.getUsageNotes());
				s.setUsageNotes((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.BINDINGIDENTIFIER)) {
				item.setOldPropertyValue(s.getBindingIdentifier());
				s.setBindingIdentifier((String) item.getPropertyValue());
			}
			else if (item.getPropertyType().equals(PropertyType.CODES)) {
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				item.setOldPropertyValue(s.getCodes());
				Set<Code> codes= mapper.readValue(jsonInString, new TypeReference<Set<Code>>() {});
				s.setCodes(codes);
			}
			else if (item.getPropertyType().equals(PropertyType.CODESYSTEM)) {

				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				item.setOldPropertyValue(s.getCodeSystems());
				Set<String> codeSystems= mapper.readValue(jsonInString, new TypeReference<Set<String>>() {});
				s.setCodeSystems(codeSystems);
			}
			else if (item.getPropertyType().equals(PropertyType.URL)) {
				item.setOldPropertyValue(s.getUrl());
				s.setUrl((String) item.getPropertyValue());

			} 
			else if (item.getPropertyType().equals(PropertyType.INTENSIONALCOMMENT)) {
				item.setOldPropertyValue(s.getIntensionalComment());
				s.setIntensionalComment((String) item.getPropertyValue());

			} 
			
			else if (item.getPropertyType().equals(PropertyType.STABILITY)) {
				item.setOldPropertyValue(s.getStability());
				s.setStability(Stability.fromValue((String) item.getPropertyValue()));

			} 
			
			else if (item.getPropertyType().equals(PropertyType.EXTENSIBILITY)) {
				item.setOldPropertyValue(s.getExtensibility());
				s.setExtensibility(Extensibility.fromValue((String) item.getPropertyValue()));

			} 
			
			else if (item.getPropertyType().equals(PropertyType.CONTENTDEFINITION)) {
				item.setOldPropertyValue(s.getIntensionalComment());
				s.setContentDefinition(ContentDefinition.fromValue((String) item.getPropertyValue()));
			} 
			
		}
		this.save(s);

	}
}