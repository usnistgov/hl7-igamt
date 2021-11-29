package gov.nist.hit.hl7.igamt.ig.data.fix;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintGroupRepository;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoConstraintsFixes {
    @Autowired
    private IgService igService;
    @Autowired
    private ConformanceProfileService conformanceProfileService;
    @Autowired
    private ProfileComponentService profileComponentService;
    @Autowired
    private CoConstraintService coConstraintService;


    public void fix() {
        List<Ig> igs = this.igService.findAll();
        igs.stream().forEach((ig) -> {
            ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
            List<ConformanceProfile> conformanceProfiles = conformanceProfileService.findByIdIn(conformanceProfileRegistry.getLinksAsIds());
            this.fixCP(conformanceProfiles, ig.getId(), ig.getMetadata().getTitle(), ig.getUsername(), ig.getStatus()).forEach(
                    this.conformanceProfileService::save
            );

            ProfileComponentRegistry profileComponentRegistry = ig.getProfileComponentRegistry();
            List<ProfileComponent> profileComponents = profileComponentService.findByIdIn(profileComponentRegistry.getLinksAsIds());
            this.fixPC(profileComponents, ig.getId(), ig.getMetadata().getTitle(), ig.getUsername(), ig.getStatus()).forEach(
                    profileComponentService::save
            );

            CoConstraintGroupRegistry coConstraintGroupRegistry = ig.getCoConstraintGroupRegistry();
            ig.setCoConstraintGroupRegistry(this.fixGRP(coConstraintGroupRegistry, ig.getId(), ig.getMetadata().getTitle(), ig.getUsername(), ig.getStatus()));

            this.igService.save(ig);

        });
    }

    List<ProfileComponent> fixPC(List<ProfileComponent> cps, String igId, String igTitle, String igUsername, Status igStatus) {
        for(ProfileComponent pc: cps) {
            for(ProfileComponentContext ctx: pc.getChildren()) {
                if(
                        ctx.getProfileComponentCoConstraints() != null &&
                        ctx.getProfileComponentCoConstraints().getBindings() != null &&
                        ctx.getProfileComponentCoConstraints().getBindings().size() > 0
                ) {
                    System.out.println("[DELETE_CC][ProfileComponentCoConstraint] " + pc.getId() + " by " + pc.getUsername() + " at context " + ctx.getId()  + " ==> " + this.ig(igId, igTitle, igUsername, igStatus));
                    ctx.setProfileComponentCoConstraints(null);
                }
            }
        }
        return cps;
    }

    List<ConformanceProfile> fixCP(List<ConformanceProfile> cps, String igId, String igTitle, String igUsername, Status igStatus) {
        for(ConformanceProfile cp: cps) {
            if(cp.getCoConstraintsBindings() != null && cp.getCoConstraintsBindings().size() > 0) {
                System.out.println("[DELETE_CC][ConformanceStatementCoConstraint] " + cp.getId() + " by " + cp.getUsername() + " ==> " + this.ig(igId, igTitle, igUsername, igStatus));
                cp.setCoConstraintsBindings(new ArrayList<>());
            }
        }
        return cps;
    }

    CoConstraintGroupRegistry fixGRP(CoConstraintGroupRegistry coConstraintGroupRegistry, String igId, String igTitle, String igUsername, Status igStatus) {
        List<CoConstraintGroup> groups = coConstraintService.findByIdIn(coConstraintGroupRegistry.getLinksAsIds());
        for(CoConstraintGroup grp: groups) {
            System.out.println("[DELETE_CC][CoConstraintGroup] " + grp.getId() + " by " + grp.getUsername() + " ==> " + this.ig(igId, igTitle, igUsername, igStatus));
            this.coConstraintService.delete(grp);
            coConstraintGroupRegistry.setChildren(
                    coConstraintGroupRegistry.getChildren().stream().filter(g -> !g.getId().equals(grp.getId())).collect(Collectors.toSet())
            );
        }
        return coConstraintGroupRegistry;
    }

    String ig(String id, String igTitle, String igUsername, Status igStatus) {
        return "IG ("+id+") - Name : " + igTitle + " - BY : " + igUsername + " - Status : " + igStatus;
    }
}
