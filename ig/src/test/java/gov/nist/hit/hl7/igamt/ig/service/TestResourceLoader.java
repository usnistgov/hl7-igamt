package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintGroupRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.ig.mock.model.IgMock;
import gov.nist.hit.hl7.igamt.ig.mock.model.ResourceSet;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestResourceLoader {

	@Autowired
	private SegmentRepository segmentRepository;
	@Autowired
	private DatatypeRepository datatypeRepository;
	@Autowired
	private ValuesetRepository valuesetRepository;
	@Autowired
	private ConformanceProfileRepository conformanceProfileRepository;
	@Autowired
	private CoConstraintGroupRepository coConstraintGroupRepository;
	@Autowired
	private IgRepository igRepository;

	public void loadResourceSet(ResourceSet resourceSet) {
		this.segmentRepository.saveAll(resourceSet.getSegments());
		this.datatypeRepository.saveAll(resourceSet.getDatatypes());
		this.valuesetRepository.saveAll(resourceSet.getValueSets());
		this.conformanceProfileRepository.saveAll(resourceSet.getConformanceProfiles());
		this.coConstraintGroupRepository.saveAll(resourceSet.getCoConstraintGroups());
	}

	public void loadImplementationGuide(IgMock igMock) {
		this.loadResourceSet(igMock.getResources());
		this.igRepository.save(igMock.getIg());
	}

	public void clear() {
		this.segmentRepository.deleteAll();
		this.datatypeRepository.deleteAll();
		this.valuesetRepository.deleteAll();
		this.conformanceProfileRepository.deleteAll();
		this.coConstraintGroupRepository.deleteAll();
		this.igRepository.deleteAll();
	}

}
