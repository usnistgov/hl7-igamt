package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;


import java.util.List;

public class EvaluatedCompositeProfile {
    DataFragment<ConformanceProfile> resources;
    List<GeneratedResourceMetadata> generatedResourceMetadataList;

    public EvaluatedCompositeProfile(DataFragment<ConformanceProfile> resources, List<GeneratedResourceMetadata> generatedResourceMetadataList) {
        this.resources = resources;
        this.generatedResourceMetadataList = generatedResourceMetadataList;
    }

    public DataFragment<ConformanceProfile> getResources() {
        return resources;
    }

    public void setResources(DataFragment<ConformanceProfile> resources) {
        this.resources = resources;
    }

    public List<GeneratedResourceMetadata> getGeneratedResourceMetadataList() {
        return generatedResourceMetadataList;
    }

    public void setGeneratedResourceMetadataList(List<GeneratedResourceMetadata> generatedResourceMetadataList) {
        this.generatedResourceMetadataList = generatedResourceMetadataList;
    }
}
