package gov.nist.hit.hl7.igamt.ig.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;

@Service("igService")
public interface IgService {



  public Ig findById(CompositeKey id);

  public List<Ig> findAll();

  public void delete(CompositeKey id);

  public Ig save(Ig ig);

  public List<Ig> findByUsername(String username);

  public List<Ig> findLatestByUsername(String username);

  public Ig findLatestById(String id);

  public List<Ig> finByScope(String string);

  public Ig CreateEmptyIg()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

  List<Ig> findIgIdsForUser(String username);

  public List<IgSummary> convertListToDisplayList(List<Ig> igdouments);

  public Ig findIgContentById(String id);

  public Ig findIgMetadataById(String id);



}

