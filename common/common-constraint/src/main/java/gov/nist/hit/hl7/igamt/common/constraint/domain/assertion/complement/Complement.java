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
package gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * @author jungyubw
 *
 */


@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "complementKey")
@JsonSubTypes({@JsonSubTypes.Type(value = PresenceComplement.class, name = "PRESENCE"),
               @JsonSubTypes.Type(value = SameValueComplement.class, name = "SAMEVALUE"),
               @JsonSubTypes.Type(value = CompareValueComplement.class, name = "COMPAREVALUE"),
               @JsonSubTypes.Type(value = CompareNodeComplement.class, name = "COMPARENODE"),
               @JsonSubTypes.Type(value = FormattedComplement.class, name = "FORMATTED"),
               @JsonSubTypes.Type(value = ListValuesComplement.class, name = "LISTVALUE"),
               @JsonSubTypes.Type(value = ValuesetComplement.class, name = "VALUESET"),
               @JsonSubTypes.Type(value = GenericComplement.class, name = "GENERIC")})

public abstract class Complement {
	
  protected ComplementKey complementKey;

  public ComplementKey getComplementKey() {
    return complementKey;
  }

  public void setComplementKey(ComplementKey complementKey) {
    this.complementKey = complementKey;
  }
  
  
}
