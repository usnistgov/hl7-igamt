package gov.nist.hit.hl7.igamt.bootstrap.data;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.binding.DisplayBindingContainer;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBinding;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBindingDisplay;
import gov.nist.hit.hl7.igamt.ig.binding.SingleCodeBindingContainer;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItemBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertySingleCode;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.lang.reflect.Array;
import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
public class SingleCodeDataFix {

    public static class SingleCodeBindingInfo {
        private String pathId;
        private ResourceSkeletonBone bone;
        private StructureElementBinding structureElementBinding;
        private BindingInfo bindingInfo;

        public SingleCodeBindingInfo(String pathId, StructureElementBinding structureElementBinding) {
            this.pathId = pathId;
            this.structureElementBinding = structureElementBinding;
        }

        public String getPathId() {
            return pathId;
        }

        public void setPathId(String pathId) {
            this.pathId = pathId;
        }

        public ResourceSkeletonBone getBone() {
            return bone;
        }

        public void setBone(ResourceSkeletonBone bone) {
            this.bone = bone;
        }

        public StructureElementBinding getStructureElementBinding() {
            return structureElementBinding;
        }

        public void setStructureElementBinding(StructureElementBinding structureElementBinding) {
            this.structureElementBinding = structureElementBinding;
        }

        public BindingInfo getBindingInfo() {
            return bindingInfo;
        }

        public void setBindingInfo(BindingInfo bindingInfo) {
            this.bindingInfo = bindingInfo;
        }
    }

    public static class SingleCodeExtractData {
        String igId;
        String resourceId;
        Type resourceType;
        String name;
        Set<SingleCodeBindingInfo> singleCodes;


        public SingleCodeExtractData(String igId, String resourceId, Type resourceType, String name, Set<SingleCodeBindingInfo> singleCodes) {
            this.igId = igId;
            this.resourceId = resourceId;
            this.resourceType = resourceType;
            this.name = name;
            this.singleCodes = singleCodes;
        }

        public String getResourceId() {
            return resourceId;
        }

        public void setResourceId(String resourceId) {
            this.resourceId = resourceId;
        }

        public Type getResourceType() {
            return resourceType;
        }

        public void setResourceType(Type resourceType) {
            this.resourceType = resourceType;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Set<SingleCodeBindingInfo> getSingleCodes() {
            return singleCodes;
        }

        public void setSingleCodes(Set<SingleCodeBindingInfo> singleCodes) {
            this.singleCodes = singleCodes;
        }

        public String getIgId() {
            return igId;
        }

        public void setIgId(String igId) {
            this.igId = igId;
        }

    }

    @Autowired
    SegmentService segmentsService;

    @Autowired
    ConformanceProfileService conformanceProfileService;

    @Autowired
    DatatypeService datatypeService;

    @Autowired
    ProfileComponentService profileComponentService;

    @Autowired
    IgService igService;

    @Autowired
    ResourceBindingService bindingService;

    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    @Autowired
    ConfigService configService;

//    @PostConstruct
    public void check() throws Exception {
        Config config = this.configService.findOne();
        int dts = fixDatatypes(config);
        int segs = fixSegments(config);
        int cps = fixConformanceProfiles(config);
        int pcs = checkPC();

        System.out.println("Fixed " + dts + " datatypes");
        System.out.println("Fixed " + segs + " segments");
        System.out.println("Fixed " + cps + " conformance profiles");
        System.out.println("Exists " + pcs + " to fix");
    }

    int fixDatatypes(Config config) throws Exception {
        return this.fixAll(
                Datatype::getBinding,
                () -> this.datatypeService.findAll(),
                (resource) -> {
					try {
						return this.datatypeService.save(resource);
					} catch (ForbiddenOperationException e) {
						e.printStackTrace();
					}
					return resource;
				},
                config
        );
    }

    int fixSegments(Config config) throws Exception {
        return this.fixAll(
                Segment::getBinding,
                () -> this.segmentsService.findAll(),
                (resource) -> {
					try {
						return this.segmentsService.save(resource);
					} catch (ForbiddenOperationException e) {
						e.printStackTrace();
					}
					return resource;
				},
                config
        );
    }

    int fixConformanceProfiles(Config config) throws Exception {
        return this.fixAll(
                ConformanceProfile::getBinding,
                () -> this.conformanceProfileService.findAll(),
                (resource) -> this.conformanceProfileService.save(resource),
                config
        );
    }

    int checkPC() {
        int i = 0;
        List<ProfileComponent> pcs = this.profileComponentService.findAll();
        for(ProfileComponent pc: pcs) {
            if(pc.getChildren()!= null) {
                for(ProfileComponentContext pcc: pc.getChildren()) {
                    if(pcc.getProfileComponentBindings() != null && pcc.getProfileComponentBindings().getItemBindings() != null) {
                        for(ProfileComponentItemBinding pcib: pcc.getProfileComponentBindings().getItemBindings()) {
                            if(pcib.getBindings() != null) {
                                for(PropertyBinding pb: pcib.getBindings()) {
                                    if(pb instanceof PropertySingleCode) {
                                        i++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return i;
    }

    public <T extends Resource> int fixAll(Function<T, ResourceBinding> getResourceBinding, Supplier<List<T>> getter, Function<T, T> saver, Config config) throws Exception {
        List<T> all = getter.get();
        int i = 0;
        for(T resource: all) {
            if(fix(resource, getResourceBinding.apply(resource), saver, config)) {
                i++;
            }
        }
        return i;
    }

    public <T extends Resource> boolean fix(T resource, ResourceBinding resourceBinding, Function<T, T> saver, Config config) throws Exception {
        Set<SingleCodeBindingInfo> bindings = getResourceBindings(resource, resourceBinding, config);
        return fix(bindings, resource, saver);
    }

    public <T extends Resource> boolean fix(Set<SingleCodeBindingInfo> bindings, T resource, Function<T, T> saver) throws Exception {
        if(bindings == null || bindings.isEmpty()) {
            return false;
        }

        for(SingleCodeBindingInfo binding: bindings) {
            boolean isAllowed = binding.getBindingInfo() != null && isAllowedLocation(
                    binding.getBindingInfo(),
                    binding.getBone().getParent().getDomainInfo().getVersion(),
                    binding.getBone().getPosition(),
                    binding.getBone().getParent().getType(),
                    binding.getBone().getParent().getResourceName()) &&
                    binding.getBindingInfo().isAllowSingleCode();

            if(isAllowed) {
                InternalSingleCode internalSingleCode = binding.getStructureElementBinding().getInternalSingleCode();
                if(binding.getStructureElementBinding().getSingleCodeBindings() == null) {
                    binding.getStructureElementBinding().setSingleCodeBindings(new ArrayList<>());
                }

                List<List<Integer>> allowedBindingLocation = getBindingOptions(binding.bone.getResource(), binding.getBindingInfo());
                boolean hasOne = allowedBindingLocation != null && allowedBindingLocation.stream().anyMatch(l -> l.contains(1) && l.size() == 1);
                if(allowedBindingLocation == null || hasOne) {
                    List<Integer> locations = allowedBindingLocation == null ? null : Arrays.asList(1);
                    SingleCodeBinding singleCodeBinding = new SingleCodeBinding();
                    singleCodeBinding.setCode(internalSingleCode.getCode());
                    singleCodeBinding.setCodeSystem(internalSingleCode.getCodeSystem());
                    singleCodeBinding.setLocations(locations);
                    binding.getStructureElementBinding().getSingleCodeBindings().add(singleCodeBinding);
                    binding.getStructureElementBinding().setInternalSingleCode(null);
                } else {
                    throw new Exception("Ambiguous Location Choice " + allowedBindingLocation);
                }
            } else {
                throw new Exception("Single Code Binding is not allowed at location");
            }
        }

        saver.apply(resource);
        return true;
    }

    public boolean isAllowedLocation(BindingInfo bindingInfo, String version, int location, Type type, String parent) {
        if(bindingInfo.isLocationIndifferent()) return true;
        if(bindingInfo.getLocationExceptions() != null) {
            return bindingInfo.getLocationExceptions().stream().anyMatch((bli) -> bli.getLocation() == location && bli.getType().equals(type) && bli.getVersion().contains(version) && bli.getName().equals(parent));
        } else {
            return false;
        }
    }


    public List<List<Integer>> getBindingOptions(DisplayElement resource, BindingInfo bindingInfo) {
        List<BindingLocationOption> bls = getValidBindingLocations(resource.getDomainInfo(), bindingInfo);
        return bls != null ? bls.stream().map(BindingLocationOption::getValue).collect(Collectors.toList()) : null;
                //.collect(Collectors.joining(",", "[", "]")) : ".";
    }

    public List<BindingLocationOption> getValidBindingLocations(DomainInfo domainInfo, BindingInfo bindingInfo) {
        String versionKey = domainInfo.getVersion().replace(".", "-");
        return bindingInfo.getAllowedBindingLocations() != null ? bindingInfo.getAllowedBindingLocations().get(versionKey) : Collections.emptyList();
    }

    public BindingInfo getBindingInfo(String resourceName, Config config) {
        return config.getValueSetBindingConfig().getOrDefault(resourceName, null);
    }


    Set<SingleCodeBindingInfo> getResourceBindings(Resource resource, ResourceBinding binding, Config config) {
        if(binding != null && binding.getChildren() != null) {
            Set<SingleCodeBindingInfo> bindings = binding.getChildren().stream().flatMap(
                    b -> this.getResourceBindings(null, b).stream()
            ).collect(Collectors.toSet());
            setResourceBindingsLocationInfo(resource, bindings, config);
            return bindings;
        }
        return null;
    }

    Set<SingleCodeBindingInfo> getResourceBindings(String parent, StructureElementBinding binding) {
        Set<SingleCodeBindingInfo> bindings = new HashSet<>();
        if(binding != null) {
            String pathId = Strings.isNullOrEmpty(parent) ? binding.getElementId() : parent + "-" + binding.getElementId();
            if(binding.getInternalSingleCode() != null) {
                bindings.add(new SingleCodeBindingInfo(pathId, binding));
            }

            if(binding.getChildren() != null && binding.getChildren().size() > 0) {
                bindings.addAll(binding.getChildren().stream()
                        .flatMap((a) -> this.getResourceBindings(pathId, a).stream())
                        .collect(Collectors.toSet()));
            }
        }
        return bindings;
    }

    public void setResourceBindingsLocationInfo(Resource resource, Set<SingleCodeBindingInfo> bindings, Config config) {
        ResourceSkeleton skeleton = new ResourceSkeleton(
                new ResourceRef(resource.getType(), resource.getId()),
                this.resourceSkeletonService
        );

        bindings.forEach((binding) -> {
            this.setLocationInfo(skeleton, binding, config);
        });
    }

    private void setLocationInfo(ResourceSkeleton skeleton, SingleCodeBindingInfo sc, Config config) {
        if(!Strings.isNullOrEmpty(sc.getPathId())) {
            try {
                ResourceSkeletonBone bone = skeleton.get(sc.getPathId());
                if(bone != null) {
                    sc.setBone(bone);
                    sc.setBindingInfo(getBindingInfo(bone.getResource().getResourceName(), config));
                }
            } catch (ResourceNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

}
