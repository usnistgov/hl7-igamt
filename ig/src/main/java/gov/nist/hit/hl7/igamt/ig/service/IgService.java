package gov.nist.hit.hl7.igamt.ig.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service("igService")
public interface IgService {

	public Ig findById(String id);

	public List<Ig> findAll();

	public void delete(String id);

	public Ig save(Ig ig);

	public Ig clone(Ig ig, String username);

	public List<Ig> findByUsername(String username);

	public List<Ig> findByUsername(String username, Scope scope);

	public List<Ig> finByScope(String string);

	public Ig createEmptyIg() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

	public List<Ig> findIgIdsForUser(String username);

	public List<IgSummary> convertListToDisplayList(List<Ig> igdouments);

	public Ig findIgContentById(String id);

	public Ig findIgMetadataById(String id);

	public TextSection findSectionById(Set<TextSection> content, String sectionId);

	UpdateResult updateAttribute(String id, String attributeName, Object value);

	public List<Ig> findAllUsersIG();

	public List<Ig> findAllPreloadedIG();

	public void delete(Ig ig);

	public IgDocumentConformanceStatement convertDomainToConformanceStatement(Ig igdoument);

	public IGContentMap collectData(Ig igdoument);

	void buildDependencies(IGContentMap contentMap);


	public Valueset getValueSetInIg(String id, String vsId) throws ValuesetNotFoundException, IGNotFoundException;

	public IgDataModel generateDataModel(Ig ig) throws Exception;

	public InputStream exportValidationXMLByZip(IgDataModel igModel, String[] conformanceProfileIds, String[] compositeProfileIds) throws CloneNotSupportedException, IOException, ClassNotFoundException, ProfileSerializationException, TableSerializationException;

}
