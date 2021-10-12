package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class VocabularyBindingVerificationService extends VerificationUtils {

    @Autowired
    private ConfigService configService;

    public List<IgamtObjectError> verifyValueSetBinding(ResourceSkeleton resourceSkeleton, String pathId, Set<ValuesetBinding> valuesetBindings) {
        List<IgamtObjectError> errors = new ArrayList<>();
        return this.process(
                resourceSkeleton,
                PropertyType.VALUESET,
                pathId,
                (target) -> {
                    BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
                    if(bindingInfo != null &&
                            isAllowedLocation(
                                    bindingInfo,
                                    target.getParent().getDomainInfo().getVersion(),
                                    target.getPosition(),
                                    target.getLocationInfo().getType(),
                                    target.getParent().getFixedName())
                    ) {
                        if(!bindingInfo.isMultiple() && valuesetBindings.size() > 1) {
                            errors.add(
                                    this.entry.MultipleValueSetNotAllowed(
                                            pathId,
                                            target.getLocationInfo(),
                                            resourceSkeleton.getResource().getId(),
                                            resourceSkeleton.getResource().getType()
                                    )
                            );
                        }
                        String versionKey = target.getResource().getDomainInfo().getVersion().replace(".", "-");
                        List<BindingLocationOption> validLocation = bindingInfo.getAllowedBindingLocations() != null ? bindingInfo.getAllowedBindingLocations().get(versionKey) : Collections.emptyList();
                        for(ValuesetBinding vsBinding: valuesetBindings) {
                            if(validLocation != null) {
                                if(vsBinding.getValuesetLocations() == null || vsBinding.getValuesetLocations().size() == 0) {
                                    errors.add(
                                            this.entry.InvalidBindingLocation(
                                                    pathId,
                                                    target.getLocationInfo(),
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    vsBinding.getValuesetLocations(),
                                                    "Element is complex"
                                            )
                                    );
                                } else if(!isValidBindingLocations(validLocation, vsBinding.getValuesetLocations())) {
                                    errors.add(
                                            this.entry.InvalidBindingLocation(
                                                    pathId,
                                                    target.getLocationInfo(),
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    vsBinding.getValuesetLocations(),
                                                    "Element does not exist"
                                            )
                                    );
                                }
                            } else {
                                if(vsBinding.getValuesetLocations() != null && vsBinding.getValuesetLocations().size() > 0) {
                                    errors.add(
                                            this.entry.InvalidBindingLocation(
                                                    pathId,
                                                    target.getLocationInfo(),
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    vsBinding.getValuesetLocations(),
                                                    "Element is primitive"
                                            )
                                    );
                                }
                            }
                        }
                    } else {
                        errors.add(
                                this.entry.ValueSetBindingNotAllowed(
                                        pathId,
                                        target.getLocationInfo(),
                                        resourceSkeleton.getResource().getId(),
                                        resourceSkeleton.getResource().getType()
                                )
                        );
                    }
                    return errors;
                }
        );
    }

    public List<IgamtObjectError> verifySingleCodeBinding(ResourceSkeleton resourceSkeleton, String pathId, InternalSingleCode internalSingleCode) {
        return this.process(
                resourceSkeleton,
                PropertyType.SINGLECODE,
                pathId,
                (target) -> {
                    BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
                    if(bindingInfo != null &&
                            isAllowedLocation(
                                    bindingInfo,
                                    target.getParent().getDomainInfo().getVersion(),
                                    target.getPosition(),
                                    target.getLocationInfo().getType(),
                                    target.getParent().getFixedName()) &&
                            bindingInfo.isAllowSingleCode()
                    ) {
                        return this.NoErrors();
                    } else {
                        return Collections.singletonList(
                                this.entry.SingleCodeNotAllowed(
                                        pathId,
                                        target.getLocationInfo(),
                                        resourceSkeleton.getResource().getId(),
                                        resourceSkeleton.getResource().getType()
                                )
                        );
                    }
                }
        );
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
