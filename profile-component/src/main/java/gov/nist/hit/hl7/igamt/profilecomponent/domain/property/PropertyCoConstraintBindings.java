package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

import java.util.List;

public class PropertyCoConstraintBindings extends ItemProperty implements ApplyConformanceProfile {

    private List<CoConstraintBinding> bindings;

    public PropertyCoConstraintBindings() {
        super(PropertyType.COCONSTRAINTBINDINGS);
    }

    public List<CoConstraintBinding> getBindings() {
        return bindings;
    }

    public void setBindings(List<CoConstraintBinding> bindings) {
        this.bindings = bindings;
    }

    @Override
    public void onConformanceProfile(ConformanceProfile cp) {
        cp.setCoConstraintsBindings(bindings);
    }
}
