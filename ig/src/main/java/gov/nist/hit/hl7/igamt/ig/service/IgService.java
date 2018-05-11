package gov.nist.hit.hl7.igamt.ig.service;

import java.util.List;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;

@Service("igService")
public interface IgService {
	
	
	
	  public Ig findById(CompositeKey id);
	  public List<Ig> findAll();
	  public void delete(CompositeKey id);
	  public Ig save(Ig ig);
	  public List<Ig> findByUsername(String username);
	  public IGDisplay convertDomainToModel(Ig ig);
	  public Ig ConvertModelToDomain(IGDisplay ig);
	  public List<Ig> findLatestByUsername(String username);
	  public Ig findLatestById(String id);
	  public List<IgSummary> convertListToDisplayList(List<Ig> igdouments);
		
}
