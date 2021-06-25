package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyRef;


import java.util.*;

public class ProfileComponentsEvaluationResult<T extends Resource> {
    DataFragment<T> resources;
    List<GeneratedResourceMetadata> generatedResourceMetadataList;

    public ProfileComponentsEvaluationResult(DataFragment<T> resources, List<GeneratedResourceMetadata> generatedResourceMetadataList) {
        this.resources = resources;
        this.generatedResourceMetadataList = generatedResourceMetadataList;
    }

    public ProfileComponentsEvaluationResult() {
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

    public void setGeneratedResourceMetadataList(List<GeneratedResourceMetadata> generatedResourceMetadataList) {
        this.generatedResourceMetadataList = generatedResourceMetadataList;
    }

    public Map<PropertyType, Set<String>> getChangedReferences() {
        Map<PropertyType, Set<String>> refs = new HashMap<>();
        refs.put(PropertyType.DATATYPE, new HashSet<>());
        refs.put(PropertyType.SEGMENTREF, new HashSet<>());

        for(GeneratedResourceMetadata rmd: generatedResourceMetadataList) {
            Map<String, Map<PropertyType, ItemProperty>> changes = rmd.getChanges();
            for(Map<PropertyType, ItemProperty> change: changes.values()) {
                if(change.containsKey(PropertyType.DATATYPE)) {
                    refs.get(PropertyType.DATATYPE).add(((PropertyDatatype) change.get(PropertyType.DATATYPE)).getDatatypeId());
                }

                if(change.containsKey(PropertyType.SEGMENTREF)) {
                    refs.get(PropertyType.SEGMENTREF).add(((PropertyRef) change.get(PropertyType.SEGMENTREF)).getRef());
                }
            }
        }

        return refs;
    }
}
