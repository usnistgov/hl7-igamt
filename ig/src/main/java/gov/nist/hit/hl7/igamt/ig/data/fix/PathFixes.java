package gov.nist.hit.hl7.igamt.ig.data.fix;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.Complement;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PathFixes {

    @Autowired
    private IgService igService;
    @Autowired
    private ConformanceProfileService conformanceProfileService;
    @Autowired
    private DatatypeService datatypeService;
    @Autowired
    private SegmentService segmentService;

    public void fix() {
        List<Ig> igs = this.igService.findAll();
        igs.stream().forEach((ig) -> {
            ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
            List<ConformanceProfile> conformanceProfiles = conformanceProfileService.findByIdIn(conformanceProfileRegistry.getLinksAsIds());
           this.fixCP(conformanceProfiles).forEach(conformanceProfileService::save);

            DatatypeRegistry datatypeRegistry = ig.getDatatypeRegistry();
            List<Datatype> datatypes = datatypeService.findByIdIn(datatypeRegistry.getLinksAsIds());
            this.fixDatatypes(datatypes).forEach(t -> {
				try {
					datatypeService.save(t);
				} catch (ForbiddenOperationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});;

            SegmentRegistry segmentRegistry = ig.getSegmentRegistry();
            List<Segment> segments = segmentService.findByIdIn(segmentRegistry.getLinksAsIds());
            this.fixSegments(segments).forEach(t -> {
				try {
					segmentService.save(t);
				} catch (ForbiddenOperationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});
        });
    }

    List<Datatype> fixDatatypes(List<Datatype> datatypes) {
        if(datatypes == null) {
            return null;
        }

        return datatypes.stream().map((dt) -> {
            System.out.println("Fixing Datatype " + dt.getId());
            dt.setBinding(
                    this.fixBinding(
                            dt.getBinding(),
                            Type.DATATYPE,
                            dt.getId()
                    )
            );
            return dt;
        }).collect(Collectors.toList());
    }

    List<Segment> fixSegments(List<Segment> segments) {
        if(segments == null) {
            return null;
        }

        return segments.stream().map((sg) -> {
            System.out.println("Fixing Segment " + sg.getId());
            sg.setBinding(
                    this.fixBinding(
                            sg.getBinding(),
                            Type.SEGMENT,
                            sg.getId()
                    )
            );
            return sg;
        }).collect(Collectors.toList());
    }

    List<ConformanceProfile> fixCP(List<ConformanceProfile> cps) {
        if(cps == null) {
            return null;
        }

        return cps.stream().map((cp) -> {
            System.out.println("Fixing CP " + cp.getId());
            cp.setBinding(
                    this.fixBinding(
                            cp.getBinding(),
                            Type.CONFORMANCEPROFILE,
                            cp.getId()
                    )
            );
            cp.setCoConstraintsBindings(
                    this.fixCoConstraintBindings(
                            cp.getCoConstraintsBindings(),
                            Type.CONFORMANCEPROFILE,
                            cp.getId()
                    )
            );
            return cp;
        }).collect(Collectors.toList());
    }

    List<CoConstraintBinding> fixCoConstraintBindings(List<CoConstraintBinding> coConstraintBindings, Type resourceType, String resourceId) {
        if(coConstraintBindings == null) {
            return null;
        }

        System.out.println("Fixing CoConstraint Context Bindings");

        return coConstraintBindings.stream().map(coConstraintBinding -> {
            coConstraintBinding.getContext().setPath(
                    this.fixPath(coConstraintBinding.getContext().getPath(), resourceType, resourceId)
            );

            coConstraintBinding.getContext().setPathId(this.getPathId(coConstraintBinding.getContext().getPath()));
            coConstraintBinding.setBindings(
                    this.fixSegmentBinding(coConstraintBinding.getBindings(), coConstraintBinding.getContext().getPath(), resourceType, resourceId)
            );
            return coConstraintBinding;
        }).collect(Collectors.toList());
    }

    List<CoConstraintBindingSegment> fixSegmentBinding(List<CoConstraintBindingSegment> coConstraintBindings, InstancePath context, Type resourceType, String resourceId) {
        if(coConstraintBindings == null) {
            return null;
        }

        System.out.println("Fixing CoConstraint Segment Bindings");

        return coConstraintBindings.stream().map(coConstraintBindingSegment -> {
            if(coConstraintBindingSegment.getTables() != null) {
                coConstraintBindingSegment.setTables(
                        coConstraintBindingSegment.getTables().stream().map(table -> {
                            table.setCondition(
                                    this.fixAssertion(
                                            table.getCondition(),
                                            (p) -> this.fixPath(p, resourceType, resourceId)
                                    )
                            );

                            table.setCondition(
                                    this.fixAssertion(
                                            table.getCondition(),
                                            (p) -> this.subPath(context, p)
                                    )
                            );

                            return table;
                        }).collect(Collectors.toList())
                );
            }
            return coConstraintBindingSegment;
        }).collect(Collectors.toList());
    }


    ResourceBinding fixBinding(ResourceBinding binding, Type resourceType, String resourceId) {
        if(binding == null) {
            return null;
        }

        binding.setConformanceStatements(
                this.fixConformanceStatements(binding.getConformanceStatements(),resourceType, resourceId)
        );

        binding.setChildren(
                this.fixStructureElementBinding(
                        binding.getChildren(),
                        resourceType,
                        resourceId
                )
        );

        return binding;
    }

    Set<StructureElementBinding> fixStructureElementBinding(Set<StructureElementBinding> structureElementBindings, Type resourceType, String resourceId){
        if(structureElementBindings == null) {
            return null;
        }

        return structureElementBindings.stream().map((structureElementBinding) -> {
            if(structureElementBinding.getPredicate() != null) {
                structureElementBinding.setPredicate(
                        this.fixPredicate(structureElementBinding.getPredicate(), resourceType, resourceId)
                );
            }
            structureElementBinding.setChildren(
                    this.fixStructureElementBinding(
                            structureElementBinding.getChildren(),
                            resourceType,
                            resourceId
                    )
            );

            return structureElementBinding;
        }).collect(Collectors.toSet());
    }

    Set<ConformanceStatement> fixConformanceStatements(Set<ConformanceStatement> csList, Type resourceType, String resourceId) {
        if(csList == null) {
            return null;
        }

        System.out.println("Fixing Conformance Statements "+ csList.size());
        csList.forEach((cs) -> {
            // Fix Path Id
            this.fixConformanceStatement(cs, (p) -> this.fixPath(p, resourceType, resourceId));
            cs.setContext(this.fixPath(cs.getContext(), resourceType, resourceId));

            // Fix Path & Context
            this.fixConformanceStatement(cs, (p) -> this.subPath(cs.getContext(), p));
        });

        return csList;
    }

    Predicate fixPredicate(Predicate predicate, Type resourceType, String resourceId) {
        if(predicate == null) {
            return null;
        }

        System.out.println("Fixing Predicate");

        // Fix Path Id
        this.fixPredicate(predicate, (p) -> this.fixPath(p, resourceType, resourceId));
        predicate.setContext(this.fixPath(predicate.getContext(), resourceType, resourceId));

        // Fix Path & Context
        this.fixPredicate(predicate, (p) -> this.subPath(predicate.getContext(), p));

        return predicate;
    }

    ConformanceStatement fixConformanceStatement(ConformanceStatement cs, Function<InstancePath, InstancePath> fix) {
        if(cs == null) {
            return null;
        }

        System.out.println("Fixing Conformance Statements "+cs.getIdentifier() + cs.getType());

        if(cs.getContext() != null && !cs.getLevel().equals(Level.GROUP)) {
            System.out.println("Fixing CS Level");
            cs.setLevel(Level.GROUP);
        }

        if(cs.getType().equals(ConstraintType.FREE)) {
            return cs;
        } else {
            AssertionConformanceStatement assertionConformanceStatement = (AssertionConformanceStatement) cs;
            assertionConformanceStatement.setAssertion(this.fixAssertion(assertionConformanceStatement.getAssertion(), fix));
            return assertionConformanceStatement;
        }
    }

    Predicate fixPredicate(Predicate p, Function<InstancePath, InstancePath> fix) {
        if(p == null) {
            return null;
        }

        if(p.getType().equals(ConstraintType.FREE)) {
            return p;
        } else {
            AssertionPredicate assertionPredicate = (AssertionPredicate) p;
            assertionPredicate.setAssertion(this.fixAssertion(assertionPredicate.getAssertion(), fix));
            return assertionPredicate;
        }
    }

    Assertion fixAssertion(Assertion assertion, Function<InstancePath, InstancePath> fix) {
        if(assertion == null) {
            return null;
        }

        switch (assertion.getMode()) {
            case SIMPLE:
                SingleAssertion singleAssertion = (SingleAssertion) assertion;
                singleAssertion.setComplement(this.fixComplement(singleAssertion.getComplement(), fix));
                singleAssertion.setSubject(this.fixSubject(singleAssertion.getSubject(), fix));
                break;
            case NOT:
                NotAssertion notAssertion = (NotAssertion) assertion;
                notAssertion.setChild(this.fixAssertion(notAssertion.getChild(), fix));
                break;
            case ANDOR:
                OperatorAssertion operatorAssertion = (OperatorAssertion) assertion;
                operatorAssertion.setAssertions(operatorAssertion.getAssertions().stream().map(a -> this.fixAssertion(a, fix))
                        .collect(Collectors.toSet()));
                break;
            case IFTHEN:
                IfThenAssertion ifThenAssertion = (IfThenAssertion) assertion;
                ifThenAssertion.setIfAssertion(
                        this.fixAssertion(ifThenAssertion.getIfAssertion(), fix)
                );
                ifThenAssertion.setThenAssertion(
                        this.fixAssertion(ifThenAssertion.getThenAssertion(), fix)
                );
                break;
        }

        return assertion;
    }

    Complement fixComplement(Complement complement, Function<InstancePath, InstancePath> fix) {
        if(complement != null && complement.getPath() != null) {
            complement.setPath(fix.apply(complement.getPath()));
        }
        return complement;
    }

    Subject fixSubject(Subject subject, Function<InstancePath, InstancePath> fix) {
        if(subject != null && subject.getPath() != null) {
            subject.setPath(fix.apply(subject.getPath()));
        }
        return subject;
    }

    InstancePath fixPath(InstancePath path, Type resourceType, String resourceId) {
        System.out.println("Fixing Path");

        if(path != null && !Strings.isNullOrEmpty(path.getElementId()) && (path.getElementId().equals(resourceId) || ObjectId.isValid(path.getElementId()))) {
            System.out.println("FIXED");
            return path.getChild();
        } else {
            return path;
        }
    }

    String getPathId(InstancePath path) {
        if(path == null) {
            return "";
        }

        if(path.getChild() != null && !Strings.isNullOrEmpty(path.getChild().getElementId())) {
            return path.getElementId() + '-' + this.getPathId(path.getChild());
        } else {
            return path.getElementId();
        }
    }

    InstancePath subPath(InstancePath context, InstancePath path) {
        System.out.println("Sub Path");
        if(context != null &&
                path != null &&
                !Strings.isNullOrEmpty(path.getElementId()) &&
                !Strings.isNullOrEmpty(context.getElementId()) &&
                path.getElementId().equals(context.getElementId())
        ) {
            System.out.println("SUBING");
            return this.subPath(context.getChild(), path.getChild());
        } else {
            return path;
        }
    }
}
