package gov.nist.hit.hl7.igamt.bootstrap.data;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItemBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertySingleCode;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SingleCodeDataFix {

    public static class SingleCodeExtractData {
        String igId;
        String resourceId;
        Type resourceType;
        String name;
        Set<InternalSingleCode> singleCodes;

        public SingleCodeExtractData(String igId, String resourceId, Type resourceType, String name, Set<InternalSingleCode> singleCodes) {
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

        public Set<InternalSingleCode> getSingleCodes() {
            return singleCodes;
        }

        public void setSingleCodes(Set<InternalSingleCode> singleCodes) {
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

    @PostConstruct
    void check() {
        Map<String, Set<SingleCodeExtractData>> merged = new HashMap<>();
        this.checkDatatypes().forEach((k, v) -> merged.merge(k, v, (v1, v2) -> {
            Set<SingleCodeExtractData> set = new HashSet<>(v1);
            set.addAll(v2);
            return set;
        }));
        this.checkSegments().forEach((k, v) -> merged.merge(k, v, (v1, v2) -> {
            Set<SingleCodeExtractData> set = new HashSet<>(v1);
            set.addAll(v2);
            return set;
        }));
        this.checkCP().forEach((k, v) -> merged.merge(k, v, (v1, v2) -> {
            Set<SingleCodeExtractData> set = new HashSet<>(v1);
            set.addAll(v2);
            return set;
        }));

        this.checkPC();
        for(String ig: merged.keySet()) {
            if(ig != null) {
                Ig igObj = this.igService.findById(ig);
                if(igObj != null) {
                    System.out.println(igObj.getId()+",\t"+igObj.getMetadata().getTitle()+",\t"+igObj.getUsername()+",\t"+igObj.getStatus());
                    for(SingleCodeExtractData extract: merged.get(ig)) {
                        System.out.println("\t"+extract.resourceId+",\t"+extract.resourceType+",\t"+extract.name);
                        for(InternalSingleCode sc: extract.getSingleCodes()) {
                            System.out.println("\t\t"+sc.getCode()+",\t"+sc.getCodeSystem());
                        }
                    }

                }
            }
        }
    }


    Map<String, Set<SingleCodeExtractData>> checkDatatypes() {
        Map<String, Set<SingleCodeExtractData>> data = new HashMap<>();

        List<Datatype> dt = this.datatypeService.findAll();
        int i = dt.stream().map(d -> {
            Set<InternalSingleCode> bindings = checkBinding(d.getBinding());
            if(bindings != null && bindings.size() > 0) {
                if(d.getDocumentInfo() != null) {
                    SingleCodeExtractData sg = new SingleCodeExtractData(
                            d.getDocumentInfo().getDocumentId(),
                            d.getId(),
                            d.getType(),
                            d.getLabel(),
                            bindings
                    );

                    data.compute(d.getDocumentInfo().getDocumentId(), (k, v) -> {
                        if(v != null) {
                            v.add(sg);
                            return v;
                        } else {
                            Set<SingleCodeExtractData> set = new HashSet<>();
                            set.add(sg);
                            return set;
                        }
                    });
                }
                return bindings.size();
            }

            return 0;
        }).mapToInt(Integer::intValue)
                .sum();
        System.out.println("Found " + i + " in Datatypes");
        return data;
    }

    Map<String, Set<SingleCodeExtractData>> checkSegments() {
        Map<String, Set<SingleCodeExtractData>> data = new HashMap<>();
        List<Segment> sg = this.segmentsService.findAll();
        int i = sg.stream().map(d -> {
            Set<InternalSingleCode> bindings = checkBinding(d.getBinding());
            if(bindings != null && bindings.size() > 0) {
                if(d.getDocumentInfo() != null) {
                    SingleCodeExtractData sc = new SingleCodeExtractData(
                            d.getDocumentInfo().getDocumentId(),
                            d.getId(),
                            d.getType(),
                            d.getLabel(),
                            bindings
                    );

                    data.compute(d.getDocumentInfo().getDocumentId(), (k, v) -> {
                        if(v != null) {
                            v.add(sc);
                            return v;
                        } else {
                            Set<SingleCodeExtractData> set = new HashSet<>();
                            set.add(sc);
                            return set;
                        }
                    });
                }
                return bindings.size();
            }

            return 0;
        }).mapToInt(Integer::intValue).sum();
        System.out.println("Found " + i + " in Segments");
        return data;
    }

    Map<String, Set<SingleCodeExtractData>> checkCP() {
        Map<String, Set<SingleCodeExtractData>> data = new HashMap<>();
        List<ConformanceProfile> cp = this.conformanceProfileService.findAll();
        int i = cp.stream().map(d -> {
            Set<InternalSingleCode> bindings = checkBinding(d.getBinding());
            if(bindings != null && bindings.size() > 0) {
                if(d.getDocumentInfo() != null) {
                    SingleCodeExtractData sc = new SingleCodeExtractData(
                            d.getDocumentInfo().getDocumentId(),
                            d.getId(),
                            d.getType(),
                            d.getLabel(),
                            bindings
                    );

                    data.compute(d.getDocumentInfo().getDocumentId(), (k, v) -> {
                        if(v != null) {
                            v.add(sc);
                            return v;
                        } else {
                            Set<SingleCodeExtractData> set = new HashSet<>();
                            set.add(sc);
                            return set;
                        }
                    });
                }
                return bindings.size();
            }

            return 0;
        }).mapToInt(Integer::intValue)
                .sum();
        System.out.println("Found " + i + " in Conformance Profiles");
        return data;
    }

    void checkPC() {
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
        System.out.println("Found " + i + " in Profile Components");
    }



    Set<InternalSingleCode> checkBinding(ResourceBinding resourceBinding) {
        if(resourceBinding != null && resourceBinding.getChildren() != null) {
            return resourceBinding.getChildren().stream().flatMap(seb ->
                this.checkStructBinding(seb, new HashSet<>()).stream()
            ).collect(Collectors.toSet());
        }
        return null;
    }

    Set<InternalSingleCode> checkStructBinding(StructureElementBinding seb, Set<InternalSingleCode> internalSingleCodes) {
        if(seb.getInternalSingleCode() != null) {
            internalSingleCodes.add(seb.getInternalSingleCode());
        }
        if(seb.getChildren() != null) {
            for(StructureElementBinding s: seb.getChildren())
                this.checkStructBinding(s, internalSingleCodes);
        }
        return internalSingleCodes;
    }

}
