package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.service.VerificationEntryService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;
import java.util.function.Function;

public abstract class VerificationUtils {

    @Autowired
    protected VerificationEntryService entry;

    public List<IgamtObjectError> process(ResourceSkeleton context, PropertyType propertyType, String pathId, Function<ResourceSkeletonBone, List<IgamtObjectError>> verify) {
        try {
            ResourceSkeletonBone target = context.get(pathId);
            if(target == null) {
                return Collections.singletonList(
                        this.entry.PathNotFound(
                                pathId,
                                propertyType,
                                context.getResource().getId(),
                                context.getResource().getType(),
                                pathId,
                                "Binding Target"
                        )
                );
            } else {
                return verify.apply(target);
            }
        } catch (ResourceNotFoundException e) {
            return Collections.singletonList(
                    this.entry.ResourceNotFound(
                            pathId,
                            propertyType,
                            e.getId(),
                            e.getType()
                    )
            );
        }
    }

    public List<IgamtObjectError> getTargetAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, InstancePath child, ResourceSkeleton use, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        if(child != null) {
            try {
                ResourceSkeletonBone target = context.get(child);
                if(target == null) {
                    return Collections.singletonList(
                            this.entry.PathNotFound(
                                    pathId,
                                    propertyType,
                                    context.getResource().getId(),
                                    context.getResource().getType(),
                                    child.toString(),
                                    qualifier
                            )
                    );
                } else {
                    return verify.apply(target);
                }
            } catch (ResourceNotFoundException e) {
                return Collections.singletonList(
                        this.entry.ResourceNotFound(
                                pathId,
                                propertyType,
                                e.getId(),
                                e.getType()
                        )
                );
            }
        } else {
            if(use == null) {
                return Collections.singletonList(
                        this.entry.PathNotFound(
                                pathId,
                                propertyType,
                                context.getResource().getId(),
                                context.getResource().getType(),
                                "[EMPTY]",
                                qualifier
                        )
                );
            } else {
                return verify.apply(use);
            }
        }
    }

    public List<IgamtObjectError> getTargetAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, InstancePath child, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        return this.getTargetAndVerify(context, propertyType, pathId, child, context, qualifier, verify);
    }

    public List<IgamtObjectError> getTargetOrFailAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, InstancePath child, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        return this.getTargetAndVerify(context, propertyType, pathId, child, null, qualifier, verify);
    }

    public List<IgamtObjectError> NoErrors() {
        return Collections.emptyList();
    }

    private String getLabel(DisplayElement displayElement) {
        String label = displayElement.getFixedName();
        if(!Strings.isNullOrEmpty(displayElement.getVariableName())) {
            label += "_" + displayElement.getVariableName();
        }
        label += " v" + displayElement.getDomainInfo().getVersion();
        return label;
    }
}
