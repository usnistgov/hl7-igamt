/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.datatype.serialization;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.shared.domain.serialization.SerializableResource;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 15, 2018.
 */
public class SerializableDatatype extends SerializableResource{

  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableDatatype(Datatype datatype, String position) {
    super(datatype, position);
  }

  @Override
  public Element serialize() {
    Element datatypeElement = super.getElement("Datatype");
    Datatype datatype = (Datatype) this.resource;
    datatypeElement.appendChild(super.serializeResourceBinding(datatype.getBinding()));
    if(datatype instanceof ComplexDatatype) {
      datatypeElement = serializeComplexDatatype(datatypeElement);
    } else if (datatype instanceof DateTimeDatatype) {
      datatypeElement = serializeDateTimeDatatype(datatypeElement);
    }
    return datatypeElement;
  }

  private Element serializeComplexDatatype(Element datatypeElement) {
    return datatypeElement;
  }
  
  private Element serializeDateTimeDatatype(Element datatypeElement) {
    return datatypeElement;
  }
  
}
