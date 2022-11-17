package gov.nist.hit.hl7.igamt.ig.data.fix;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConformanceStatement;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PcConformanceStatementsIdFixes {
    @Autowired
    private ProfileComponentService profileComponentService;

    public void fix() throws Exception {
        List<ProfileComponent> pcList = profileComponentService.findAll();
        List<ProfileComponent> changed = new ArrayList<>();
        for(ProfileComponent pc : pcList) {
            boolean update = false;
            for(ProfileComponentContext ctx : pc.getChildren()) {
                if(ctx.getProfileComponentBindings() != null && ctx.getProfileComponentBindings().getContextBindings() != null) {
                    for(PropertyBinding pb : ctx.getProfileComponentBindings().getContextBindings()) {
                        if(pb instanceof PropertyConformanceStatement) {
                            PropertyConformanceStatement pcs = (PropertyConformanceStatement) pb;
                            boolean fix = fixPropertyConformanceStatementId(pcs);
                            update = update || fix;
                        }
                    }
                }
            }
            if(update) {
                changed.add(pc);
            }
        }
        System.out.println("[PC CS ID FIXE] Fixed " + changed.size() + " profile components (" + changed.stream().map(AbstractDomain::getId).collect(Collectors.joining(", ")) + ")");
        profileComponentService.saveAll(changed);
    }

    boolean fixPropertyConformanceStatementId(PropertyConformanceStatement pcs) throws Exception {
        if(pcs.getPayload() != null) {
            if(Strings.isNullOrEmpty(pcs.getPayload().getId())) {
                if(pcs.getChange().equals(ChangeType.ADD)) {
                    pcs.getPayload().setId(UUID.randomUUID().toString());
                    pcs.setTargetId(pcs.getPayload().getId());
                    return true;
                } else {
                    throw new Exception("Property Conformance Statement 'DELETE' with no target Id found.");
                }
            }
        }
        return false;
    }

}
