package gov.nist.hit.hl7.igamt.ig.data.fix;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.Complement;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PathFixes {

    List<ConformanceStatement> fixConformanceStatements(List<ConformanceStatement> csList, Type resourceType, String resourceId) {
        csList.forEach((cs) -> {
            // Fix Path Id
            this.fixConformanceStatement(cs, (p) -> this.fixPath(p, resourceType, resourceId));
            cs.setContext(this.fixPath(cs.getContext(), resourceType, resourceId));

            // Fix Path & Context
            this.fixConformanceStatement(cs, (p) -> this.subPath(cs.getContext(), p));
        });

        return csList;
    }

    List<Predicate> fixPredicates(List<Predicate> pList, Type resourceType, String resourceId) {
        pList.forEach((pr) -> {
            // Fix Path Id
            this.fixPredicate(pr, (p) -> this.fixPath(p, resourceType, resourceId));
            pr.setContext(this.fixPath(pr.getContext(), resourceType, resourceId));

            // Fix Path & Context
            this.fixPredicate(pr, (p) -> this.subPath(pr.getContext(), p));
        });

        return pList;
    }

    ConformanceStatement fixConformanceStatement(ConformanceStatement cs, Function<Path, Path> fix) {
        if(cs.getType().equals(ConstraintType.FREE)) {
            return cs;
        } else {
            AssertionConformanceStatement assertionConformanceStatement = (AssertionConformanceStatement) cs;
            assertionConformanceStatement.setAssertion(this.fixAssertion(assertionConformanceStatement.getAssertion(), fix));
            return assertionConformanceStatement;
        }
    }

    Predicate fixPredicate(Predicate p, Function<Path, Path> fix) {
        if(p.getType().equals(ConstraintType.FREE)) {
            return p;
        } else {
            AssertionPredicate assertionPredicate = (AssertionPredicate) p;
            assertionPredicate.setAssertion(this.fixAssertion(assertionPredicate.getAssertion(), fix));
            return assertionPredicate;
        }
    }

    Assertion fixAssertion(Assertion assertion, Function<Path, Path> fix) {
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

    Complement fixComplement(Complement complement, Function<Path, Path> fix) {
        if(complement != null && complement.getPath() != null) {
            complement.setPath(fix.apply(complement.getPath()));
        }
        return complement;
    }

    Subject fixSubject(Subject subject, Function<Path, Path> fix) {
        if(subject != null && subject.getPath() != null) {
            subject.setPath(fix.apply(subject.getPath()));
        }
        return subject;
    }

    Path fixPath(Path path, Type resourceType, String resourceId) {
        if(path != null && !Strings.isNullOrEmpty(path.getElementId()) && path.getElementId().equals(resourceId)) {
            return path.getChild();
        } else {
            return path;
        }
    }

    String getPathId(Path path) {
        if(path == null || Strings.isNullOrEmpty(path.getChild().getElementId())) {
            return "";
        }

        if(path.getChild() != null && !Strings.isNullOrEmpty(path.getChild().getElementId())) {
            return path.getElementId() + '-' + this.getPathId(path.getChild());
        } else {
            return path.getElementId();
        }
    }

    Path subPath(Path context, Path path) {
        if(context != null &&
                path != null &&
                !Strings.isNullOrEmpty(path.getElementId()) &&
                !Strings.isNullOrEmpty(context.getElementId()) &&
                path.getElementId().equals(context.getElementId())
        ) {
            return this.subPath(context.getChild(), path.getChild());
        } else {
            return path;
        }
    }
}
