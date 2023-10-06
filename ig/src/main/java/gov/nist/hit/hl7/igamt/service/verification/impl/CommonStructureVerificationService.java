package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.PrimitiveDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.service.verification.VerificationEntryService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommonStructureVerificationService {

	@Autowired
	VerificationEntryService verificationEntryService;
	@Autowired
	DatatypeService datatypeService;

	List<IgamtObjectError> checkLength(
			SubStructElement element,
			LocationInfo location,
			String id,
			Type type
	) {
		List<IgamtObjectError> results = new ArrayList<>();
		String minLength = element.getMinLength();
		String maxLength = element.getMaxLength();
		String confLength = element.getConfLength();

		if (!this.isLengthAllowedElement(element)) {
			if (!this.isNullOrNA(confLength)) {
				// TODO : No conf length where not allowed
			}

			if(this.isNullOrNA(minLength) || this.isNullOrNA(maxLength)) {
				// TODO : No min/max where not allowed
			}
		} else {
			// Check if length range is valid
			if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
				if (!maxLength.equals("*")) {
					if (this.isInt(minLength) && this.isInt(maxLength)) {
						int minLengthInt = Integer.parseInt(minLength);
						int maxLengthInt = Integer.parseInt(maxLength);

						if (minLengthInt > maxLengthInt) {
							results.add(this.verificationEntryService.Length_INVALID_Range(location, id, type, minLength,
									maxLength));
						}
					}
				}
			}

			// Check max length is valid value
			if (!this.isNullOrNA(maxLength)) {
				if (!this.isIntOrStar(maxLength)) {
					results.add(this.verificationEntryService.Length_INVALID_MaxLength(location, id, type, maxLength));
				}
			}

			// Check min length is valid value
			if (!this.isNullOrNA(minLength)) {
				if (!this.isInt(minLength)) {
					results.add(this.verificationEntryService.Length_INVALID_MinLength(location, id, type, minLength));
				}
			}

			// Check conf length is valid value
			if (!this.isNullOrNA(confLength)) {
				if (!confLength.contains("#") && !confLength.contains("=")) {
					results.add(this.verificationEntryService.ConfLength_INVALID(location, id, type, confLength));
				}
			}

			// Check length or conf length is set
			if (this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) {
				results.add(this.verificationEntryService.LengthorConfLength_Missing(location, id, type));
			}
		}
		return results;
	}

	public List<IgamtObjectError> checkConstant(
			SubStructElement element,
			LocationInfo location,
			String id,
			Type type,
			boolean checkLength
	) {
		List<IgamtObjectError> results = new ArrayList<>();
		String constantValue = element.getConstantValue();

		if (!StringUtils.isBlank(constantValue)) {
			if (!this.isPrimitiveDatatype(element)) {
				results.add(this.verificationEntryService.Constant_INVALID_Datatype(location, id, type, element));
			}
			if (element.getUsage().equals(Usage.X)) {
				results.add(this.verificationEntryService.Constant_INVALID_Usage(location, id, type));
			}

			if(results.isEmpty() && checkLength) {
				String minLength = element.getMinLength();
				String maxLength = element.getMaxLength();
				if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
					int constantLength = constantValue.length();
					boolean passMinLength = true;
					boolean passMaxLength = true;
					// Check min length
					if(this.isInt(minLength)) {
						int minLengthInt = Integer.parseInt(minLength);
						if(minLengthInt > constantLength) {
							passMinLength = false;
						}
					}
					// Check max length
					if(passMinLength && !maxLength.equals("*")) {
						int maxLengthInt = Integer.parseInt(maxLength);
						if(maxLengthInt < constantLength) {
							passMaxLength = false;
						}
					}

					if(!passMinLength || !passMaxLength) {
						results.add(
								this.verificationEntryService.Constant_INVALID_LengthRange(
										location,
										id,
										type,
										minLength,
										maxLength,
										constantValue
								)
						);
					}
				}
			}
		}

		return results;
	}

	public List<IgamtObjectError> checkCardinality(
			LocationInfo location,
			String id,
			Type type,
			Usage usage,
			int min,
			String max
	) {
		List<IgamtObjectError> result = new ArrayList<>();
		if (!StringUtils.isBlank(max)) {
			if (this.isIntOrStar(max)) {
				if (this.isInt(max)) {
					int maxInt = Integer.parseInt(max);
					if (min > maxInt) {
						result.add(
								this.verificationEntryService.Cardinality_INVALID_Range(
										location,
										id,
										type,
										String.valueOf(min),
										max
								)
						);
					} else if(usage != null){
						if (usage.equals(Usage.X) && !max.equals("0")) {
							result.add(
									this.verificationEntryService.Cardinality_NOTAllowed_MAXCardinality(
											location,
											id,
											type,
											max
									)
							);
						} else if (usage.equals(Usage.R) && min < 1) {
							result.add(
									this.verificationEntryService.Cardinality_NOTAllowed_MINCardinality1(
											location,
											id,
											type,
											String.valueOf(min)
									)
							);
						} else if(!usage.equals(Usage.R) && min != 0) {
							result.add(
									this.verificationEntryService.Cardinality_NOTAllowed_MINCardinality2(
											location,
											id,
											type,
											usage.getValue(),
											String.valueOf(min)
									)
							);
						}
					}
				}
			} else {
				result.add(
						this.verificationEntryService.Cardinality_INVALID_MAXCardinality(
								location,
								id,
								type,
								max
						)
				);
			}
		}
		return result;
	}

	public boolean isNullOrNA(String s) {
		if(s == null)
			return true;
		return s.equals("NA");
	}

	public boolean isInt(String s) {
		try {
			Integer.parseInt(s);
			return true;
		}
		catch (NumberFormatException er) {
			return false;
		}
	}

	public boolean isIntOrStar(String s) {
		try {
			Integer.parseInt(s);
			return true;
		}
		catch (NumberFormatException er) {
			return s.equals("*");
		}
	}

	public boolean isLengthAllowedElement(SubStructElement element) {
		return this.isPrimitiveDatatype(element);
	}

	public boolean isPrimitiveDatatype(SubStructElement element) {
		if (element != null) {
			Ref ref = element.getRef();
			if (ref.getId() != null) {
				Datatype child = this.datatypeService.findById(ref.getId());
				if (child != null)
					return this.isPrimitiveDatatype(child);
			}
		}
		return false;
	}

	public boolean isPrimitiveDatatype(Datatype dt) {
		return dt instanceof PrimitiveDatatype;
	}
}
