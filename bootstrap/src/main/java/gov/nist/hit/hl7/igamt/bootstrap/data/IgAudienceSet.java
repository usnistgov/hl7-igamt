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

import java.util.HashSet;
import java.util.List;

@Component
public class IgAudienceSet {
    @Autowired
    IgService igService;
    @Autowired
    IgRepository igRepository;

    void fix() {
        List<Ig> igs = this.igService.findAll();
        for(Ig ig: igs) {
            if(ig.getAudience() == null) {
                if(Status.PUBLISHED.equals(ig.getStatus())) {
                    ig.setAudience(new PublicAudience());
                } else if(Scope.USER.equals(ig.getDomainInfo().getScope())) {
                    PrivateAudience privateAudience = new PrivateAudience();
                    privateAudience.setEditor(ig.getUsername());
                    privateAudience.setViewers(ig.getSharedUsers() != null ? new HashSet<>(ig.getSharedUsers()) : new HashSet<>());
                    ig.setAudience(privateAudience);
                }
                this.igRepository.save(ig);
            }
        }
    }
}
