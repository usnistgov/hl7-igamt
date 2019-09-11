package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;

public class SourceDocument {

    private String id;
    private String name;
    private Scope scope;

    public SourceDocument(String id, String name, Scope scope) {
        this.id = id;
        this.name = name;
        this.scope = scope;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Scope getScope() {
        return scope;
    }

    public void setScope(Scope scope) {
        this.scope = scope;
    }
}
