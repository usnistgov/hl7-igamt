package gov.nist.hit.hl7.igamt.common.base.util;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;

import java.util.List;

public class BindingSummaryFilter {
    List<Usage> usages;
    List<Scope> scopes;
    List<String> conformanceProfiles;
    List<ValuesetStrength> bindingStrengths;

    public List<ValuesetStrength> getBindingStrengths() {
        return bindingStrengths;
    }

    public void setBindingStrengths(List<ValuesetStrength> bindingStrengths) {
        this.bindingStrengths = bindingStrengths;
    }

    public List<String> getConformanceProfiles() {
        return conformanceProfiles;
    }

    public void setConformanceProfiles(List<String> conformanceProfiles) {
        this.conformanceProfiles = conformanceProfiles;
    }

    public List<Scope> getScopes() {
        return scopes;
    }

    public void setScopes(List<Scope> scopes) {
        this.scopes = scopes;
    }

    public List<Usage> getUsages() {
        return usages;
    }

    public void setUsages(List<Usage> usages) {
        this.usages = usages;
    }

}
