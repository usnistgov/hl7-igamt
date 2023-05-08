package gov.nist.hit.hl7.igamt.bootstrap.data;

import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class IgAudienceSet {
    @Autowired
    IgService igService;
    @Autowired
    IgRepository igRepository;

    //@PostConstruct
    void fix() {
        List<Ig> igs = this.igService.findAll();
        for(Ig ig: igs) {
            if(ig.getAudience() == null) {
                if(Status.PUBLISHED.equals(ig.getStatus())) {
                    ig.setAudience(new PublicAudience());
                } else if(Scope.USER.equals(ig.getDomainInfo().getScope())) {
                    PrivateAudience privateAudience = new PrivateAudience();
                    privateAudience.setEditor(ig.getUsername());
                    privateAudience.setViewers(ig.getSharedUsers() != null ? ig.getSharedUsers().stream().filter(u -> u.equals(ig.getUsername())).collect(Collectors.toSet()) : new HashSet<>());
                    ig.setAudience(privateAudience);
                }
                this.igRepository.save(ig);
            } else {
                if(ig.getAudience() instanceof PrivateAudience) {
                    PrivateAudience audience = ((PrivateAudience) ig.getAudience());
                    if(audience.getViewers() != null && audience.getViewers().contains(ig.getUsername())) {
                        audience.getViewers().remove(ig.getUsername());
                        audience.setEditor(ig.getUsername());
                        this.igRepository.save(ig);
                    }
                }
            }
        }
    }
}
