package gov.nist.hit.hl7.igamt.ig.service;

import java.util.List;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;

@Service("igService")
public interface IgService {
	
	
	
	  public Ig findById(CompositeKey id);
	  public List<Ig> findAll();
	  public void delete(CompositeKey id);
	  public Ig save(Ig ig);

}
