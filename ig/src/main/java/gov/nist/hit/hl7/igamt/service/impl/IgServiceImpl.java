package gov.nist.hit.hl7.igamt.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
@Service("igService")
public class IgServiceImpl implements IgService{
	
	@Autowired
	IgRepository igRepository;

	@Override
	public Ig findById(CompositeKey id) {
		// TODO Auto-generated method stub
		return igRepository.findOne(id);
	}

	@Override
	public List<Ig> findAll() {
		// TODO Auto-generated method stub
		return igRepository.findAll();
	}

	@Override
	public void delete(CompositeKey id) {
		// TODO Auto-generated method stub
		igRepository.delete(id);
	}

	@Override
	public Ig save(Ig ig) {
		// TODO Auto-generated method stub
		return igRepository.save(ig);
	}

}
