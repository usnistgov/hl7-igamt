package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import gov.nist.hit.hl7.igamt.coconstraints.model.CodeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.VariesCell;

/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
*/

import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "propertyKey", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PropertyCardinalityMax.class, name = "CARDINALITYMAX"),
        @JsonSubTypes.Type(value = PropertyCardinalityMin.class, name = "CARDINALITYMIN"),
        @JsonSubTypes.Type(value = PropertyComment.class, name = "COMMENT"),
        @JsonSubTypes.Type(value = PropertyConfLength.class, name = "CONFLENGTH"),
        @JsonSubTypes.Type(value = PropertyConformanceStatement.class, name = "STATEMENT"),
        @JsonSubTypes.Type(value = PropertyConstantValue.class, name = "CONSTANTVALUE"),
        @JsonSubTypes.Type(value = PropertyDatatype.class, name = "DATATYPE"),
        @JsonSubTypes.Type(value = PropertyDynamicMapping.class, name = "DYNAMICMAPPING"),
        @JsonSubTypes.Type(value = PropertyDefinitionText.class, name = "DEFINITIONTEXT"),
        @JsonSubTypes.Type(value = PropertyLengthMax.class, name = "LENGTHMAX"),
        @JsonSubTypes.Type(value = PropertyLengthMin.class, name = "LENGTHMIN"),
        @JsonSubTypes.Type(value = PropertyName.class, name = "NAME"),
        @JsonSubTypes.Type(value = PropertyPredicate.class, name = "PREDICATE"),
        @JsonSubTypes.Type(value = PropertyRef.class, name = "SEGMENTREF"),
        @JsonSubTypes.Type(value = PropertySingleCode.class, name = "SINGLECODE"),    
        @JsonSubTypes.Type(value = PropertyUsage.class, name = "USAGE"),
        @JsonSubTypes.Type(value = PropertyValueSet.class, name = "VALUESET"),
        @JsonSubTypes.Type(value = PropertyLengthType.class, name = "LENGTHTYPE"),
        @JsonSubTypes.Type(value = PropertyCoConstraintBindings.class, name = "COCONSTRAINTBINDINGS"),
})
public abstract class ItemProperty {

  protected PropertyType propertyKey;

  public ItemProperty(PropertyType propertyKey) {
    this.propertyKey = propertyKey;
  }

  public PropertyType getPropertyKey() {
    return propertyKey;
  }

  public void setPropertyKey(PropertyType propertyKey) {
    this.propertyKey = propertyKey;
  }
}
