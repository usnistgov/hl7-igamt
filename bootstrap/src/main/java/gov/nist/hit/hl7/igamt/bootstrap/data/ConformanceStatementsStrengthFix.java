package gov.nist.hit.hl7.igamt.bootstrap.data;

import com.google.common.base.Strings;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementStrength;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConformanceStatement;
import gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service()
public class ConformanceStatementsStrengthFix {
    @Autowired
    DatatypeRepository datatypeRepo;
    @Autowired
    ConformanceProfileRepository conformanceProfileRepo;
    @Autowired
    SegmentRepository segmentRepo;
    @Autowired
    ProfileComponentRepository pcRepo;

    private final List<String> SHALL = Collections.unmodifiableList(Arrays.asList(
            "SHALL", "SHALL NOT"
    ));

    private final List<String> SHOULD = Collections.unmodifiableList(Arrays.asList(
            "SHOULD", "SHOULD NOT"
    ));

    public void fix() {
        this.fixDatatypes();
        this.fixSegments();
        this.fixConfP();
        this.fixProfileComp();
    }

    public void fixDatatypes() {
        int i = 0;
        List<Datatype> dts = this.datatypeRepo.findByDomainInfoScope(Scope.USER.toString());
        for(Datatype dt: dts) {
            ResourceBinding binding = dt.getBinding();
            if(binding != null && binding.getConformanceStatements() != null) {
                for(ConformanceStatement cs : binding.getConformanceStatements()) {
                    try {
                        if(fixConformanceStatement(cs)) {
                            i++;
                        }
                    } catch (Exception e) {
                        System.out.println("[ERR_CS_STRENGTH] In Datatype " + dt.getId() + " " + e.getMessage());
                    }
                }
                this.datatypeRepo.save(dt);
                System.out.println("[ERR_CS_STRENGTH] In Datatype Changed " + i);

            }

        }
    }

    public void fixSegments() {
        int i = 0;
        List<Segment> sgs = this.segmentRepo.findByDomainInfoScope(Scope.USER.toString());
        for(Segment s: sgs) {
            ResourceBinding binding = s.getBinding();
            if(binding != null && binding.getConformanceStatements() != null) {
                for(ConformanceStatement cs : binding.getConformanceStatements()) {
                    try {
                        if(fixConformanceStatement(cs)) {
                            i++;
                        }
                    } catch (Exception e) {
                        System.out.println("[ERR_CS_STRENGTH] In Segment " + s.getId() + " " + e.getMessage());
                    }
                }
                this.segmentRepo.save(s);
                System.out.println("[ERR_CS_STRENGTH] In Segment Changed " + i);

            }

        }
    }

    public void fixConfP() {
        int i = 0;
        List<ConformanceProfile> cps = this.conformanceProfileRepo.findAll();
        for(ConformanceProfile cp: cps) {
            ResourceBinding binding = cp.getBinding();
            if(binding != null && binding.getConformanceStatements() != null) {
                for(ConformanceStatement cs : binding.getConformanceStatements()) {
                    try {
                        if(fixConformanceStatement(cs)) {
                            i++;
                        }
                    } catch (Exception e) {
                        System.out.println("[ERR_CS_STRENGTH] In Conformance Profile " + cp.getId() + " " + e.getMessage());
                    }
                }
                this.conformanceProfileRepo.save(cp);
                System.out.println("[ERR_CS_STRENGTH] In Conformance Profile Changed " + i);

            }
        }
    }

    public void fixProfileComp() {
        int i = 0;
        List<ProfileComponent> pcs = this.pcRepo.findAll();
        for(ProfileComponent pc: pcs) {
            if(pc.getChildren() != null) {
                for(ProfileComponentContext ctx: pc.getChildren()) {
                    if(ctx.getProfileComponentBindings() != null) {
                        if(ctx.getProfileComponentBindings().getContextBindings() != null) {
                            for(PropertyBinding pb: ctx.getProfileComponentBindings().getContextBindings()) {
                                if(pb instanceof PropertyConformanceStatement) {
                                    PropertyConformanceStatement pbc = (PropertyConformanceStatement) pb;
                                    if(pbc.getPayload() != null) {
                                        try {
                                            if(fixConformanceStatement(pbc.getPayload())) {
                                                i++;
                                            }
                                        } catch (Exception e) {
                                            System.out.println("[ERR_CS_STRENGTH] In Profile Component " + pc.getId() + " context " + ctx.getId() + " " +ctx.getLevel() + " " + e.getMessage());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.pcRepo.save(pc);
        }
        System.out.println("[ERR_CS_STRENGTH] In Profile Component Changed " + i);
    }

    public boolean fixConformanceStatement(ConformanceStatement cs) throws Exception {
        try {
            if(cs instanceof FreeTextConformanceStatement) {
                return this.fixConformanceStatement((FreeTextConformanceStatement) cs);
            } else if(cs instanceof AssertionConformanceStatement) {
                return this.fixConformanceStatement((AssertionConformanceStatement) cs);
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new Exception("Conformance statement " + cs.getId() + " identifier : " + cs.getIdentifier() + " has issue : " + e.getMessage());
        }
    }

    public boolean fixConformanceStatement(FreeTextConformanceStatement cs) throws Exception {
        if(cs.getStrength() == null) {
            cs.setStrength(ConformanceStatementStrength.SHALL);
            return true;
        }
        return false;
    }

    public boolean fixConformanceStatement(AssertionConformanceStatement cs) throws Exception {
        if(cs.getStrength() == null) {
            Assertion assertion = cs.getAssertion();
            List<String> verbs = getVerbs(assertion);
            boolean allShall = !verbs.stream().map(SHALL::contains).collect(Collectors.toList()).contains(false);
            boolean allShould = !verbs.stream().map(SHOULD::contains).collect(Collectors.toList()).contains(false);
            if(verbs.isEmpty()) {
                throw new Exception("No verbs used");
            }

            if(allShall) {
                cs.setStrength(ConformanceStatementStrength.SHALL);
                return true;
            } else if(allShould) {
                cs.setStrength(ConformanceStatementStrength.SHOULD);
                return true;
            } else {
                throw new Exception("Mix usage of SHALL, SHOULD verbs in conformance statement");
            }
        }
        return false;
    }

    public List<String> getVerbs(Assertion assertion) {
        switch (assertion.getMode()) {
            case SIMPLE:
                SingleAssertion singleAssertion = (SingleAssertion) assertion;
                if(!Strings.isNullOrEmpty(singleAssertion.getVerbKey())) {
                    return Arrays.asList(singleAssertion.getVerbKey());
                } else {
                    return Collections.emptyList();
                }
            case IFTHEN:
                IfThenAssertion ifThenAssertion = (IfThenAssertion) assertion;
                return Stream.concat(
                        getVerbs(ifThenAssertion.getIfAssertion()).stream(),
                        getVerbs(ifThenAssertion.getThenAssertion()).stream()
                ).collect(Collectors.toList());
            case ANDOR:
                OperatorAssertion operatorAssertion = (OperatorAssertion) assertion;
                return operatorAssertion.getAssertions().stream().flatMap(
                        op -> getVerbs(op).stream()
                ).collect(Collectors.toList());
            case NOT:
                NotAssertion notAssertion = (NotAssertion) assertion;
                return getVerbs(notAssertion.getChild());
            case SUBCONTEXT:
                SubContextAssertion subContextAssertion = (SubContextAssertion) assertion;
                return getVerbs(subContextAssertion.getChild());
        }

        return Collections.emptyList();
    }

}
