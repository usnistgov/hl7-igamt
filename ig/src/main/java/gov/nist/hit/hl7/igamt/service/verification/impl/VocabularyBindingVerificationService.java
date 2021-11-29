package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

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
                        List<BindingLocationOption> validLocation = this.getValidBindingLocations(target.getResource().getDomainInfo(), bindingInfo);
                        for(ValuesetBinding vsBinding: valuesetBindings) {
                            errors.addAll(
                                    this.verifyBindingLocations(
                                            resourceSkeleton,
                                            pathId,
                                            target.getLocationInfo().getHl7Path(),
                                            target,
                                            validLocation,
                                            vsBinding.getValuesetLocations(),
                                            this.entry::InvalidBindingLocation
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

    public List<IgamtObjectError> verifyBindingLocations(ResourceSkeleton resourceSkeleton, String pathId, String name, ResourceSkeletonBone target,  List<BindingLocationOption> validLocation, Set<Integer> bindingLocations, BindingLocationEntryBuilder entryBuilder) {
        List<IgamtObjectError> errors = new ArrayList<>();
        if(validLocation != null) {
            if(bindingLocations == null || bindingLocations.size() == 0) {
                errors.add(
                        entryBuilder.apply(
                                pathId,
                                name,
                                target.getLocationInfo(),
                                resourceSkeleton.getResource().getId(),
                                resourceSkeleton.getResource().getType(),
                                bindingLocations,
                                "Element is complex"
                        )
                );
            } else if(!isValidBindingLocations(validLocation, bindingLocations)) {
                errors.add(
                        entryBuilder.apply(
                                pathId,
                                name,
                                target.getLocationInfo(),
                                resourceSkeleton.getResource().getId(),
                                resourceSkeleton.getResource().getType(),
                                bindingLocations,
                                "Element does not exist"
                        )
                );
            }
        } else {
            if(bindingLocations != null && bindingLocations.size() > 0) {
                errors.add(
                        entryBuilder.apply(
                                pathId,
                                name,
                                target.getLocationInfo(),
                                resourceSkeleton.getResource().getId(),
                                resourceSkeleton.getResource().getType(),
                                bindingLocations,
                                "Element is primitive"
                        )
                );
            }
        }
        return errors;
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
                        List<IgamtObjectError> errors = new ArrayList<>();
                        if(Strings.isNullOrEmpty(internalSingleCode.getCode())) {
                            errors.add(
                                    this.entry.SingleCodeMissingCode(
                                            pathId,
                                            target.getLocationInfo(),
                                            resourceSkeleton.getResource().getId(),
                                            resourceSkeleton.getResource().getType()
                                    )
                            );
                        }
                        if(Strings.isNullOrEmpty(internalSingleCode.getCodeSystem())) {
                            errors.add(
                                    this.entry.SingleCodeMissingCodeSystem(
                                            pathId,
                                            target.getLocationInfo(),
                                            resourceSkeleton.getResource().getId(),
                                            resourceSkeleton.getResource().getType()
                                    )
                            );
                        }
                        if(Strings.isNullOrEmpty(internalSingleCode.getValueSetId())) {
                            errors.add(
                                    this.entry.SingleCodeMissingValueSet(
                                            pathId,
                                            target.getLocationInfo(),
                                            resourceSkeleton.getResource().getId(),
                                            resourceSkeleton.getResource().getType()
                                    )
                            );
                        } else {
                            Valueset vs = this.valuesetService.findById(internalSingleCode.getValueSetId());
                            if(vs != null) {
                                if(!existsCodeInValueSet(internalSingleCode.getValueSetId(), internalSingleCode.getCode(), internalSingleCode.getCodeSystem())) {
                                    errors.add(
                                            this.entry.SingleCodeNotInValueSet(
                                                    pathId,
                                                    target.getLocationInfo(),
                                                    resourceSkeleton.getResource().getId(),
                                                    resourceSkeleton.getResource().getType(),
                                                    internalSingleCode.getCode(),
                                                    internalSingleCode.getCodeSystem(),
                                                    vs.getBindingIdentifier()
                                            )
                                    );
                                }
                            } else {
                                errors.add(
                                        this.entry.ResourceNotFound(
                                                new Location(pathId, target.getLocationInfo(), PropertyType.SINGLECODE),
                                                internalSingleCode.getValueSetId(),
                                                Type.VALUESET
                                        )
                                );
                            }
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

    public boolean existsCodeInValueSet(String vsId, String codeValue, String codeSystem) {
        Valueset vs = this.valuesetService.findById(vsId);
        if(vs != null) {
            if(vs.isIncludeCodes()) {
                if(vs.getCodes() != null) {
                    return vs.getCodes().stream()
                            .anyMatch((code) -> code.getValue().equals(codeValue) && code.getCodeSystem().equals(codeSystem));
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    @FunctionalInterface()
    public interface BindingLocationEntryBuilder {
        IgamtObjectError apply(String pathId, String name, LocationInfo info, String id, Type type, Set<Integer> locations, String reason);
    }

}
