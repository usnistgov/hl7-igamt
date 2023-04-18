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
package gov.nist.hit.hl7.igamt.service.impl;

import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.xml.XMLConstants;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.PrimitiveDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CustomProfileError;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport.DocumentTarget;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport.ErrorType;
import gov.nist.hit.hl7.igamt.display.model.XSDVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegMetadata;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VSVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationReport;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationResult;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.ig.service.VerificationEntryService;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service("verificationService")
public class VerificationServiceImpl implements VerificationService {
	@Autowired
	private IgService igService;

	@Autowired
	private ConformanceProfileService conformanceProfileService;

	@Autowired
	private DatatypeService datatypeService;

	@Autowired
	private SegmentService segmentService;

	@Autowired
	private ValuesetService valuesetService;

	@Autowired
	private ResourceBindingVerificationService resourceBindingVerificationService;

	@Autowired
	InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

	@Autowired
	VerificationEntryService verificationEntryService;

	private boolean IXUsageExist = false;

//  @Autowired
//  private PredicateRepository predicateRepository;

	private static String profileXSDurl = "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/Profile.xsd";
	private static String valueSetXSDurl = "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ValueSets.xsd";
	private static String constraintXSDurl = "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ConformanceContext.xsd";

	private XSDVerificationResult verifyXMLByXSD(String xsdURL, String profileXMLStr) {
		try {
			URL schemaFile = new URL(xsdURL);
			Source xmlFile = new StreamSource(new StringReader(profileXMLStr));
			SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
			Schema schema = schemaFactory.newSchema(schemaFile);
			Validator validator = schema.newValidator();
			validator.validate(xmlFile);
			return new XSDVerificationResult(true, null);
		} catch (SAXException e) {
			return new XSDVerificationResult(false, e);
		} catch (IOException e) {
			return new XSDVerificationResult(false, e);
		} catch (Exception e) {
			return new XSDVerificationResult(false, e);
		}
	}

	@Override
	public XMLVerificationReport verifyXMLs(String profileXMLStr, String constraintXMLStr, String valuesetXMLStr) {
		XMLVerificationReport report = new XMLVerificationReport();
		// 1. XML Validation by XSD
		report.setProfileXSDValidationResult(this.verifyXMLByXSD(profileXSDurl, profileXMLStr));
		report.setValueSetXSDValidationResult(this.verifyXMLByXSD(valueSetXSDurl, valuesetXMLStr));
		report.setConstraintsXSDValidationResult(this.verifyXMLByXSD(constraintXSDurl, constraintXMLStr));

		try {
			Document profileDoc = XMLManager.stringToDom(profileXMLStr);
			Document constrintsDoc = XMLManager.stringToDom(constraintXMLStr);
			Document valuesetsDoc = XMLManager.stringToDom(valuesetXMLStr);

			Element messagesElm = (Element) profileDoc.getElementsByTagName("Messages").item(0);
			Element segmentsElm = (Element) profileDoc.getElementsByTagName("Segments").item(0);
			Element datatypesElm = (Element) profileDoc.getElementsByTagName("Datatypes").item(0);

			NodeList messages = messagesElm.getElementsByTagName("Message");
			NodeList segments = segmentsElm.getElementsByTagName("Segment");
			NodeList datatypes = datatypesElm.getElementsByTagName("Datatype");

			HashMap<String, Element> messageMap = new HashMap<String, Element>();
			HashMap<String, Element> segmentMap = new HashMap<String, Element>();
			HashMap<String, Element> datatypeMap = new HashMap<String, Element>();

			for (int i = 0; i < messages.getLength(); i++) {
				Element m = (Element) messages.item(i);
				messageMap.put(m.getAttribute("ID"), m);
			}

			for (int i = 0; i < segments.getLength(); i++) {
				Element s = (Element) segments.item(i);
				segmentMap.put(s.getAttribute("ID"), s);
			}

			for (int i = 0; i < datatypes.getLength(); i++) {
				Element d = (Element) datatypes.item(i);
				datatypeMap.put(d.getAttribute("ID"), d);
			}
			// 2. Checking 5 level Violation
			for (String id : datatypeMap.keySet()) {
				Element dtElm = datatypeMap.get(id);
				NodeList components = dtElm.getElementsByTagName("Component");
				for (int i = 0; i < components.getLength(); i++) {
					Element componentElm = (Element) components.item(i);
					String comnponentDTId = componentElm.getAttribute("Datatype");
					Element componentDTElm = (Element) datatypeMap.get(comnponentDTId);
					NodeList subComponents = componentDTElm.getElementsByTagName("Component");
					for (int j = 0; j < subComponents.getLength(); j++) {
						Element subComponentElm = (Element) subComponents.item(j);
						String subComnponentDTId = subComponentElm.getAttribute("Datatype");
						Element subComponentDTElm = (Element) datatypeMap.get(subComnponentDTId);

						if (subComponentDTElm.getElementsByTagName("Component").getLength() > 0) {
							report.addProfileError(new CustomProfileError(ErrorType.FiveLevelComponent,
									dtElm.getAttribute("Label") + "." + (i + 1) + "." + (j + 1) + " Datatype is "
											+ subComponentDTElm.getAttribute("Label") + ", but it is not primitive.",
									DocumentTarget.DATATYPE, subComnponentDTId));
						}
					}
				}
			}

			// 3. Checking Dynamic Mapping
			HashMap<String[], Element> dmCaseMap = new HashMap<String[], Element>();
			for (String id : segmentMap.keySet()) {
				Element segElm = segmentMap.get(id);
				NodeList dmCases = segElm.getElementsByTagName("Case");

				if (dmCases.getLength() > 0) {
					for (int i = 0; i < dmCases.getLength(); i++) {
						Element dmCaseElm = (Element) dmCases.item(i);
						String[] key = new String[] { dmCaseElm.getAttribute("Value"),
								dmCaseElm.getAttribute("SecondValue") };
						if (dmCaseMap.containsKey(key)) {
							report.addProfileError(new CustomProfileError(ErrorType.DuplicatedDynamicMapping,
									"Segment " + segElm.getAttribute("Label")
											+ " has duplicated Dynamic mapping definition for " + key + ".",
									DocumentTarget.SEGMENT, id));
						} else {
							dmCaseMap.put(key, dmCaseElm);
						}

					}
				}
			}

			// 4. Checking Missing ValueSet
			HashMap<String, Element> valueSetMap = new HashMap<String, Element>();
			NodeList valueSetDefinitions = valuesetsDoc.getElementsByTagName("ValueSetDefinition");
			for (int i = 0; i < valueSetDefinitions.getLength(); i++) {
				Element v = (Element) valueSetDefinitions.item(i);
				valueSetMap.put(v.getAttribute("BindingIdentifier"), v);
			}

			for (String id : segmentMap.keySet()) {
				Element segElm = segmentMap.get(id);
				NodeList fields = segElm.getElementsByTagName("Field");

				for (int i = 0; i < fields.getLength(); i++) {
					Element feildElm = (Element) fields.item(i);
					String bindingIds = feildElm.getAttribute("Binding");
					if (bindingIds != null && !bindingIds.equals("")) {
						for (String bindingId : bindingIds.split("\\:")) {
							if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
								report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
										"ValueSet " + bindingId + " is missing for Segment "
												+ segElm.getAttribute("Label") + "." + (i + 1),
										DocumentTarget.VALUESET, bindingId));
							}
						}
					}
				}
			}

			for (String id : datatypeMap.keySet()) {
				Element dtElm = datatypeMap.get(id);
				NodeList components = dtElm.getElementsByTagName("Component");

				for (int i = 0; i < components.getLength(); i++) {
					Element componentElm = (Element) components.item(i);
					String bindingIds = componentElm.getAttribute("Binding");
					if (bindingIds != null && !bindingIds.equals("")) {
						for (String bindingId : bindingIds.split("\\:")) {
							if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
								report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
										"ValueSet " + bindingId + " is missing for Datatype "
												+ dtElm.getAttribute("Label") + "." + (i + 1),
										DocumentTarget.VALUESET, bindingId));
							}
						}
					}
				}
			}

			NodeList valueSetAssertions = constrintsDoc.getElementsByTagName("ValueSet");
			for (int i = 0; i < valueSetAssertions.getLength(); i++) {
				Element valueSetAssertionElm = (Element) valueSetAssertions.item(i);
				String bindingId = valueSetAssertionElm.getAttribute("ValueSetID");
				if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
					report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
							"ValueSet " + bindingId + " is missing for Constraints.", DocumentTarget.VALUESET,
							bindingId));
				}
			}

		} catch (SAXException e) {
			report.addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));
			;
		} catch (ParserConfigurationException e) {
			report.addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));
			;
		} catch (IOException e) {
			report.addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));
			;
		}

		return report;
	}

	@Override
	public VSVerificationResult verifyValueset(Valueset valueset) {
		VSVerificationResult result = new VSVerificationResult(valueset);

		// 1. Metadata checking - Done
		this.checkingMetadataForValueset(valueset, result);

		// 2. Structure Checking - Done
		this.checkingStructureForValueset(valueset, result);

		this.countErrors(result);

		return result;
	}

	private void countErrors(VerificationResult result) {
		if (result.getErrors() != null) {
			result.getErrors().forEach(error -> {
				if (error.getSeverity() != null) {
					if (error.getSeverity().equals("FATAL")) {
						result.getStats().setFatal(result.getStats().getFatal() + 1);
						result.getStats().setTotal(result.getStats().getTotal() + 1);
					} else if (error.getSeverity().equals("ERROR")) {
						result.getStats().setError(result.getStats().getError() + 1);
						result.getStats().setTotal(result.getStats().getTotal() + 1);
					} else if (error.getSeverity().equals("WARNING")) {
						result.getStats().setWarning(result.getStats().getWarning() + 1);
						result.getStats().setTotal(result.getStats().getTotal() + 1);
					} else if (error.getSeverity().equals("IMFORMATIONAL")) {
						result.getStats().setInformational(result.getStats().getInformational() + 1);
						result.getStats().setTotal(result.getStats().getTotal() + 1);
					}
				}
			});
		}
	}

	@Override
	public DTSegVerificationResult verifyDatatype(Datatype datatype) {
		DTSegVerificationResult result = new DTSegVerificationResult(datatype);

		// 1. Metadata checking
		this.checkingMetadataForDatatype(datatype, result);

		// 2. Structure Checking
		this.checkingStructureForDatatype(datatype, result);

		// 3. Binding Checking
		this.checkingBindingeForDatatype(datatype, result);

		this.countErrors(result);

		return result;
	}

	private void checkingBindingeForDatatype(Datatype datatype, DTSegVerificationResult result) {
		result.getErrors().addAll(resourceBindingVerificationService.verifyDatatypeBindings(datatype));
	}

	private void checkingStructureForValueset(Valueset valueset, VSVerificationResult result) {
		if (valueset.getCodes() != null)
			this.checkingCodes(valueset, valueset.getCodes(), result);
	}

	private void checkingStructureForDatatype(Datatype datatype, DTSegVerificationResult result) {
		if (datatype instanceof PrimitiveDatatype) {
		}

		if (datatype instanceof ComplexDatatype) {
			ComplexDatatype cDt = (ComplexDatatype) datatype;
			this.checkingComponents(cDt, cDt.getComponents(), result);
		}
	}

	private void checkingStructureForConformanceProfile(ConformanceProfile conformanceProfile,
			CPVerificationResult result) {
		this.checkingSegmentRefOrGroups(conformanceProfile, conformanceProfile.getChildren(), result, null, null);
	}

	private void checkingSegmentRefOrGroups(ConformanceProfile conformanceProfile,
			Set<SegmentRefOrGroup> segmentRefOrGroups, CPVerificationResult result, String positionPath, String path) {
		if (segmentRefOrGroups != null) {
			segmentRefOrGroups.forEach(
					srog -> this.checkingSegmentRefOrGroup(conformanceProfile, srog, result, positionPath, path));
		}
	}

	private void checkingSegmentRefOrGroup(ConformanceProfile conformanceProfile, SegmentRefOrGroup srog,
			CPVerificationResult result, String positionPath, String path) {
		if (srog instanceof SegmentRef) {
			this.chekcingSegmentRef(conformanceProfile, (SegmentRef) srog, result, positionPath, path);
		} else if (srog instanceof Group) {
			this.checkingGroup(conformanceProfile, (Group) srog, result, positionPath, path);
		}
	}

	private void chekcingSegmentRef(ConformanceProfile conformanceProfile, SegmentRef sr, CPVerificationResult result,
			String positionPath, String path) {
		int position = sr.getPosition();
		Usage usage = sr.getUsage();
		int min = sr.getMin();
		String max = sr.getMax();
		Ref ref = sr.getRef();
		Segment segment = null;

		if (positionPath == null) {
			positionPath = position + "";
		} else {
			positionPath = positionPath + "." + position;
		}

		if (ref == null || ref.getId() == null) {
		} else {
			segment = this.segmentService.findById(ref.getId());
			if (segment == null)
				segment = this.inMemoryDomainExtensionService.findById(ref.getId(), Segment.class);
			if (segment == null) {
			} else {
				if (path == null) {
					path = segment.getId();
				} else {
					path = path + "." + segment.getId();
				}

				Location location = new Location();
				location.setPathId(path);
				location.setName(segment.getLabel());
				LocationInfo info = new LocationInfo();
				info.setType(Type.SEGMENT);
				info.setName(segment.getLabel());
				info.setPathId(path);
				info.setPositionalPath(positionPath);
				location.setInfo(info);

				if (usage.equals(Usage.IX)) {

					this.IXUsageExist = true;

					if (conformanceProfile.getRole() != null) {
						if (conformanceProfile.getRole().equals(Role.Sender))
							result.getErrors().add(this.verificationEntryService
									.Usage_NOTAllowed_IXUsage_SenderProfile(location, segment.getId(), Type.SEGMENT));
						else if (conformanceProfile.getRole().equals(Role.SenderAndReceiver))
							result.getErrors()
									.add(this.verificationEntryService
											.Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(location,
													segment.getId(), Type.SEGMENT));
					}

				}

				result.getErrors().addAll(
						checkCardinalityVerificationErr(location, segment.getId(), Type.SEGMENT, usage, min, max));

				if (segment.getChildren() != null) {
					segment.getChildren().forEach(field -> {
						String fieldPositionPath = location.getInfo().getPositionalPath() + "." + field.getPosition();
						String fieldPath = location.getInfo().getPathId() + "." + field.getId();
						Location fieldLocation = new Location();
						fieldLocation.setPathId(fieldPath);
						fieldLocation.setName(field.getName());
						LocationInfo fieldInfo = new LocationInfo();
						fieldInfo.setType(Type.FIELD);
						fieldInfo.setName(field.getName());
						fieldInfo.setPathId(fieldPath);
						fieldInfo.setPositionalPath(fieldPositionPath);
						fieldLocation.setInfo(fieldInfo);

						if (field.getUsage().equals(Usage.IX)) {

							this.IXUsageExist = true;

							if (conformanceProfile.getRole() != null) {
								if (conformanceProfile.getRole().equals(Role.Sender))
									result.getErrors()
											.add(this.verificationEntryService.Usage_NOTAllowed_IXUsage_SenderProfile(
													fieldLocation, field.getId(), Type.FIELD));
								else if (conformanceProfile.getRole().equals(Role.SenderAndReceiver))
									result.getErrors()
											.add(this.verificationEntryService
													.Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(fieldLocation,
															field.getId(), Type.FIELD));
							}

						}

						Datatype childDT = this.datatypeService.findById(field.getRef().getId());
						if (childDT == null)
							childDT = this.inMemoryDomainExtensionService.findById(ref.getId(), Datatype.class);
						if (childDT == null) {
						} else {
							if (childDT instanceof ComplexDatatype) {
								ComplexDatatype complexChildDT = (ComplexDatatype) childDT;
								if (complexChildDT.getComponents() != null) {
									complexChildDT.getComponents().forEach(component -> {
										this.travelComponent(result, conformanceProfile, fieldLocation, component);
									});
								}
							}
						}
					});
				}
			}
		}
	}

	private void travelComponent(CPVerificationResult result, ConformanceProfile cp, Location l, Component component) {
		if (component.getUsage().equals(Usage.IX)) {
			this.IXUsageExist = true;
			if (cp.getRole() != null) {
				String componentPositionPath = l.getInfo().getPositionalPath() + "." + component.getPosition();
				String componentdPath = l.getInfo().getPathId() + "." + component.getId();
				Location cLocation = new Location();
				cLocation.setPathId(componentdPath);
				cLocation.setName(component.getName());
				LocationInfo fieldInfo = new LocationInfo();
				fieldInfo.setType(Type.COMPONENT);
				fieldInfo.setName(component.getName());
				fieldInfo.setPathId(componentdPath);
				fieldInfo.setPositionalPath(componentPositionPath);
				cLocation.setInfo(fieldInfo);

				if (cp.getRole().equals(Role.Sender))
					result.getErrors().add(this.verificationEntryService
							.Usage_NOTAllowed_IXUsage_SenderProfile(cLocation, component.getId(), Type.COMPONENT));
				else if (cp.getRole().equals(Role.SenderAndReceiver))
					result.getErrors().add(
							this.verificationEntryService.Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(cLocation,
									component.getId(), Type.COMPONENT));
			}
		}

		Datatype childDT = this.datatypeService.findById(component.getRef().getId());
		if (childDT == null)
			childDT = this.inMemoryDomainExtensionService.findById(component.getRef().getId(), Datatype.class);
		if (childDT == null) {
		} else {
			if (childDT instanceof ComplexDatatype) {
				ComplexDatatype complexChildDT = (ComplexDatatype) childDT;
				if (complexChildDT.getComponents() != null) {
					complexChildDT.getComponents().forEach(childComponent -> {
						this.travelComponent(result, cp, l, childComponent);
					});
				}
			}
		}

	}

	private List<IgamtObjectError> checkConstantErr(SubStructElement e, Location location, String id, Type type,
			String minLength, String maxLength, Usage usage, String constantValue) {
		List<IgamtObjectError> results = new ArrayList<IgamtObjectError>();

		if (constantValue != null) {
			int lengthofConstant = constantValue.length();
			if (!this.isPrimitiveDatatype(e))
				results.add(this.verificationEntryService.Constant_INVALID_Datatype(location, id, type, e));
			else if (e.getUsage().equals(Usage.X))
				results.add(this.verificationEntryService.Constant_INVALID_Usage(location, id, type));
			else {
				if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
					if (!maxLength.equals("*")) {
						if (this.isInt(minLength) && this.isInt(maxLength)) {
							int minLengthInt = Integer.parseInt(minLength);
							int maxLengthInt = Integer.parseInt(maxLength);

							if (minLengthInt > lengthofConstant || lengthofConstant > maxLengthInt) {
								results.add(this.verificationEntryService.Constant_INVALID_LengthRange(location, id,
										type, minLength, maxLength, constantValue));
							}
						}
					} else {
						if (this.isInt(minLength)) {
							int minLengthInt = Integer.parseInt(minLength);

							if (minLengthInt > lengthofConstant) {
								results.add(this.verificationEntryService.Constant_INVALID_LengthRange(location, id,
										type, minLength, maxLength, constantValue));
							}
						}
					}
				}
			}
		}

		return results;
	}

	private List<IgamtObjectError> checkLengthVerificationErr(SubStructElement e, Location location, String id,
			Type type, String minLength, String maxLength, String confLength) {
		List<IgamtObjectError> results = new ArrayList<IgamtObjectError>();

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

		if (!this.isNullOrNA(maxLength)) {
			if (!this.isIntOrStar(maxLength)) {
				results.add(this.verificationEntryService.Length_INVALID_MaxLength(location, id, type, maxLength));
			}
		}

		if (!this.isNullOrNA(minLength)) {
			if (!this.isInt(minLength)) {
				results.add(this.verificationEntryService.Length_INVALID_MinLength(location, id, type, minLength));
			}
		}

		if (!this.isNullOrNA(confLength)) {
			if (!confLength.contains("#") && !confLength.contains("=")) {
				results.add(this.verificationEntryService.ConfLength_INVALID(location, id, type, confLength));
			}
		}

		if (this.isLengthAllowedElement(e)) {
			if (this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) {
				results.add(this.verificationEntryService.LengthorConfLength_Missing(location, id, type));
			}
		}
		return results;
	}

	private List<IgamtObjectError> checkCardinalityVerificationErr(Location location, String id, Type type, Usage usage,
			int min, String max) {
		List<IgamtObjectError> result = new ArrayList<IgamtObjectError>();
		if (max == null) {
		} else {
			if (this.isIntOrStar(max)) {
				if (this.isInt(max)) {
					int maxInt = Integer.parseInt(max);
					if (min > maxInt) {
						result.add(this.verificationEntryService.Cardinality_INVALID_Range(location, id, type, "" + min,
								max));
					} else {
						if (usage != null && usage.equals(Usage.X) && !max.equals("0")) {
							result.add(this.verificationEntryService.Cardinality_NOTAllowed_MAXCardinality(location, id,
									type, max));
						}

						if (usage != null && usage.equals(Usage.R) && min < 1) {
							result.add(this.verificationEntryService.Cardinality_NOTAllowed_MINCardinality1(location,
									id, type, "" + min));
						}

						if (usage != null && !usage.equals(Usage.R) && min != 0) {
							result.add(this.verificationEntryService.Cardinality_NOTAllowed_MINCardinality2(location,
									id, type, usage.getValue(), "" + min));
						}
					}
				}
			} else {
				result.add(this.verificationEntryService.Cardinality_INVALID_MAXCardinality(location, id, type, max));
			}
		}
		return result;
	}

	private void checkUsageVerificationErrorForCP(ConformanceProfile conformanceProfile, String target, Type targetType,
			Object targetMeta, Usage usage, String positionPath, String path, VerificationResult result) {
		if (usage != null && conformanceProfile != null && conformanceProfile.getProfileType() != null) {
			if (conformanceProfile.getProfileType().equals(ProfileType.HL7)) {
				if (!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C)
						|| usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X)
						|| usage.equals(Usage.B) || usage.equals(Usage.W))) {
//                  result.getErrors()
//                          .add(new IgamtObjectError("Usage_Value_Base", target, targetType, targetMeta, "In " + path
//                                  + ", Usage should be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage,
//                                  positionPath + "", "WARNING", "User"));
				}
			} else if (conformanceProfile.getProfileType().equals(ProfileType.Constrainable)) {
				if (!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C)
						|| usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X)
						|| usage.equals(Usage.B))) {
//                  result.getErrors().add(new IgamtObjectError(
//                          "Usage_Value_Constraintable", target, targetType, targetMeta, "In " + path
//                                  + ", Usage should be one of R/RE/C/C(a/b)/O/X/B, " + "Current Usage is " + usage,
//                          positionPath + "", "WARNING", "User"));
				}
			} else if (conformanceProfile.getProfileType().equals(ProfileType.Implementation)) {
				if (!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.CAB)
						|| usage.equals(Usage.X))) {
//                  result.getErrors()
//                          .add(new IgamtObjectError(
//                                  "Usage_Value_Implementable", target, targetType, targetMeta, "In " + path
//                                          + ", Usage should be one of R/RE/C(a/b)/X, " + "Current Usage is " + usage,
//                                  positionPath + "", "WARNING", "User"));
				}
			} else {
				if (!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C)
						|| usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X)
						|| usage.equals(Usage.B) || usage.equals(Usage.W))) {
//                  result.getErrors()
//                          .add(new IgamtObjectError("Usage_Value_Any", target, targetType, targetMeta, "In " + path
//                                  + ", Usage must be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage,
//                                  positionPath + "", "ERROR", "User"));
				}
			}
		}
	}

	private void checkingGroup(ConformanceProfile conformanceProfile, Group group, CPVerificationResult result,
			String positionPath, String path) {
		String name = group.getName();
		int position = group.getPosition();
		Usage usage = group.getUsage();

		int min = group.getMin();
		String max = group.getMax();

		if (positionPath == null) {
			positionPath = position + "";
		} else {
			positionPath = positionPath + "." + position;
		}
		if (!this.isNotNullNotEmpty(name)) {
		} else {
			if (path == null)
				path = group.getId();
			else
				path = path + "." + group.getId();

			Location location = new Location();
			location.setPathId(path);
			location.setName(group.getName());
			LocationInfo info = new LocationInfo();
			info.setType(Type.GROUP);
			info.setName(group.getName());
			info.setPathId(path);
			info.setPositionalPath(positionPath);
			location.setInfo(info);

			if (group.getUsage().equals(Usage.IX)) {
				this.IXUsageExist = true;

				if (conformanceProfile.getRole() != null) {
					if (conformanceProfile.getRole().equals(Role.Sender))
						result.getErrors().add(this.verificationEntryService
								.Usage_NOTAllowed_IXUsage_SenderProfile(location, group.getId(), Type.GROUP));
					else if (conformanceProfile.getRole().equals(Role.SenderAndReceiver))
						result.getErrors()
								.add(this.verificationEntryService.Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(
										location, group.getId(), Type.GROUP));
				}

			}

			result.getErrors()
					.addAll(this.checkCardinalityVerificationErr(location, group.getId(), Type.GROUP, usage, min, max));

			if (group.getChildren() != null && group.getChildren().size() > 0) {
				for (SegmentRefOrGroup child : group.getChildren()) {
					this.checkingSegmentRefOrGroup(conformanceProfile, child, result, positionPath, path);
				}
			}
		}
	}

	/**
	 * @param segment
	 * @param vr
	 */
	private void checkingStructureForSegment(Segment segment, DTSegVerificationResult result) {
		this.checkingFields(segment, segment.getChildren(), result);
	}

	/**
	 * @param segment
	 * @param children
	 * @param vr
	 */
	private void checkingFields(Segment segment, Set<Field> fields, DTSegVerificationResult result) {
		if (fields == null || fields.size() == 0) {
		} else {
			fields.forEach(f -> this.checkingField(segment, f, result));
		}
	}

	/**
	 * @param valueset
	 * @param codes
	 * @param vr
	 */
	private void checkingCodes(Valueset valueset, Set<Code> codes, VSVerificationResult result) {
		codes.forEach(c -> this.checkingCode(valueset, c, result));

	}

	/**
	 * @param components
	 */
	private void checkingComponents(ComplexDatatype cDt, Set<Component> components, DTSegVerificationResult result) {
		components.forEach(c -> this.checkingComponent(cDt, c, result));
	}

	private void checkingCode(Valueset valueset, Code c, VSVerificationResult result) {
		String value = c.getValue();
		String description = c.getDescription();
		String codeSystem = c.getCodeSystem();
		CodeUsage usage = c.getUsage();

		Location location = new Location();
		if (c.getValue() == null)
			location.setName("Missing Value");
		else
			location.setName(c.getValue());
		location.setPathId(c.getId());
		LocationInfo info = new LocationInfo();
		info.setType(Type.CODE);
		info.setName(c.getValue());
		location.setInfo(info);

		if (!this.isNotNullNotEmpty(value))
			result.getErrors().add(
					this.verificationEntryService.Valueset_Missing_Code(location, valueset.getId(), Type.VALUESET));

		if (description == null)
			result.getErrors().add(this.verificationEntryService.Valueset_Missing_Description(location,
					valueset.getId(), Type.VALUESET));

		if (!this.isNotNullNotEmpty(codeSystem))
			result.getErrors().add(
					this.verificationEntryService.Valueset_Missing_CodeSys(location, valueset.getId(), Type.VALUESET));

		if (usage == null) {
			result.getErrors().add(
					this.verificationEntryService.Valueset_Missing_Usage(location, valueset.getId(), Type.VALUESET));
		}

		valueset.getCodes().forEach(otherC -> {
			if (!otherC.getId().equals(c.getId())) {
				if ((otherC.getValue() + "-" + otherC.getCodeSystem()).equals(c.getValue() + "-" + c.getCodeSystem()))
					result.getErrors().add(this.verificationEntryService.Valueset_Duplicated_Code(location,
							valueset.getId(), Type.VALUESET, c.getValue(), c.getCodeSystem()));
			}
		});
	}

	private void checkingComponent(ComplexDatatype cDt, Component c, DTSegVerificationResult result) {
		Location location = new Location();
		location.setPathId(c.getId());
		location.setName(c.getName());
		LocationInfo info = new LocationInfo();
		info.setType(Type.COMPONENT);
		info.setName(cDt.getLabel() + "." + c.getPosition());
		info.setPathId(c.getId());
		info.setPositionalPath("" + c.getPosition());
		location.setInfo(info);

		result.getErrors().addAll(this.checkLengthVerificationErr(c, location, cDt.getId(), Type.DATATYPE,
				c.getMinLength(), c.getMaxLength(), c.getConfLength()));
		result.getErrors().addAll(this.checkConstantErr(c, location, cDt.getId(), Type.DATATYPE, c.getMinLength(),
				c.getMaxLength(), c.getUsage(), c.getConstantValue()));
	}

	private void checkingField(Segment segment, Field f, DTSegVerificationResult result) {
		Location location = new Location();
		location.setPathId(f.getId());
		location.setName(f.getName());
		LocationInfo info = new LocationInfo();
		info.setType(Type.FIELD);
		info.setName(segment.getLabel() + "-" + f.getPosition());
		info.setPathId(f.getId());
		info.setPositionalPath("" + f.getPosition());
		location.setInfo(info);

		result.getErrors().addAll(this.checkLengthVerificationErr(f, location, segment.getId(), Type.SEGMENT,
				f.getMinLength(), f.getMaxLength(), f.getConfLength()));
		result.getErrors().addAll(this.checkCardinalityVerificationErr(location, segment.getId(), Type.SEGMENT,
				f.getUsage(), f.getMin(), f.getMax()));
		result.getErrors().addAll(this.checkConstantErr(f, location, segment.getId(), Type.SEGMENT, f.getMinLength(),
				f.getMaxLength(), f.getUsage(), f.getConstantValue()));
	}

	private boolean isNullOrNA(String s) {
		if (s == null)
			return true;
		if (s.equals("NA"))
			return true;
		return false;
	}

	private boolean isLengthAllowedElement(SubStructElement e) {
		if (e != null) {
			Ref ref = e.getRef();
			if (ref.getId() != null) {
				Datatype childDt = this.datatypeService.findById(ref.getId());
				if (childDt != null)
					return this.isPrimitiveDatatype(childDt);
			}
		}
		return false;
	}

	private boolean isPrimitiveDatatype(SubStructElement e) {
		if (e != null) {
			Ref ref = e.getRef();
			if (ref.getId() != null) {
				Datatype childDt = this.datatypeService.findById(ref.getId());
				if (childDt != null)
					return this.isPrimitiveDatatype(childDt);
			}
		}
		return false;
	}

	private boolean isPrimitiveDatatype(Datatype dt) {
		if (dt instanceof PrimitiveDatatype)
			return true;
		if (dt instanceof DateTimeDatatype)
			return true;
		if (dt instanceof ComplexDatatype) {
			if (((ComplexDatatype) dt).getComponents() == null || ((ComplexDatatype) dt).getComponents().size() == 0)
				return true;
		}
		return false;
	}

//  private boolean hasPredicate(ComplexDatatype cDt, String componentId) {
//    ResourceBinding binding = cDt.getBinding();
//    if(binding == null || binding.getChildren() == null) return false;
//    else {
//      for (StructureElementBinding child : binding.getChildren()) {
//        if(child.getElementId().equals(componentId)) {
//          if(child.getPredicateId() != null) {
//            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
//          }
//        }
//      }
//    }
//    
//    return false;
//  }

//  private boolean hasPredicate(Segment segment, String fieldId) {
//    ResourceBinding binding = segment.getBinding();
//    if(binding == null || binding.getChildren() == null) return false;
//    else {
//      for (StructureElementBinding child : binding.getChildren()) {
//        if(child.getElementId().equals(fieldId)) {
//          if(child.getPredicateId() != null) {
//            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
//          }
//        }
//      }
//    }
//    
//    return false;
//  }

	/**
	 * @param id
	 * @param sebs
	 * @return
	 */
//  private boolean hasPredicate(String elementId, Set<StructureElementBinding> sebs) {
//    if(sebs != null) {
//      for (StructureElementBinding child : sebs) {
//        if(child.getElementId().equals(elementId)) {
//          if(child.getPredicateId() != null) {
//            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
//          }
//        }
//      }
//    }
//    return false;
//  }

	private void checkingMetadataForValueset(Valueset valueset, VSVerificationResult result) {
		if (valueset == null) {

		} else {
			// No metadata ValueSet Rules 10/08/2022
		}
	}

	private void checkingMetadataForDatatype(Datatype datatype, DTSegVerificationResult result) {
		if (datatype == null) {
		} else {

		}
	}

	private void checkingMetadataForSegment(Segment segment, DTSegVerificationResult result) {
	}

	private void checkingMetadataForConformanceProfile(ConformanceProfile conformanceProfile,
			CPVerificationResult result) {
		if (conformanceProfile.getRole() == null || !(conformanceProfile.getRole().equals(Role.Receiver)
				|| conformanceProfile.getRole().equals(Role.Sender)
				|| conformanceProfile.getRole().equals(Role.SenderAndReceiver))) {
			Location location = new Location();
			location.setName(conformanceProfile.getName());
			LocationInfo info = new LocationInfo();
			info.setType(Type.PROFILE);
			info.setName(conformanceProfile.getName());
			location.setInfo(info);

			if (this.IXUsageExist) {
				result.getErrors().add(this.verificationEntryService.Required_ProfileRole_Error(location,
						conformanceProfile.getId(), Type.PROFILE));
			} else {
				result.getErrors().add(this.verificationEntryService.Required_ProfileRole_Warning(location,
						conformanceProfile.getId(), Type.PROFILE));
			}

		}
	}

	private boolean isNotNullNotEmptyNotWhiteSpaceOnly(final String string) {
		return string != null && !string.isEmpty() && !string.trim().isEmpty();
	}

	private boolean isNotNullNotEmpty(final String string) {
		return string != null && !string.isEmpty();
	}

	private boolean containWhiteSpace(final String string) {
		return string != null && !string.matches("\\S+");
	}

	private boolean isInt(String s) {
		try {
			Integer.parseInt(s);
			return true;
		}

		catch (NumberFormatException er) {
			return false;
		}
	}

	private boolean isIntOrStar(String s) {
		try {
			Integer.parseInt(s);
			return true;
		}

		catch (NumberFormatException er) {
			if (s.equals("*"))
				return true;
			return false;
		}
	}

	@Override
	public DTSegVerificationResult verifySegment(Segment segment) {
		DTSegVerificationResult result = new DTSegVerificationResult(segment);

		// 1. Metadata checking
		this.checkingMetadataForSegment(segment, result);

		// 2. Structure Checking
		this.checkingStructureForSegment(segment, result);

		// 3. DynamicMapping Checking
		this.checkingDynamicMapping(segment, result);

		// 4. Binding Checking
		this.checkingBindingMapping(segment, result);

		this.countErrors(result);

		return result;
	}

	private void checkingBindingMapping(Segment segment, DTSegVerificationResult result) {
		List<IgamtObjectError> bindingErrors = this.resourceBindingVerificationService.verifySegmentBindings(segment);
		if (bindingErrors != null) {
			for (IgamtObjectError e : bindingErrors) {
				if (e.getTargetMeta() == null) {
					e.setTargetMeta(new DTSegMetadata(segment));
				}
			}
		}
		result.getErrors().addAll(bindingErrors);
	}

	/**
	 * @param segment
	 * @param vr
	 */
	private void checkingDynamicMapping(Segment segment, DTSegVerificationResult result) {
	}

	@Override
	public CPVerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile) {
		CPVerificationResult result = new CPVerificationResult(conformanceProfile);

		this.IXUsageExist = false;

		// 2. Structure Checking
		this.checkingStructureForConformanceProfile(conformanceProfile, result);

		// 1. Metadata checking
		this.checkingMetadataForConformanceProfile(conformanceProfile, result);

		// 3. Binding Checking
		this.checkingBindingForConformanceProfile(conformanceProfile, result);

		this.countErrors(result);

		return result;
	}

	private void checkingBindingForConformanceProfile(ConformanceProfile conformanceProfile,
			CPVerificationResult result) {
		result.getErrors()
				.addAll(this.resourceBindingVerificationService.verifyConformanceProfileBindings(conformanceProfile));

	}

	@Override
	public VerificationReport verifyIg(String igId) {
		return verifyIg(this.igService.findById(igId));
	}

	@Override
	public VerificationReport verifyIg(Ig ig) {
		VerificationReport report = new VerificationReport();
		IgVerificationResult result = new IgVerificationResult(ig);

		ValueSetRegistry valueSetRegistry = ig.getValueSetRegistry();

		if (valueSetRegistry.getChildren() != null) {
			for (Link l : valueSetRegistry.getChildren()) {
				String id = l.getId();
				Valueset vs = this.valuesetService.findById(id);
				if (vs == null) {
				} else {
					VSVerificationResult vsVerificationResult = this.verifyValueset(vs);
					if (vsVerificationResult.getStats().getTotal() > 0) {
						report.addValuesetVerificationResult(vsVerificationResult);
						report.addStats(vsVerificationResult.getStats());
					}
				}
			}
		}

		DatatypeRegistry datatypeRegistry = ig.getDatatypeRegistry();
		if (datatypeRegistry.getChildren() != null) {
			for (Link l : datatypeRegistry.getChildren()) {
				String id = l.getId();
				Datatype dt = this.datatypeService.findById(id);
				if (dt == null)
					dt = inMemoryDomainExtensionService.findById(id, ComplexDatatype.class);
				if (dt == null) {
				} else {
					DTSegVerificationResult dtSegVerificationResult = this.verifyDatatype(dt);
					if (dtSegVerificationResult.getStats().getTotal() > 0) {
						report.addDatatypeVerificationResult(dtSegVerificationResult);
						report.addStats(dtSegVerificationResult.getStats());
					}
				}
			}
		}

		SegmentRegistry segmentRegistry = ig.getSegmentRegistry();
		if (segmentRegistry.getChildren() != null) {
			for (Link l : segmentRegistry.getChildren()) {
				String id = l.getId();
				Segment s = this.segmentService.findById(id);
				if (s == null)
					s = inMemoryDomainExtensionService.findById(id, Segment.class);
				if (s == null) {
				} else {
					DTSegVerificationResult dtSegVerificationResult = this.verifySegment(s);
					if (dtSegVerificationResult.getStats().getTotal() > 0) {
						report.addSegmentVerificationResult(dtSegVerificationResult);
						report.addStats(dtSegVerificationResult.getStats());
					}
				}
			}
		}

		ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
		if (conformanceProfileRegistry.getChildren() != null) {
			for (Link l : conformanceProfileRegistry.getChildren()) {
				String id = l.getId();
				ConformanceProfile cp = this.conformanceProfileService.findById(id);
				if (cp == null)
					cp = inMemoryDomainExtensionService.findById(id, ConformanceProfile.class);
				if (cp == null) {
				} else {
					CPVerificationResult cpVerificationResult = this.verifyConformanceProfile(cp);
					if (cpVerificationResult.getStats().getTotal() > 0) {
						report.addConformanceProfileVerificationResult(cpVerificationResult);
						report.addStats(cpVerificationResult.getStats());
					}
				}

			}
		}

		report.setIgVerificationResult(result);
		return report;
	}

}
