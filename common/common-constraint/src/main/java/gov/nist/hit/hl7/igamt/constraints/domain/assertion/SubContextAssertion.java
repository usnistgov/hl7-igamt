package gov.nist.hit.hl7.igamt.constraints.domain.assertion;

public class SubContextAssertion extends Assertion {
    private SubContext context;
    private Assertion child;

    public SubContextAssertion() {
        super();
        this.setMode(AssertionMode.SUBCONTEXT);
    }

    public Assertion getChild() {
        return child;
    }

    public void setChild(Assertion child) {
        this.child = child;
    }

    public SubContext getContext() {
        return context;
    }

    public void setContext(SubContext context) {
        this.context = context;
    }
}