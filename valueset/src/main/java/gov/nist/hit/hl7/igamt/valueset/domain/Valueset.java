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
package gov.nist.hit.hl7.igamt.valueset.domain;

import java.net.URL;
import java.util.Set;

import org.bson.types.Code;

import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ManagedBy;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

/**
 * @author jungyubw
 *
 */
public class Valueset extends Resource {
  private String bindingIdentifier;
  private String oid;
  private String intensionalComment;
  private URL url;

  private ManagedBy managedBy = ManagedBy.Internal;
  private Stability stability = Stability.Undefined;
  private Extensibility extensibility = Extensibility.Undefined;
  private ContentDefinition contentDefinition = ContentDefinition.Undefined;
  
  protected int numberOfCodes;
  private Set<String> codeSystemIds;
  private Set<CodeRef> codeRefs;
  private Set<Code> codes;
}
