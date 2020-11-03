package gov.nist.hit.hl7.igamt.structure.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StructureElementIdFix {
    @Autowired
    MessageStructureRepository messageStructureRepository;
    @Autowired
    SegmentRepository segmentRepository;
    @Autowired
    SegmentService segmentService;
    @Autowired
    DatatypeService datatypeService;
    @Autowired
    ConformanceProfileRepository conformanceProfileRepository;

    @PostConstruct
    void fix() {
        System.out.println("[STRUCTURE CUSTOM]");
        List<MessageStructure> messageStructures = this.getAllAffectedCustomStructures();
        System.out.println("[STRUCTURE CUSTOM] " + messageStructures.size());
        messageStructures.forEach((x) -> {
            System.out.println(x.getStructID() + " - " + x.getParticipants());
        });
        System.out.println("[CP CUSTOM]");
        List<ConformanceProfile> conformanceProfiles = this.getAllAffectedConformanceProfiles();
        System.out.println("[CP CUSTOM] " + conformanceProfiles.size());
        conformanceProfiles.forEach((x) -> {
            System.out.println(x.getStructID() + " - " + x.getUsername() + " - " + x.getId());
        });
    }

    List<MessageStructure> getAllAffectedCustomStructures() {
        return this.messageStructureRepository.findByCustomTrue()
                .stream()
                .filter((f) -> !this.checkIds(f.getChildren()))
                .collect(Collectors.toList());
    }

    List<ConformanceProfile> getAllAffectedConformanceProfiles() {
        return this.conformanceProfileRepository.findAll()
                .stream()
                .filter((f) -> !this.checkIds(f.getChildren()))
                .collect(Collectors.toList());
    }

    boolean checkIds(Set<SegmentRefOrGroup> segmentRefOrGroups) {
        for(SegmentRefOrGroup segmentRefOrGroup: segmentRefOrGroups) {
            if(segmentRefOrGroup instanceof Group) {
                Group group = (Group) segmentRefOrGroup;
                if(!this.isIdValid(group) || !this.checkIds(group.getChildren())) {
                    return false;
                }
            } else if(segmentRefOrGroup instanceof SegmentRef) {
                SegmentRef segmentRef = (SegmentRef) segmentRefOrGroup;
                if(!this.isIdValid(segmentRef)) {
                    return false;
                }
            }
        }
        return true;
    }

    boolean isIdValid(StructureElement elm) {
        return !Strings.isNullOrEmpty(elm.getId()) && !elm.getId().contains("-");
    }

}
