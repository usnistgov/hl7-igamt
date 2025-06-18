package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCreationService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.service.IgDependencyService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class IgDependencyServiceImpl implements IgDependencyService {
	@Autowired
	ConformanceProfileDependencyService conformanceProfileDependencyService;
	@Autowired
	InMemoryDomainExtensionService inMemoryDomainExtensionService;
	@Autowired
	ConformanceProfileCreationService composer;


	@Override
	public Set<ResourceRef> collectAllConformanceProfileDependencies(ConformanceProfile conformanceProfile) throws EntityNotFound {
		Set<ResourceRef> resources = new HashSet<>();
		ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService.getDependencies(conformanceProfile, new DependencyFilter());
		dependencies.getSegments().forEach((k, v) -> resources.add(new ResourceRef(Type.SEGMENT, k)));
		dependencies.getDatatypes().forEach((k, v) -> resources.add(new ResourceRef(Type.DATATYPE, k)));
		dependencies.getValuesets().forEach((k, v) -> resources.add(new ResourceRef(Type.VALUESET, k)));
		return resources;
	}

	@Override
	public Set<ResourceRef> collectAllCompositeProfileDependencies(CompositeProfileStructure compositeProfile) throws Exception {
		ProfileComponentsEvaluationResult<ConformanceProfile> profileComponentsEvaluationResult = composer.create(compositeProfile);
		DataFragment<ConformanceProfile> generated = profileComponentsEvaluationResult.getResources();
		String domainExtensionToken = this.inMemoryDomainExtensionService.put(generated.getContext(), generated.getPayload());
		Set<ResourceRef> generatedResourceRefs = generated.getContext().getResources().stream()
				.map((r) -> new ResourceRef(r.getType(), r.getId()))
				.collect(Collectors.toSet());
		try {
			Set<ResourceRef> dependencies = collectAllConformanceProfileDependencies(generated.getPayload());
			dependencies.removeAll(generatedResourceRefs);
			return dependencies;
		} finally {
			this.inMemoryDomainExtensionService.clear(domainExtensionToken);
		}
	}
}
