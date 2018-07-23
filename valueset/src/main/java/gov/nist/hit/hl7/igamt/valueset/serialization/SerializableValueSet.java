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

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.DisplayCode;
import gov.nist.hit.hl7.igamt.valueset.domain.display.DisplayCodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetStructure;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 26, 2018.
 */
public class SerializableValueSet extends SerializableResource {

  private int level;
  
  private ValuesetStructure valuesetStructure;

  /**
   * @param valueSet
   * @param position
   */
  public SerializableValueSet(SerializableValuesetStructure serializableValuesetStructure, String position, int level) {
    super(serializableValuesetStructure.getValueset(), position);
    this.level = level;
    this.valuesetStructure = serializableValuesetStructure.getValuesetStructure();
  }

  @Override
  public Element serialize() throws SerializationException {
    try {
      Element valueSetElement = super.getElement(Type.VALUESET);
      Valueset valueSet = (Valueset) this.getAbstractDomain();
      valueSetElement.addAttribute(new Attribute("bindingIdentifier",
          valueSet.getBindingIdentifier() != null ? valueSet.getBindingIdentifier() : ""));
      valueSetElement
          .addAttribute(new Attribute("oid", valueSet.getOid() != null ? valueSet.getOid() : ""));
      valueSetElement.addAttribute(new Attribute("sourceType",
          valueSet.getSourceType() != null ? valueSet.getSourceType().getValue() : ""));
      valueSetElement.addAttribute(new Attribute("intensionalComment",
          valueSet.getIntensionalComment() != null ? valueSet.getIntensionalComment() : ""));
      valueSetElement.addAttribute(
          new Attribute("url", valueSet.getUrl() != null ? valueSet.getUrl().toString() : ""));
      valueSetElement.addAttribute(new Attribute("managedBy",
          valueSet.getManagedBy() != null ? valueSet.getManagedBy().value : ""));
      valueSetElement.addAttribute(new Attribute("stability",
          valueSet.getStability() != null ? valueSet.getStability().value : ""));
      valueSetElement.addAttribute(new Attribute("contentDefinition",
          valueSet.getContentDefinition() != null ? valueSet.getContentDefinition().value : ""));
      valueSetElement.addAttribute(
          new Attribute("numberOfCodes", String.valueOf(valueSet.getNumberOfCodes())));
      valueSetElement.addAttribute(new Attribute("codeSystemIds",
          valueSet.getCodeSystemIds().size() > 0 ? String.join(",", valueSet.getCodeSystemIds())
              : ""));
      Map<String,String> displayCodeSystemNameMap = new HashMap<>();
      for(DisplayCodeSystem displayCodeSystem : this.valuesetStructure.getDisplayCodeSystems()) {
        if(!displayCodeSystemNameMap.containsKey(displayCodeSystem.getCodeSysRef())) {
          displayCodeSystemNameMap.put(displayCodeSystem.getCodeSysRef(), displayCodeSystem.getIdentifier());
        }
      }
      Element codesElement = new Element("Codes");
      if (this.valuesetStructure.getDisplayCodes().size() > 0) {
        for (DisplayCode displayCode : this.valuesetStructure.getDisplayCodes()) {
          Element codeRefElement = new Element("Code");
          codeRefElement.addAttribute(
              new Attribute("codeId", displayCode.getId() != null ? displayCode.getId() : ""));
          codeRefElement.addAttribute(new Attribute("value",
              displayCode.getValue() != null ? displayCode.getValue() : ""));
          codeRefElement.addAttribute(new Attribute("codeSystem",
              displayCode.getCodeSysRef() != null && displayCodeSystemNameMap.containsKey(displayCode.getCodeSysRef().getRef()) ? displayCodeSystemNameMap.get(displayCode.getCodeSysRef().getRef()) : ""));
          codeRefElement.addAttribute(new Attribute("usage",
              displayCode.getUsage() != null ? displayCode.getUsage().name() : ""));
          codeRefElement.addAttribute(new Attribute("description",
              displayCode.getDescription() != null ? displayCode.getDescription() : ""));
          codeRefElement.addAttribute(new Attribute("comment",
              displayCode.getComments() != null ? displayCode.getComments() : ""));
          codesElement.appendChild(codeRefElement);
        }
      }
      valueSetElement.appendChild(codesElement);
      Element codeSystemsElement = new Element("CodeSystems");
      if (this.valuesetStructure.getDisplayCodes().size() > 0) {
        for (DisplayCodeSystem displayCodeSystem : this.valuesetStructure.getDisplayCodeSystems()) {
          Element codeSystemElement = new Element("CodeSystem");
          codeSystemElement.addAttribute(
              new Attribute("codeId", displayCodeSystem.getIdentifier() != null ? displayCodeSystem.getIdentifier() : ""));
          codeSystemElement.addAttribute(new Attribute("codeSysRef",
              displayCodeSystem.getCodeSysRef() != null ? displayCodeSystem.getCodeSysRef() : ""));
          codeSystemElement.addAttribute(new Attribute("description",
              displayCodeSystem.getDescription() != null ? displayCodeSystem.getDescription() : ""));
          codeSystemElement.addAttribute(new Attribute("url",
              displayCodeSystem.getUrl() != null ? displayCodeSystem.getUrl().toExternalForm() : ""));
          codeSystemElement.addAttribute(new Attribute("type",
              displayCodeSystem.getCodeSystemType() != null ? displayCodeSystem.getCodeSystemType().toString() : ""));
          codeSystemsElement.appendChild(codeSystemElement);
        }
      }
      valueSetElement.appendChild(codeSystemsElement);
      return super.getSectionElement(valueSetElement, this.level);
    } catch (Exception exception) {
      throw new ResourceSerializationException(exception, Type.VALUESET,
          (Resource) this.getAbstractDomain());
    }
  }

  @Override
  public Map<String, String> getIdPathMap() {
    // Never used as value sets doesn't have any binding
    return null;
  }



}
