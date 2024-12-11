package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;

import java.util.*;

public class ProfileComponentsEvaluationResult<T extends Resource> {
    DataFragment<T> resources;
    List<GeneratedResourceMetadata> generatedResourceMetadataList;

    public ProfileComponentsEvaluationResult(DataFragment<T> resources, List<GeneratedResourceMetadata> generatedResourceMetadataList) {
        this.resources = resources;
        this.generatedResourceMetadataList = generatedResourceMetadataList;
    }

    public DataFragment<T> getResources() {
        return resources;
    }

    public void setResources(DataFragment<T> resources) {
        this.resources = resources;
    }

    public List<GeneratedResourceMetadata> getGeneratedResourceMetadataList() {
        return generatedResourceMetadataList;
    }
}
