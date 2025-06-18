package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;

import java.util.Set;

public interface IgDependencyService {
	Set<ResourceRef> collectAllConformanceProfileDependencies(ConformanceProfile conformanceProfile) throws EntityNotFound;
	Set<ResourceRef> collectAllCompositeProfileDependencies(CompositeProfileStructure compositeProfile) throws Exception;
}
