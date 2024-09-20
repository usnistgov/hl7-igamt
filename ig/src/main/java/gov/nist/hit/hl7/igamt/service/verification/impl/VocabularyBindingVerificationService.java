package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VocabularyBindingVerificationService extends VerificationUtils {

    @Autowired
    ValuesetService valuesetService;

    public List<IgamtObjectError> verifyValueSetBinding(ResourceSkeleton resourceSkeleton, String pathId, Set<ValuesetBinding> valuesetBindings) {
        List<IgamtObjectError> errors = new ArrayList<>();
        return this.process(
                resourceSkeleton,
                PropertyType.VALUESET,
                pathId,
                (target) -> {

                    if(
                            resourceSkeleton.getResourceRef().getType().equals(Type.CONFORMANCEPROFILE)
                                    && isOBX_2(target.getParent().getFixedName(), target.getPosition())
                    ) {
                        errors.add(
                                this.entry.OBX2MessageValueSetBindingNotAllowed(
                                        pathId,
                                        target.getLocationInfo(),
                                        resourceSkeleton.getResource().getId(),
                                        resourceSkeleton.getResource().getType()
                                )
                        );
                        return errors;
                    }

                    BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
                    if(bindingInfo != null &&
                            isAllowedLocation(
                                    bindingInfo,
                                    target.getParent().getDomainInfo().getVersion(),
                                    target.getPosition(),
                                    target.getParent().getType(),
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
                        List<BindingLocationOption> validLocation = this.getValidBindingLocations(target.getResource().getDomainInfo(), bindingInfo);
                        for(ValuesetBinding vsBinding: valuesetBindings) {
                            errors.addAll(
                                    this.verifyBindingLocations(
                                            validLocation,
                                            vsBinding.getValuesetLocations(),
                                            (reason) -> this.entry.InvalidBindingLocation(
                                                    pathId,
                                                    target.getLocationInfo().getHl7Path(),
                                                    target.getLocationInfo(),
                                                    PropertyType.VALUESET,
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    vsBinding.getValuesetLocations(),
                                                    reason
                                            )
                                    )
                            );
                            for(String vsId: vsBinding.getValueSets()) {
                                if(!this.existsValueSet(vsId)) {
                                    errors.add(
                                            this.entry.ResourceNotFound(
                                                    new Location(pathId, target.getLocationInfo(), PropertyType.VALUESET),
                                                    vsId,
                                                    Type.VALUESET
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


    public List<BindingLocationOption> getValidBindingLocations(DomainInfo domainInfo, BindingInfo bindingInfo) {
        String versionKey = domainInfo.getVersion().replace(".", "-");
        return bindingInfo.getAllowedBindingLocations() != null ? bindingInfo.getAllowedBindingLocations().get(versionKey) : Collections.emptyList();
    }

    public List<IgamtObjectError> verifyBindingLocations(List<BindingLocationOption> validLocation, Set<Integer> bindingLocations, BindingLocationEntryBuilder entryBuilder) {
        List<IgamtObjectError> errors = new ArrayList<>();
        if(validLocation != null) {
            if(bindingLocations == null || bindingLocations.size() == 0) {
                errors.add(
                        entryBuilder.apply("Element is complex")
                );
            } else if(!isValidBindingLocations(validLocation, bindingLocations)) {
                errors.add(
                        entryBuilder.apply("Element does not exist")
                );
            }
        } else {
            if(bindingLocations != null && bindingLocations.size() > 0) {
                errors.add(
                        entryBuilder.apply("Element is primitive")
                );
            }
        }
        return errors;
    }

    public List<IgamtObjectError> verifySingleCodeBinding(ResourceSkeleton resourceSkeleton, String pathId, List<SingleCodeBinding> singleCodeBindings) {
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
                                    target.getParent().getType(),
                                    target.getParent().getFixedName()) &&
                            bindingInfo.isAllowSingleCode()
                    ) {
                        List<IgamtObjectError> errors = new ArrayList<>();
                        List<BindingLocationOption> validLocation = this.getValidBindingLocations(target.getResource().getDomainInfo(), bindingInfo);
                        for(SingleCodeBinding binding: singleCodeBindings) {
                            if(Strings.isNullOrEmpty(binding.getCode())) {
                                errors.add(
                                        this.entry.SingleCodeMissingCode(
                                                pathId,
                                                target.getLocationInfo(),
                                                resourceSkeleton.getResource().getId(),
                                                resourceSkeleton.getResource().getType()
                                        )
                                );
                            }
                            if(Strings.isNullOrEmpty(binding.getCodeSystem())) {
                                errors.add(
                                        this.entry.SingleCodeMissingCodeSystem(
                                                pathId,
                                                target.getLocationInfo(),
                                                resourceSkeleton.getResource().getId(),
                                                resourceSkeleton.getResource().getType()
                                        )
                                );
                            }
                            Set<Integer> locations =  binding.getLocations() == null ? new HashSet() : new HashSet(binding.getLocations());
                            errors.addAll(
                                    this.verifyBindingLocations(
                                            validLocation,
                                            locations,
                                            (reason) -> this.entry.InvalidBindingLocation(
                                                    pathId,
                                                    target.getLocationInfo().getHl7Path(),
                                                    target.getLocationInfo(),
                                                    PropertyType.SINGLECODE,
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    locations,
                                                    reason
                                            )
                                    )
                            );
                        }
                        return errors;
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

    public boolean existsValueSet(String vsId) {
        return this.valuesetService.findById(vsId) != null;
    }

    public boolean isOBX_2(String resourceName, int position) {
        return resourceName.equals("OBX") && position == 2;
    }

    @FunctionalInterface()
    public interface BindingLocationEntryBuilder {
        IgamtObjectError apply(String reason);
    }

}
