package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class DatatypeVerificationService extends VerificationUtils {

	@Autowired
	ResourceBindingVerificationService resourceBindingVerificationService;
	@Autowired
	CommonVerificationService commonVerificationService;

	List<IgamtObjectError> verifyDatatype(Datatype datatype) {
		List<IgamtObjectError> errors = new ArrayList<>();
		errors.addAll(commonVerificationService.checkExtension(datatype, datatype.getExt()));
		errors.addAll(checkStructure(datatype));
		errors.addAll(resourceBindingVerificationService.verifyDatatypeBindings(datatype));
		return errors;
	}

	List<IgamtObjectError> checkStructure(Datatype datatype) {
		if (datatype instanceof ComplexDatatype) {
			ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
			return this.checkComponents(complexDatatype);
		}
		return this.NoErrors();
	}

	List<IgamtObjectError> checkComponents(ComplexDatatype complexDatatype) {
		List<IgamtObjectError> errors = new ArrayList<>();
		Set<Component> components = complexDatatype.getComponents();
		if(components != null) {
			for(Component component: components) {
				LocationInfo locationInfo = getComponentLocationInfo(complexDatatype.getName(), component);
				// Check Reference
				List<IgamtObjectError> referenceIssues = checkReference(
						component.getRef().getId(),
						Type.DATATYPE,
						complexDatatype.getDocumentInfo(),
						complexDatatype.getId(),
						complexDatatype.getType(),
						locationInfo
				);
				// Check length issues
				List<IgamtObjectError> lengthIssues = commonVerificationService.checkLength(
						component,
						locationInfo,
						complexDatatype.getId(),
						Type.DATATYPE
				);
				// Check constant issues
				List<IgamtObjectError> constantIssues = commonVerificationService.checkConstant(
						component,
						locationInfo,
						complexDatatype.getId(),
						Type.DATATYPE,
						lengthIssues.isEmpty()
				);
				errors.addAll(referenceIssues);
				errors.addAll(lengthIssues);
				errors.addAll(constantIssues);
			}
		}
		return errors;
	}

	private LocationInfo getComponentLocationInfo(String datatype, Component component) {
		String hl7Path = datatype + "-" + component.getPosition();
		LocationInfo locationInfo = new LocationInfo();
		locationInfo.setName(component.getName());
		locationInfo.setType(Type.COMPONENT);
		locationInfo.setPathId(component.getId());
		locationInfo.setPositionalPath(String.valueOf(component.getPosition()));
		locationInfo.setHl7Path(hl7Path);
		return locationInfo;
	}
}
