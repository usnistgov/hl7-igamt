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
package gov.nist.hit.hl7.igamt.valueset.domain.display;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

/**
 * @author jungyubw
 *
 */
public class ValuesetStructure {
  private CompositeKey id;
  private Scope scope;
  private String version;
  private String bindingIdentifier;
  private String name;
  
  
  private Stability stability;
  private Extensibility extensibility;
  private ContentDefinition contentDefinition;
  
  
  private int numberOfCodes;
  private Set<DisplayCodeSystem> displayCodeSystems = new HashSet<DisplayCodeSystem>();
  private Set<DisplayCode> displayCodes;

  public CompositeKey getId() {
    return id;
  }
  public void setId(CompositeKey id) {
    this.id = id;
  }
  public Scope getScope() {
    return scope;
  }
  public void setScope(Scope scope) {
    this.scope = scope;
  }
  public String getVersion() {
    return version;
  }
  public void setVersion(String version) {
    this.version = version;
  }
  public String getBindingIdentifier() {
    return bindingIdentifier;
  }
  public void setBindingIdentifier(String bindingIdentifier) {
    this.bindingIdentifier = bindingIdentifier;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public Set<DisplayCode> getDisplayCodes() {
    return displayCodes;
  }
  public void setDisplayCodes(Set<DisplayCode> displayCodes) {
    this.displayCodes = displayCodes;
  }
  public int getNumberOfCodes() {
    return numberOfCodes;
  }
  public void setNumberOfCodes(int numberOfCodes) {
    this.numberOfCodes = numberOfCodes;
  }
  public Set<DisplayCodeSystem> getDisplayCodeSystems() {
    return displayCodeSystems;
  }
  public void setDisplayCodeSystems(Set<DisplayCodeSystem> displayCodeSystems) {
    this.displayCodeSystems = displayCodeSystems;
  }
  public Stability getStability() {
    return stability;
  }
  public void setStability(Stability stability) {
    this.stability = stability;
  }
  public Extensibility getExtensibility() {
    return extensibility;
  }
  public void setExtensibility(Extensibility extensibility) {
    this.extensibility = extensibility;
  }
  public ContentDefinition getContentDefinition() {
    return contentDefinition;
  }
  public void setContentDefinition(ContentDefinition contentDefinition) {
    this.contentDefinition = contentDefinition;
  }  
}
