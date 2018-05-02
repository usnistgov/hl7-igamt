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
package gov.nist.hit.hl7.igamt.valueset.serialization;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeRef;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCode;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 26, 2018.
 */
public class SerializableValueSet extends SerializableResource {

  /**
   * @param valueSet
   * @param position
   */
  public SerializableValueSet(Valueset valueSet, String position) {
    super(valueSet, position);
  }

  @Override
  public Element serialize() throws SerializationException {
    try {
      Element valueSetElement = super.getElement("Valueset");
      Valueset valueSet = (Valueset) this.getAbstractDomain();
      valueSetElement.addAttribute(new Attribute("bindingIdentifier",valueSet.getBindingIdentifier() != null ? valueSet.getBindingIdentifier() : ""));
      valueSetElement.addAttribute(new Attribute("oid",valueSet.getOid() != null ? valueSet.getOid() : ""));
      valueSetElement.addAttribute(new Attribute("intensionalComment",valueSet.getIntensionalComment() != null ? valueSet.getIntensionalComment() : ""));
      valueSetElement.addAttribute(new Attribute("url",valueSet.getUrl() != null ? valueSet.getUrl().toString() : ""));
      valueSetElement.addAttribute(new Attribute("managedBy",valueSet.getManagedBy() != null ? valueSet.getManagedBy().value : ""));
      valueSetElement.addAttribute(new Attribute("stability",valueSet.getStability() != null ? valueSet.getStability().value : ""));
      valueSetElement.addAttribute(new Attribute("contentDefinition",valueSet.getContentDefinition() != null ? valueSet.getContentDefinition().value : ""));
      valueSetElement.addAttribute(new Attribute("numberOfCodes",String.valueOf(valueSet.getNumberOfCodes())));
      valueSetElement.addAttribute(new Attribute("codeSystemIds",valueSet.getCodeSystemIds().size()>0 ? String.join(",", valueSet.getCodeSystemIds()):""));
      if(valueSet.getCodeRefs().size()>0) {
        Element codeRefsElement = new Element("CodeRefs");
        for(CodeRef codeRef : valueSet.getCodeRefs()) {
          Element codeRefElement = new Element("CodeRef");
          codeRefElement.addAttribute(new Attribute("codeId",codeRef.getCodeId() != null ? codeRef.getCodeId() : ""));
          codeRefElement.addAttribute(new Attribute("codeSystemId",codeRef.getCodeSystemId() != null ? codeRef.getCodeSystemId() : ""));
          codeRefElement.addAttribute(new Attribute("position",String.valueOf(codeRef.getPosition())));
          codeRefElement.addAttribute(new Attribute("usage",codeRef.getUsage() != null ? codeRef.getUsage().name() : ""));
          codeRefsElement.appendChild(codeRefElement);
        }
        valueSetElement.appendChild(codeRefsElement);
      }
      if(valueSet.getInternalCodeSystems().size()>0) {
        Element internalCodeSystemsElement = new Element("InternalCodeSystems");
        for(InternalCodeSystem internalCodeSystem : valueSet.getInternalCodeSystems()) {
          Element internalCodeSystemElement = new Element("InternalCodeSystem");
          internalCodeSystemElement.addAttribute(new Attribute("identifier",internalCodeSystem.getIdentifier() != null ? internalCodeSystem.getIdentifier() : ""));
          internalCodeSystemElement.addAttribute(new Attribute("description",internalCodeSystem.getDescription() != null ? internalCodeSystem.getDescription() : ""));
          internalCodeSystemElement.addAttribute(new Attribute("url",internalCodeSystem.getUrl() != null ? internalCodeSystem.getUrl().toString() : ""));
          internalCodeSystemsElement.appendChild(internalCodeSystemElement);
        }
        valueSetElement.appendChild(internalCodeSystemsElement);
      }
      if(valueSet.getCodes().size()>0) {
        Element internalCodesElement = new Element("InternalCodes");
        for(InternalCode internalCode : valueSet.getCodes()) {
          Element internalCodeElement = new Element("InternalCode");
          internalCodeElement.addAttribute(new Attribute("codeSystemId",internalCode.getCodeSystemId() != null ? internalCode.getCodeSystemId() : ""));
          internalCodeElement.addAttribute(new Attribute("description",internalCode.getDescription() != null ? internalCode.getDescription() : ""));
          internalCodeElement.addAttribute(new Attribute("id",internalCode.getId() != null ? internalCode.getId() : ""));
          internalCodeElement.addAttribute(new Attribute("value",internalCode.getValue() != null ? internalCode.getValue() : ""));
          internalCodeElement.addAttribute(new Attribute("usage",internalCode.getUsage() != null ? internalCode.getUsage().name() : ""));
          internalCodesElement.appendChild(internalCodeElement);
        }
        valueSetElement.appendChild(internalCodesElement);
      }
      return valueSetElement;
    } catch (Exception exception) {
      throw new ResourceSerializationException(exception, Type.VALUESET, (Resource) this.getAbstractDomain());
    }
  }
  
  

}
