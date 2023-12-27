package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
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
import java.util.function.Predicate;
import java.util.regex.Pattern;

@Service
public class CommonVerificationService {

	@Autowired
	VerificationEntryService verificationEntryService;
	@Autowired
	DatatypeService datatypeService;

	static final Predicate<String> extensionPattern = Pattern.compile("^[A-Za-z][\\w-]{0,7}$").asPredicate();

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
		LengthType lengthType = element.getLengthType();
		boolean elementAcceptsLength = this.isLengthAllowedElement(element);

		if (!elementAcceptsLength) {
			if (lengthType.equals(LengthType.ConfLength)) {
				results.add(
						this.verificationEntryService.ConfLengthNotAllowed(
								location,
								id,
								type
						)
				);
			}

			if(lengthType.equals(LengthType.Length)) {
				results.add(
						this.verificationEntryService.LengthNotAllowed(
								location,
								id,
								type
						)
				);
			}
		} else {
			if(lengthType.equals(LengthType.Length)) {
				// Check if length range is valid
				if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
					if (!maxLength.equals("*")) {
						if (this.isInt(minLength) && this.isInt(maxLength)) {
							int minLengthInt = Integer.parseInt(minLength);
							int maxLengthInt = Integer.parseInt(maxLength);

							if (minLengthInt > maxLengthInt) {
								results.add(this.verificationEntryService.LengthInvalidRange(location, id, type, minLength,
								                                                             maxLength));
							}
						}
					}
				}

				// Check max length is valid value
				if (this.isNullOrNA(maxLength) || !this.isIntOrStar(maxLength)) {
					results.add(this.verificationEntryService.LengthInvalidMaxLength(location, id, type, nullToEmpty(maxLength)));
				}

				// Check min length is valid value
				if (this.isNullOrNA(minLength) || !this.isInt(minLength)) {
					results.add(this.verificationEntryService.LengthInvalidMinLength(location, id, type, nullToEmpty(minLength)));
				}
			}

			if(lengthType.equals(LengthType.ConfLength)) {
				// Check conf length is valid value
				if (this.isNullOrNA(confLength) || (!confLength.contains("#") && !confLength.contains("="))) {
					results.add(this.verificationEntryService.ConfLengthInvalid(location, id, type, confLength));
				}
			}

			if(lengthType.equals(LengthType.UNSET)) {
				// Check length or conf length is set
				results.add(this.verificationEntryService.LengthOrConfLengthMissing(location, id, type));
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
				results.add(this.verificationEntryService.ConstantInvalidDatatype(location, id, type, element));
			}
			if (element.getUsage().equals(Usage.X)) {
				results.add(this.verificationEntryService.ConstantInvalidUsage(location, id, type));
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
								this.verificationEntryService.ConstantInvalidLengthRange(
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
								this.verificationEntryService.CardinalityInvalidRange(
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
									this.verificationEntryService.CardinalityNotAllowedMaxCardinality(
											location,
											id,
											type,
											max
									)
							);
						} else if (usage.equals(Usage.R) && min < 1) {
							result.add(
									this.verificationEntryService.CardinalityNotAllowedMinZero(
											location,
											id,
											type,
											String.valueOf(min)
									)
							);
						} else if(!usage.equals(Usage.R) && min != 0) {
							result.add(
									this.verificationEntryService.CardinalityNotAllowedMin(
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
						this.verificationEntryService.CardinalityInvalidMaxCardinality(
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

	List<IgamtObjectError> checkExtension(Resource resource, String extension) {
		List<IgamtObjectError> errors = new ArrayList<>();
		if(resource.getDomainInfo().getScope().equals(Scope.USER) && !resource.isGenerated()) {
			if(Strings.isNullOrEmpty(extension)) {
				errors.add(
						this.verificationEntryService.MissingResourceExtension(
								resource.getId(),
								resource.getType(),
								resource.getLabel(),
								resource.getDomainInfo().getVersion()
						)
				);
			} else if(!extensionPattern.test(extension)) {
				errors.add(
						this.verificationEntryService.InvalidResourceExtension(
								resource.getId(),
								resource.getType(),
								resource.getLabel(),
								resource.getDomainInfo().getVersion(),
								extension
						)
				);
			}
		}
		return errors;
	}

	public boolean isNullOrNA(String s) {
		if(s == null)
			return true;
		return s.equals("NA");
	}

	public String nullToEmpty(String s) {
		if(s == null) {
			return "";
		} else {
			return s;
		}
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
