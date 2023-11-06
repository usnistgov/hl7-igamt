package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ValueSetVerificationService extends VerificationUtils {

	List<IgamtObjectError> verifyValueSet(Valueset valueset) {
		return checkCodes(valueset);
	}

	List<IgamtObjectError> checkCodes(Valueset valueset) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Set<Code> codes = valueset.getCodes();
		for(Code code: codes) {
			Location codeLocation = getLocation(code);
			issues.addAll(checkCode(code, codeLocation, valueset));
			if(!Strings.isBlank(code.getValue()) && !Strings.isBlank(code.getCodeSystem())) {
				boolean duplicate = codes.stream().anyMatch((other) ->
						!other.getId().equals(code.getId()) && code.getValue().equals(other.getValue()) && code.getCodeSystem().equals(other.getCodeSystem())
				);
				if(duplicate) {
					issues.add(
							this.entry.ValuesetDuplicatedCode(
									codeLocation,
									valueset.getId(),
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

	List<IgamtObjectError> checkCode(Code code, Location location, Valueset valueset) {
		List<IgamtObjectError> issues = new ArrayList<>();
		// Check code value
		if (Strings.isBlank(code.getValue())) {
			issues.add(
					this.entry.ValuesetMissingCode(
							location,
							valueset.getId(),
							Type.VALUESET
					)
			);
		}
		// Check code description
		if (Strings.isBlank(code.getDescription())) {
			issues.add(
					this.entry.ValuesetMissingDescription(
							location,
							valueset.getId(),
							Type.VALUESET
					)
			);
		}
		// Check code system
		if (Strings.isBlank(code.getCodeSystem())) {
			issues.add(
					this.entry.ValuesetMissingCodeSys(
							location,
							valueset.getId(),
							Type.VALUESET
					)
			);
		}
		// Check code usage
		if (code.getUsage() == null) {
			issues.add(
					this.entry.ValuesetMissingUsage(
							location,
							valueset.getId(),
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
}