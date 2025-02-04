package gov.nist.hit.hl7.igamt.ig.model;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

import java.util.HashSet;

import java.util.Set;

public class BindingSummaryItem {

    DisplayElement datatype;
    LocationInfo locationInfo;
    DisplayElement context;
    Set<ValuesetBinding> binding;
    private String valueSet;
    private ValuesetStrength strength;
    private DisplayElement display;
    private Stability stability = Stability.Undefined;
    private Extensibility extensibility = Extensibility.Undefined;
    private ContentDefinition contentDefinition = ContentDefinition.Undefined;
    private int numberOfCodes;

    public ContentDefinition getContentDefinition() {
        return contentDefinition;
    }

    public void setContentDefinition(ContentDefinition contentDefinition) {
        this.contentDefinition = contentDefinition;
    }

    public Extensibility getExtensibility() {
        return extensibility;
    }

    public void setExtensibility(Extensibility extensibility) {
        this.extensibility = extensibility;
    }

    public Stability getStability() {
        return stability;
    }

    public void setStability(Stability stability) {
        this.stability = stability;
    }


    public DisplayElement getDisplay() {
        return display;
    }

    public void setDisplay(DisplayElement display) {
        this.display = display;
    }
    public Set<Integer> getBindingLocation() {
        return bindingLocation;
    }

    public void setBindingLocation(Set<Integer> bindingLocation) {
        this.bindingLocation = bindingLocation;
    }

    public ValuesetStrength getStrength() {
        return strength;
    }

    public void setStrength(ValuesetStrength strength) {
        this.strength = strength;
    }

    public String getValueSet() {
        return valueSet;
    }

    public void setValueSet(String valueSet) {
        this.valueSet = valueSet;
    }

    private Set<Integer> bindingLocation = new HashSet<Integer>();

    Usage usage;

    public Set<ValuesetBinding> getBinding() {
        return binding;
    }

    public void setBinding(Set<ValuesetBinding> binding) {
        this.binding = binding;
    }

    public Usage getUsage() {
        return usage;
    }

    public void setUsage(Usage usage) {
        this.usage = usage;
    }

    public BindingSummaryItem() {
    }
    public DisplayElement getContext() {
        return context;
    }

    public void setContext(DisplayElement context) {
        this.context = context;
    }

    public DisplayElement getDatatype() {
        return datatype;
    }

    public void setDatatype(DisplayElement datatype) {
        this.datatype = datatype;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }

    public BindingSummaryItem(Set<ValuesetBinding> binding, Set<Integer> bindingLocation, DisplayElement context, DisplayElement datatype, LocationInfo locationInfo, ValuesetStrength strength, Usage usage, String valueSet) {
        this.binding = binding;
        this.bindingLocation = bindingLocation;
        this.context = context;
        this.datatype = datatype;
        this.locationInfo = locationInfo;
        this.strength = strength;
        this.usage = usage;
        this.valueSet = valueSet;
    }

    public int getNumberOfCodes() {
        return numberOfCodes;
    }

    public void setNumberOfCodes(int numberOfCodes) {
        this.numberOfCodes = numberOfCodes;
    }
}
