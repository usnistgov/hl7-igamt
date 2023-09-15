package gov.nist.hit.hl7.igamt.bootstrap.data;

import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
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
    @Autowired
    DatatypeLibraryRepository dtLibs;

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
    
    //@PostConstruct
    void fixLibs() {
        List<DatatypeLibrary> dtlibs = this.dtLibs.findAll();
        for(DatatypeLibrary dtlib: dtlibs) {
            if(dtlib.getAudience() == null) {
                if(Status.PUBLISHED.equals(dtlib.getStatus())) {
                	dtlib.setAudience(new PublicAudience());
                } else if(Scope.USER.equals(dtlib.getDomainInfo().getScope())) {
                    PrivateAudience privateAudience = new PrivateAudience();
                    privateAudience.setEditor(dtlib.getUsername());
                    dtlib.setAudience(privateAudience);
                }
                this.dtLibs.save(dtlib);
            } else {
                if(dtlib.getAudience() instanceof PrivateAudience) {
                    PrivateAudience audience = ((PrivateAudience) dtlib.getAudience());
                    if(audience.getViewers() != null && audience.getViewers().contains(dtlib.getUsername())) {
                        audience.getViewers().remove(dtlib.getUsername());
                        audience.setEditor(dtlib.getUsername());
                        this.dtLibs.save(dtlib);
                    }
                }
            }
        }
    }
}
