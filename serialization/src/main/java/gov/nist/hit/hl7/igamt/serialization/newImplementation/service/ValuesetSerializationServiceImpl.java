    
package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.export.configuration.domain.CodeUsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ValueSetExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ValuesetSerializationServiceImpl implements ValuesetSerializationService{

	@Autowired
	private IgDataModelSerializationService igDataModelSerializationService;
	
	@Override
	public Element serializeValueSet(ValuesetDataModel valuesetDataModel, int level,
			ValueSetExportConfiguration valueSetExportConfiguration) throws ResourceSerializationException {
	    try {
		  Element valueSetElement = igDataModelSerializationService.serializeResource(valuesetDataModel.getModel(), Type.VALUESET, valueSetExportConfiguration);
	      Valueset valueSet = valuesetDataModel.getModel();
	      valueSetElement.addAttribute(new Attribute("bindingIdentifier",
	          valueSet.getBindingIdentifier() != null ? valueSet.getBindingIdentifier() : ""));
	      System.out.println("bindingID here : " + valueSet.getName() + " " + valueSet.getBindingIdentifier() );
	      valueSetElement
	          .addAttribute(new Attribute("oid", valueSet.getOid() != null ? valueSet.getOid() : ""));
	      if(valueSetExportConfiguration.isType()) {
	      valueSetElement.addAttribute(new Attribute("sourceType",
	          valueSet.getSourceType() != null ? valueSet.getSourceType().getValue() : ""));}
	      valueSetElement.addAttribute(new Attribute("intensionalComment",
	          valueSet.getIntensionalComment() != null ? valueSet.getIntensionalComment() : ""));
	      if(valueSetExportConfiguration.isuRL()) {
	      valueSetElement.addAttribute(
	          new Attribute("url", valueSet.getUrl() != null ? valueSet.getUrl().toString() : ""));}
//	      valueSetElement.addAttribute(new Attribute("managedBy",
//	          valueSet.getManagedBy() != null ? valueSet.getManagedBy().value : ""));
	      if(valueSetExportConfiguration.isStability()) {
	      valueSetElement.addAttribute(new Attribute("stability",
	          valueSet.getStability() != null ? valueSet.getStability().value : ""));}
	      if(valueSetExportConfiguration.isExtensibility()) {
	      valueSetElement.addAttribute(new Attribute("extensibility",
	          valueSet.getExtensibility() != null ? valueSet.getExtensibility().value : ""));}
	      if(valueSetExportConfiguration.isContentDefinition()) {
	      valueSetElement.addAttribute(new Attribute("contentDefinition",
	          valueSet.getContentDefinition() != null ? valueSet.getContentDefinition().value : ""));}
	      valueSetElement.addAttribute(
	          new Attribute("numberOfCodes", String.valueOf(valueSet.getNumberOfCodes())));
	      valueSetElement.addAttribute(new Attribute("codeSystemIds",getCodSystemDispaly(valueSet.getCodeSystems())));

	   
	      Element codesElement = new Element("Codes");
	      if (valueSet.getCodes().size() > 0) {

	        for (Code displayCode : valueSet.getCodes()) {
	            if (displayCode != null && CheckUsageForValueSets(valueSetExportConfiguration.getCodesExport(), displayCode.getUsage())) {
	          Element codeRefElement = new Element("Code");
	          codeRefElement.addAttribute(
	              new Attribute("codeId", displayCode.getId() != null ? displayCode.getId() : ""));
	          codeRefElement.addAttribute(new Attribute("value",
	              displayCode.getValue() != null ? displayCode.getValue() : ""));
	          codeRefElement.addAttribute(new Attribute("codeSystem", displayCode.getCodeSystem()));
	          codeRefElement.addAttribute(new Attribute("usage",
	              displayCode.getUsage() != null ? displayCode.getUsage().name() : ""));
	          codeRefElement.addAttribute(new Attribute("description",
	              displayCode.getDescription() != null ? displayCode.getDescription() : ""));
	          codeRefElement.addAttribute(new Attribute("comment",
	              displayCode.getComments() != null ? displayCode.getComments() : ""));
	          codesElement.appendChild(codeRefElement);
	        }
	      }
	      }
	      valueSetElement.appendChild(codesElement);
//	      Element codeSystemsElement = new Element("CodeSystems");
//	      if (this.valuesetStructure.getDisplayCodes().size() > 0) {
//	        for (DisplayCodeSystem displayCodeSystem : this.valuesetStructure.getDisplayCodeSystems()) {
//	          Element codeSystemElement = new Element("CodeSystem");
//	          codeSystemElement.addAttribute(
//	              new Attribute("codeId", displayCodeSystem.getIdentifier() != null ? displayCodeSystem.getIdentifier() : ""));
//	          codeSystemElement.addAttribute(new Attribute("codeSysRef",
//	              displayCodeSystem.getCodeSysRef() != null ? displayCodeSystem.getCodeSysRef() : ""));
//	          codeSystemElement.addAttribute(new Attribute("description",
//	              displayCodeSystem.getDescription() != null ? displayCodeSystem.getDescription() : ""));
//	          codeSystemElement.addAttribute(new Attribute("url",
//	              displayCodeSystem.getUrl() != null ? displayCodeSystem.getUrl().toExternalForm() : ""));
//	          codeSystemElement.addAttribute(new Attribute("type",
//	              displayCodeSystem.getCodeSystemType() != null ? displayCodeSystem.getCodeSystemType().toString() : ""));
//	          codeSystemsElement.appendChild(codeSystemElement);
//	        }
//	      }
//	      valueSetElement.appendChild(codeSystemsElement);
	      return igDataModelSerializationService.getSectionElement(valueSetElement, valuesetDataModel.getModel(), level, valueSetExportConfiguration );

	    } catch (Exception exception) {
	      throw new ResourceSerializationException(exception, Type.VALUESET,
	    		  valuesetDataModel.getModel());
	    }
	  
	}
	
	public  Boolean CheckUsageForValueSets(CodeUsageConfiguration usageConfiguration, CodeUsage usage) {
	return usageConfiguration.isR() && usage.equals(CodeUsage.R) ||
			usageConfiguration.isP() && usage.equals(CodeUsage.P) ||
			usageConfiguration.isE() && usage.equals(CodeUsage.E);
			
}

	private String getCodSystemDispaly(Set<String> codeSystems) {
		if(codeSystems !=null && !codeSystems.isEmpty()) {
			return String.join(",", codeSystems);
		}else {
			return "No code system applied";
		}
	}

}

