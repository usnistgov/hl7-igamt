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
package gov.nist.hit.hl7.igamt.datatypeLibrary.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;


/**
 * @author ena3
 *
 */
@Document
public class DatatypeLibrary extends AbstractDomain {
  private DocumentMetadata metadata;
  private Set<TextSection> content = new HashSet<TextSection>();

  private DatatypeRegistry datatypeRegistry = new DatatypeRegistry();
  private ValueSetRegistry valueSetRegistry = new ValueSetRegistry();

  public DocumentMetadata getMetadata() {
    return this.metadata;
  }

  public void setMetadata(DocumentMetadata metadata) {
    this.metadata = metadata;
  }

  public Set<TextSection> getContent() {
    return content;
  }

  public void setContent(Set<TextSection> content) {
    this.content = content;
  }

  public DatatypeRegistry getDatatypeRegistry() {
    return datatypeRegistry;
  }

  public void setDatatypeRegistry(DatatypeRegistry datatypeRegistry) {
    this.datatypeRegistry = datatypeRegistry;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    // TODO Auto-generated method stub
    return null;
  }

  public ValueSetRegistry getValueSetRegistry() {
    return valueSetRegistry;
  }

  public void setValueSetRegistry(ValueSetRegistry valueSetRegistry) {
    this.valueSetRegistry = valueSetRegistry;
  }
}
