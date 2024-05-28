package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.service.impl.UserResourcePermissionService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ValueSetVerificationService extends VerificationUtils {

	@Autowired
	CodeSetService codeSetService;
	@Autowired
	UserResourcePermissionService userResourcePermissionService;

	List<IgamtObjectError> verifyValueSet(Valueset valueset) {
		switch(valueset.getSourceType()) {
			case EXTERNAL:
				return checkExternal(valueset);
			case INTERNAL:
				return checkCodes(valueset.getCodes(), valueset.getId());
			case INTERNAL_TRACKED:
				return  checkInternalTracked(valueset);
		}
		return this.NoErrors();
	}

	List<IgamtObjectError> checkExternal(Valueset valueset) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if(valueset.getUrl() == null || valueset.getUrl().isEmpty()) {
			issues.add(
					this.entry.ExternalValuesetMissingURL(
							getValueSetLocation("URL"),
							valueset.getId(),
							Type.VALUESET
					)
			);
		} else if(!valueset.getUrl().matches("https?://[^\\s/$.?#].[^\\s]*")) {
			issues.add(
					this.entry.ExternalValuesetInvalidURL(
							getValueSetLocation("URL"),
							valueset.getId(),
							Type.VALUESET,
							valueset.getUrl()
					)
			);
		}
		return issues;
	}

	List<IgamtObjectError> checkInternalTracked(Valueset valueset) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if(valueset.getCodeSetReference().getCodeSetId() == null || valueset.getCodeSetReference().getCodeSetId().isEmpty()) {
			issues.add(
					this.entry.InternalTrackedValuesetMissingCodeSet(
							getValueSetLocation("CodeSet Reference"),
							valueset.getId(),
							Type.VALUESET
					)
			);
		}
		if(userResourcePermissionService.hasPermission(Type.CODESET, valueset.getCodeSetReference().getCodeSetId(), AccessLevel.READ)) {
			try {
				CodeSetVersionContent content = this.codeSetService.getLatestCodeVersion(valueset.getCodeSetReference().getCodeSetId());
				return checkCodes(content.getCodes(), valueset.getId());
			} catch(ResourceNotFoundException e) {
				issues.add(
						this.entry.InternalTrackedValuesetCodeSetNotFound(
								getValueSetLocation("CodeSet Reference"),
								valueset.getId(),
								Type.VALUESET
						)
				);
			}
		} else {
			issues.add(
					this.entry.InternalTrackedValuesetCodeSetNotFound(
							getValueSetLocation("CodeSet Reference"),
							valueset.getId(),
							Type.VALUESET
					)
			);
		}
		return issues;
	}

	List<IgamtObjectError> checkCodes(Set<Code> codes, String valueSetId) {
		List<IgamtObjectError> issues = new ArrayList<>();
		for(Code code: codes) {
			Location codeLocation = getLocation(code);
			issues.addAll(checkCode(code, codeLocation, valueSetId));
			if(!Strings.isBlank(code.getValue()) && !Strings.isBlank(code.getCodeSystem())) {
				boolean duplicate = codes.stream().anyMatch((other) ->
						!other.getId().equals(code.getId()) && code.getValue().equals(other.getValue()) && code.getCodeSystem().equals(other.getCodeSystem())
				);
				if(duplicate) {
					issues.add(
							this.entry.ValuesetDuplicatedCode(
									codeLocation,
									valueSetId,
									Type.VALUESET,
									code.getValue(),
									code.getCodeSystem()
							)
					);
				}
			}
		}
		return issues;
	}

	List<IgamtObjectError> checkCode(Code code, Location location, String valueSetId) {
		List<IgamtObjectError> issues = new ArrayList<>();
		// Check code value
		if (Strings.isBlank(code.getValue())) {
			issues.add(
					this.entry.ValuesetMissingCode(
							location,
							valueSetId,
							Type.VALUESET
					)
			);
		}
		// Check code description
		if (Strings.isBlank(code.getDescription())) {
			issues.add(
					this.entry.ValuesetMissingDescription(
							location,
							valueSetId,
							Type.VALUESET
					)
			);
		}
		// Check code system
		if (Strings.isBlank(code.getCodeSystem())) {
			issues.add(
					this.entry.ValuesetMissingCodeSys(
							location,
							valueSetId,
							Type.VALUESET
					)
			);
		}
		// Check code usage
		if (code.getUsage() == null) {
			issues.add(
					this.entry.ValuesetMissingUsage(
							location,
							valueSetId,
							Type.VALUESET
					)
			);
		}
		return issues;
	}

	String getLocationDisplayName(Code code) {
		String name = "";
		if(!StringUtils.isBlank(code.getValue())) {
			name += code.getValue();
		} else {
			name += "_";
		}
		if(!StringUtils.isBlank(code.getCodeSystem())) {
			name += " (" + code.getCodeSystem() + ")";
		}
		return name;
	}

	Location getLocation(Code code) {
		String name = getLocationDisplayName(code);
		Location codeLocation = new Location();
		codeLocation.setName(name);
		codeLocation.setPathId(code.getId());
		return codeLocation;
	}

	Location getValueSetLocation(String field) {
		Location location = new Location();
		location.setName(field);
		location.setPathId("");
		return location;
	}
}