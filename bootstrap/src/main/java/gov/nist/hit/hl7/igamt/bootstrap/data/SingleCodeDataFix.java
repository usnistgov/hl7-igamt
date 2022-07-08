package gov.nist.hit.hl7.igamt.bootstrap.data;

import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SingleCodeDataFix {
    @Autowired
    SegmentService segmentsService;

    @Autowired
    ConformanceProfileService conformanceProfileService;

    @Autowired
    DatatypeService datatypeService;

    @Autowired
    ProfileComponentService profileComponentService;

    @PostConstruct
    void check() {
        Set<String> igs = new HashSet<>();
        igs.addAll(this.checkDatatypes());
        igs.addAll(this.checkSegments());
        igs.addAll(this.checkCP());
        this.checkPC();
        System.out.println(igs);
    }


    Set<String> checkDatatypes() {
        Set<String> igs = new HashSet<>();
        List<Datatype> dt = this.datatypeService.findAll();
        int i = dt.stream().map(d -> {
            int bindings = checkBinding(d.getBinding());
            if(bindings > 0) {
                igs.add(d.getDocumentInfo().getDocumentId());
            }
            return bindings;
        }).mapToInt(Integer::intValue)
                .sum();
        System.out.println("Found " + i + " in Datatypes");
        return igs;
    }

    Set<String> checkSegments() {
        Set<String> igs = new HashSet<>();
        List<Segment> sg = this.segmentsService.findAll();
        int i = sg.stream().map(d -> {
            int bindings = checkBinding(d.getBinding());
            if(bindings > 0) {
                igs.add(d.getDocumentInfo() != null ? d.getDocumentInfo().getDocumentId() : "NULLS:"+d.getId());
            }
            return bindings;
        }).mapToInt(Integer::intValue).sum();
        System.out.println("Found " + i + " in Segments");
        return igs;
    }

    Set<String> checkCP() {
        Set<String> igs = new HashSet<>();
        List<ConformanceProfile> cp = this.conformanceProfileService.findAll();
        int i = cp.stream().map(d -> {
            int bindings = checkBinding(d.getBinding());
            if(bindings > 0) {
                igs.add(d.getDocumentInfo() != null ? d.getDocumentInfo().getDocumentId() : "NULLCP:"+d.getId());
            }
            return bindings;
        }).mapToInt(Integer::intValue)
                .sum();
        System.out.println("Found " + i + " in Conformance Profiles");
        return igs;
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

    int checkBinding(ResourceBinding resourceBinding) {
        if(resourceBinding != null && resourceBinding.getChildren() != null) {
            return resourceBinding.getChildren().stream().map(this::checkStructBinding).mapToInt(Integer::intValue)
                    .sum();
        }
        return 0;
    }

    int checkStructBinding(StructureElementBinding seb) {
        int i = 0;
        if(seb.getInternalSingleCode() != null) {
            i++;
        }
        if(seb.getChildren() != null) {
            for(StructureElementBinding s: seb.getChildren())
            i += this.checkStructBinding(s);
        }
        return i;
    }

}
