package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.service.VerificationEntryService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

public abstract class VerificationUtils {

    @Autowired
    protected VerificationEntryService entry;
    @Autowired
    private ConfigService configService;

    public List<IgamtObjectError> process(ResourceSkeleton context, PropertyType propertyType, String pathId, Function<ResourceSkeletonBone, List<IgamtObjectError>> verify) {
        try {
            ResourceSkeletonBone target = context.get(pathId);
            if(target == null) {
                return Collections.singletonList(
                        this.entry.PathNotFound(
                                new Location(pathId, propertyType),
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
                            new Location(pathId, propertyType),
                            e.getId(),
                            e.getType()
                    )
            );
        }
    }

    public List<IgamtObjectError> getTargetAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, String name, InstancePath child, ResourceSkeleton use, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        if(child != null) {
            try {
                ResourceSkeletonBone target = context.get(child);
                if(target == null) {
                    return Collections.singletonList(
                            this.entry.PathNotFound(
                                    new Location(pathId, name, propertyType),
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
                                new Location(pathId, name, propertyType),
                                e.getId(),
                                e.getType()
                        )
                );
            }
        } else {
            if(use == null) {
                return Collections.singletonList(
                        this.entry.PathNotFound(
                                new Location(pathId, name, propertyType),
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
        return this.getTargetAndVerify(context, propertyType, pathId, null, child, context, qualifier, verify);
    }

    public List<IgamtObjectError> getTargetOrFailAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, InstancePath child, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        return this.getTargetAndVerify(context, propertyType, pathId, null, child, null, qualifier, verify);
    }

    public List<IgamtObjectError> getTargetAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, InstancePath child, String qualifier, String name, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        return this.getTargetAndVerify(context, propertyType, pathId, name, child, context, qualifier, verify);
    }

    public List<IgamtObjectError> getTargetOrFailAndVerify(ResourceSkeleton context, PropertyType propertyType, String pathId, String name, InstancePath child, String qualifier, Function<ResourceSkeleton, List<IgamtObjectError>> verify) {
        return this.getTargetAndVerify(context, propertyType, pathId, name, child, null, qualifier, verify);
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

    public boolean isAllowedLocation(BindingInfo bindingInfo, String version, int location, Type type, String parent) {
        if(bindingInfo.isLocationIndifferent()) return true;
        if(bindingInfo.getLocationExceptions() != null) {
            return bindingInfo.getLocationExceptions().stream().anyMatch((bli) -> bli.getLocation() == location && bli.getType().equals(type) && bli.getVersion().contains(version) && bli.getName().equals(parent));
        } else {
            return false;
        }
    }

    public BindingInfo getBindingInfo(String resourceName) {
        Config config = this.configService.findOne();
        return config.getValueSetBindingConfig().getOrDefault(resourceName, null);
    }

    public boolean isValidBindingLocations(List<BindingLocationOption> valid, Set<Integer> actual) {
        return valid.stream().anyMatch((blo) -> blo.getValue().containsAll(actual));
    }
}
