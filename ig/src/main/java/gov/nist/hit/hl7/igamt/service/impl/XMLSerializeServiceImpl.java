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
import java.io.InputStream;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.*;
import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

// import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.SlicingMethod;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.model.CoConstraintMappingLocation;
import gov.nist.hit.hl7.igamt.ig.model.CoConstraintOBX3MappingValue;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.exception.AmbiguousOBX3MappingException;
import gov.nist.hit.hl7.igamt.service.impl.exception.CoConstraintXMLSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeComponentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.FieldSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GroupSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.MessageSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.SegmentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import nu.xom.Attribute;
import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Elements;
import nu.xom.Node;
import nu.xom.NodeFactory;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

/**
 * @author jungyubw
 *
 */
@Service("xMLSerializeService")
public class XMLSerializeServiceImpl implements XMLSerializeService {
	@Autowired
	ConfigService configService;

	@Autowired
	DatatypeService datatypeService;

	@Autowired
	SegmentService segmentService;

	@Autowired
	ValuesetService valuesetService;

	@Autowired
	IgService igService;

	@Autowired
	ConformanceProfileService conformanceProfileService;

	@Autowired
	SimpleCoConstraintXMLSerialization simpleCoConstraintXMLSerialization;

	@Autowired
	InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

	@Autowired
	GeneratePathService generatePathService;

	@Autowired
	AssertionXMLSerialization assertionXMLSerialization;

	@Autowired
	CoConstraintSerializationHelper coConstraintSerializationHelper;

	private static final int limitSizeOfVS = 5000;

	public static  String schemaVersion = "1.7.0";
	public static  String schemaURL = "https://raw.githubusercontent.com/usnistgov/hl7-v2-schemas/"+ schemaVersion + "/src/main/resources/hl7-v2-schemas/";
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeProfileToDoc(
	 * gov.nist.hit.hl7. igamt.ig.domain.datamodel.IgDataModel)
	 */
	@Override
	public Document serializeProfileToDoc(IgDataModel igModel) throws ProfileSerializationException {
		try {
			String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());
			Set<Datatype> missingDts = new HashSet<Datatype>();

			Element e = new Element("ConformanceProfile");
			this.serializeProfileMetaData(e, igModel, "Validation", defaultHL7Version);

			Element ms = new Element("Messages");
			for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
				ms.appendChild(this.serializeConformanceProfile(cpModel, igModel, defaultHL7Version));
			}
			e.appendChild(ms);

			Element ss = new Element("Segments");
			for (SegmentDataModel sModel : igModel.getSegments()) {
				ss.appendChild(this.serializeSegment(sModel, igModel, missingDts, defaultHL7Version));
			}
			e.appendChild(ss);

			Element ds = new Element("Datatypes");
			for (DatatypeDataModel dModel : igModel.getDatatypes()) {
				ds.appendChild(this.serializeDatatype(dModel, igModel, defaultHL7Version));
			}

			for (Datatype dt : missingDts) {
				ds.appendChild(this.serializeSimpleDatatype(dt, igModel, defaultHL7Version));
			}

			e.appendChild(ds);

			Document doc = new Document(e);

			return doc;
		} catch (Exception e) {
			e.printStackTrace();
			throw new ProfileSerializationException(e, igModel != null ? igModel.getModel().getId() : "");
		}
	}

	@Override
	public Element serializeCoConstraintXML(IgDataModel igModel) throws CoConstraintXMLSerializationException {
		String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());
		Element ccc = new Element("CoConstraintContext");
		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "CoConstraintContext.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		ccc.addAttribute(schemaDecl);
		ccc.addAttribute(new Attribute("ID", UUID.randomUUID().toString()));
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
			Element message = this.simpleCoConstraintXMLSerialization.serialize(cpModel.getModel(), defaultHL7Version);
			if (message != null) {
				ccc.appendChild(message);
			}
		}
		return ccc;
	}

	/**
	 * @param dt
	 * @param igModel
	 * @return
	 * @throws DatatypeSerializationException
	 */
	private Element serializeSimpleDatatype(Datatype dt, IgDataModel igModel, String defaultHL7Version)
			throws DatatypeSerializationException {
		try {
			Element elmDatatype = new Element("Datatype");

			elmDatatype.addAttribute(
					new Attribute("Label", "" + this.datatypeService.findXMLRefIdById(dt, defaultHL7Version)));
			elmDatatype.addAttribute(
					new Attribute("ID", "" + this.datatypeService.findXMLRefIdById(dt, defaultHL7Version)));

			elmDatatype.addAttribute(new Attribute("Name", this.str(dt.getName())));
			elmDatatype.addAttribute(new Attribute("Label", this.str(dt.getLabel())));
			elmDatatype.addAttribute(new Attribute("Version", this.str(dt.getDomainInfo().getVersion())));
			if (dt.getDescription() == null || dt.getDescription().equals("")) {
				elmDatatype.addAttribute(new Attribute("Description", "NoDesc"));
			} else {
				elmDatatype.addAttribute(new Attribute("Description", this.str(dt.getDescription())));
			}

			if (dt instanceof ComplexDatatype) {
				ComplexDatatype complexDatatype = (ComplexDatatype) dt;
				if (complexDatatype.getComponents() != null) {
					Map<Integer, Component> components = new HashMap<Integer, Component>();
					for (Component c : complexDatatype.getComponents()) {
						components.put(c.getPosition(), c);
					}
					for (int i = 1; i < components.size() + 1; i++) {
						try {
							Component c = components.get(i);
							Element elmComponent = new Element("Component");

							elmComponent.addAttribute(new Attribute("Name", this.str(c.getName())));
							elmComponent.addAttribute(
									new Attribute("Usage", this.str(this.changeCABtoC(c.getUsage()).toString())));

							String childDTId = c.getRef().getId();
							Datatype childDT = this.datatypeService.findById(childDTId);

							elmComponent.addAttribute(new Attribute("Datatype",
									"" + this.datatypeService.findXMLRefIdById(childDT, defaultHL7Version)));

							if (c.getLengthType().equals(LengthType.Length)) {
								elmComponent.addAttribute(new Attribute("ConfLength", "NA"));

								if (c.getMinLength() != null && !c.getMinLength().isEmpty()) {
									elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getMinLength())));

								} else {
									elmComponent.addAttribute(new Attribute("MinLength", "NA"));
								}

								if (c.getMaxLength() != null && !c.getMaxLength().isEmpty()) {
									elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getMaxLength())));

								} else {
									elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

								}

							} else if (c.getLengthType().equals(LengthType.ConfLength)) {
								elmComponent.addAttribute(new Attribute("MinLength", "NA"));
								elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

								if (c.getConfLength() != null && !c.getConfLength().equals("")) {
									elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getConfLength())));
								} else {
									elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
								}
							} else if(c.getLengthType().equals(LengthType.UNSET)) {
								elmComponent.addAttribute(new Attribute("MinLength", "NA"));
								elmComponent.addAttribute(new Attribute("MaxLength", "NA"));
								elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
							}

							elmDatatype.appendChild(elmComponent);
						} catch (Exception e) {
							throw new DatatypeComponentSerializationException(e, i);
						}
					}
				}
			}

			return elmDatatype;
		} catch (Exception e) {
			throw new DatatypeSerializationException(e, dt.getLabel());
		}
	}

	@Override
	public Element serializeValueSetXML(IgDataModel igModel) throws TableSerializationException {
		String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());
		Element elmTableLibrary = new Element("ValueSetLibrary");

		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "ValueSets.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		elmTableLibrary.addAttribute(schemaDecl);
		elmTableLibrary.addAttribute(new Attribute("ValueSetLibraryIdentifier", UUID.randomUUID().toString()));

		Element elmMetaData = new Element("MetaData");
		if (igModel.getModel().getMetadata() == null) {
			elmMetaData.addAttribute(new Attribute("Name", "Vocab for " + "Profile"));
			elmMetaData.addAttribute(new Attribute("OrgName", "NIST"));
			elmMetaData.addAttribute(new Attribute("Version", "1.0.0"));
			elmMetaData.addAttribute(new Attribute("Date", ""));
		} else {
			elmMetaData.addAttribute(new Attribute("Name",
					!this.str(igModel.getModel().getMetadata().getTitle()).equals("")
							? this.str(igModel.getModel().getMetadata().getTitle())
							: "No Title Info"));
			elmMetaData.addAttribute(new Attribute("OrgName",
					!this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
							? this.str(igModel.getModel().getMetadata().getOrgName())
							: "No Org Info"));
			elmMetaData.addAttribute(new Attribute("Version",
					!this.str(defaultHL7Version).equals("") ? this.str(defaultHL7Version) : "No Version Info"));
			elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

			if (igModel.getModel().getMetadata().getSpecificationName() != null
					&& !igModel.getModel().getMetadata().getSpecificationName().equals(""))
				elmMetaData.addAttribute(new Attribute("SpecificationName",
						this.str(igModel.getModel().getMetadata().getSpecificationName())));
			if (igModel.getModel().getMetadata().getTopics() != null
					&& !igModel.getModel().getMetadata().getTopics().equals(""))
				elmMetaData
						.addAttribute(new Attribute("Topics", this.str(igModel.getModel().getMetadata().getTopics())));
		}

		Element elmNoValidation = new Element("NoValidation");


		Ig ig = igModel.getModel();
		GroupedId grouping = new GroupedId();
		if(ig.getValueSetRegistry().getGroupedData() == null || !ig.getValueSetRegistry().getGroupedData().isCustom()){

			 grouping = createDefaultGrouping(igModel.getValuesets());

		}else  {
			grouping = igModel.getModel().getValueSetRegistry().getGroupedData();
		}
		this.processValueSetGroups(igModel.getValuesets(), grouping, elmNoValidation, elmTableLibrary, elmMetaData, defaultHL7Version);

		return elmTableLibrary;
	}


	private GroupedId createDefaultGrouping(Set<ValuesetDataModel> valuesetDataModels) {
		GroupedId ret = new GroupedId();
		Map<String, List<String>> groupedData = new HashMap<>();

		Set<String> usedGroupNames = new LinkedHashSet<>();

		for (ValuesetDataModel dataModel : valuesetDataModels) {
			String id = dataModel.getModel() != null ? dataModel.getModel().getId() : null;
			if (id == null) continue;

			Scope scope = dataModel.getModel().getDomainInfo().getScope();
			SourceType sourceType = dataModel.getModel().getSourceType();

			boolean isHL7 = scope != null && Scope.HL7STANDARD.equals(scope);
			boolean isExternal = sourceType == SourceType.EXTERNAL || sourceType == SourceType.EXTERNAL_TRACKED;
			boolean isUser = scope != null && Scope.USER.equals(scope);

			String group = null;
			if (isHL7) {
				group = "HL7_Base";
			} else if (isExternal) {
				group = "External";
			} else if (isUser) {
				group = "HL7_Profile";
			} else {
				group = "Others";
			}

			groupedData.computeIfAbsent(group, k -> new ArrayList<>()).add(id);
			usedGroupNames.add(group);
		}

		ret.setGroupedData(groupedData);
		ret.setGroupNames(new ArrayList<>(usedGroupNames));
		ret.setCustom(false);

		return ret;
	}





	public void processValueSetGroups(Collection<ValuesetDataModel> valueSetDataModels, GroupedId groups, Element elmNoValidation,Element elmTableLibrary, Element elmMetaData,  String defaultHL7Version) throws TableSerializationException {

		Map<String, String> groupOrderMap = new HashMap<>();
		List<String> groupNames = groups.getGroupNames();
		for (int i = 0; i < groupNames.size(); i++) {
			groupOrderMap.put(groupNames.get(i), String.valueOf(i + 1));
		}


		Map<String, ValuesetDataModel> valueSetMap = valueSetDataModels.stream()
				.filter(vsm -> vsm.getModel() != null && vsm.getModel().getId() != null)
				.collect(Collectors.toMap(
						vsm -> vsm.getModel().getId(),
						vsm -> vsm
				));

		Map<String, String> valueSetIdToGroup = new HashMap<>();
		groups.getGroupedData().forEach((group, ids) -> {
			for (String id : ids) {
				valueSetIdToGroup.put(id, group);
			}
		});

		Map<String, Element> groupedElements = new HashMap<>();

		for (Map.Entry<String, String> entry : valueSetIdToGroup.entrySet()) {
			String valueSetId = entry.getKey();
			String group = entry.getValue();

			ValuesetDataModel vsm = valueSetMap.get(valueSetId);
			if (vsm == null) continue;

			try {
				Valueset t = vsm.getModel();
				if (t == null) continue;

				boolean isExternal = t.getSourceType().equals(SourceType.EXTERNAL) || t.getSourceType().equals(SourceType.EXTERNAL_TRACKED);

				Element elmValueSetDefinition = new Element( isExternal? "ExternalValueSetDefinition" :"ValueSetDefinition");



				if (isExternal) {
					if (Strings.isNullOrEmpty(t.getUrl())) {
						throw new TableSerializationException("External value set " + t.getId() + " is missing a URL");
					}
					addValueSetDefinitionAttributes(t, defaultHL7Version, elmValueSetDefinition);
					elmValueSetDefinition.addAttribute(new Attribute("URL", t.getUrl()));
				} else {
					Set<Code> codes;
					if (t.getSourceType().equals(SourceType.INTERNAL_TRACKED)) {
						if (vsm.getReferencedCodeSet() != null) {
							codes = vsm.getReferencedCodeSet().getCodes();
						} else {
							throw new TableSerializationException("Internal value set " + t.getId() + " link to code set could not resolved.");
						}
					} else {
						codes = t.getCodes();
					}

					boolean noCodes = codes == null || codes.isEmpty();
					boolean sizeOverLimit = !noCodes && codes.size() > limitSizeOfVS;
					boolean isPlaceholder = !noCodes && codes.size() == 1 && codes.iterator().next().getValue().equals("...");
					boolean skipValidation = noCodes || sizeOverLimit || isPlaceholder;
					boolean skipCodesExport = noCodes || sizeOverLimit;

					if (skipValidation) {
						Element elmBindingIdentifier = new Element("BindingIdentifier");
						elmBindingIdentifier.appendChild(this.valuesetService.findXMLRefIdById(t, defaultHL7Version));
						elmNoValidation.appendChild(elmBindingIdentifier);
					}

					addValueSetDefinitionAttributes(t, defaultHL7Version, elmValueSetDefinition);

					if (!skipCodesExport) {
						addValueSetCodes(elmValueSetDefinition, codes);
					}
				}

				// Add to group element if absent
				Element groupElement = groupedElements.computeIfAbsent(group, g -> {
					Element e = new Element("ValueSetDefinitions");
					e.addAttribute(new Attribute("Group", g));
					String order = groupOrderMap.get(g);
					if (order != null) {
						e.addAttribute(new Attribute("Order", order));
					}
					return e;
				});
				groupElement.appendChild(elmValueSetDefinition);

			} catch (Exception e) {
				throw new TableSerializationException(e, vsm.getModel().getId());
			}
		}

		elmTableLibrary.appendChild(elmMetaData);
		elmTableLibrary.appendChild(elmNoValidation);

		for (Element groupElement : groupedElements.values()) {
			if (groupElement.getChildCount() > 0) {
				elmTableLibrary.appendChild(groupElement);
			}
		}
	}





	public void addValueSetCodes(Element element, Set<Code> codes) {
		for(Code c : codes) {
			Element elmValueElement = new Element("ValueElement");
			elmValueElement.addAttribute(new Attribute("Value", this.str(c.getValue())));
			elmValueElement.addAttribute(new Attribute("DisplayName", c.getDescription()!=null? c.getDescription(): ""));
			if(c.getCodeSystem() != null && !c.getCodeSystem().isEmpty())
				elmValueElement.addAttribute(new Attribute("CodeSystem", this.str(c.getCodeSystem())));
			if(c.getUsage() != null)
				elmValueElement.addAttribute(new Attribute("Usage", this.str(c.getUsage().toString())));
			if(c.getComments() != null && ! c.getComments().isEmpty())
				elmValueElement.addAttribute(new Attribute("Comments", this.str(c.getComments())));
			if(c.isHasPattern() && c.getPattern() != null && ! c.getPattern().isEmpty())
				elmValueElement.addAttribute(new Attribute("CodePattern", this.str(c.getPattern())));
			element.appendChild(elmValueElement);
		}
	}

	public void addValueSetDefinitionAttributes(Valueset valueset, String defaultHL7Version, Element element) {
		boolean isExternal = valueset.getSourceType().equals(SourceType.EXTERNAL);

		element.addAttribute(
				new Attribute(
					"BindingIdentifier",
					this.valuesetService.findXMLRefIdById(
							valueset,
							defaultHL7Version
					)
				)
		);

		element.addAttribute(new Attribute("Name", this.str(valueset.getName())));

		if(valueset.getName() != null && ! valueset.getName().equals("")) {
			element.addAttribute(new Attribute("Description", this.str(valueset.getName())));
		}

		if(!isExternal) {
			if(valueset.getDomainInfo().getVersion() != null && ! valueset.getDomainInfo().getVersion().equals("")) {
				element.addAttribute(
						new Attribute(
								"Version",
								this.str(valueset.getDomainInfo().getVersion())
				));
			}

			if(valueset.getOid() != null && ! valueset.getOid().equals("")) {
				element.addAttribute(new Attribute("Oid", this.str(valueset.getOid())));
			}

			if(valueset.getContentDefinition() != null) {
				if(valueset.getContentDefinition().equals(ContentDefinition.Undefined)) {
					element.addAttribute(new Attribute("ContentDefinition", this.str(ContentDefinition.Extensional.name())));
				} else {
					element.addAttribute(new Attribute("ContentDefinition", this.str(valueset.getContentDefinition().name())));
				}
			}
		}

		if(valueset.getStability() != null) {
			if(valueset.getStability().equals(Stability.Undefined)) {
				element.addAttribute(
						new Attribute(
								"Stability",
								this.str(Stability.Static.name())
						)
				);
			} else {
				element.addAttribute(
						new Attribute(
								"Stability",
								this.str(valueset.getStability().name())
				));
			}
		}

		if(valueset.getExtensibility() != null) {
			if(valueset.getExtensibility().equals(Extensibility.Undefined)) {
				element.addAttribute(
						new Attribute(
								"Extensibility",
								this.str(Extensibility.Closed.name())
						)
				);
			} else {
				element.addAttribute(
						new Attribute(
								"Extensibility",
								this.str(valueset.getExtensibility().name())
						)
				);
			}
		}
	}

	@Override
	public Element serializeConstraintsXML(IgDataModel igModel) {
		String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());
		Element e = new Element("ConformanceContext");
		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "ConformanceContext.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		e.addAttribute(schemaDecl);

		e.addAttribute(new Attribute("UUID", UUID.randomUUID().toString()));

		Element elmMetaData = new Element("MetaData");
		if (igModel.getModel().getMetadata() == null) {
			elmMetaData.addAttribute(new Attribute("Name", "Vocab for " + "Profile"));
			elmMetaData.addAttribute(new Attribute("OrgName", "NIST"));
			elmMetaData.addAttribute(new Attribute("Version", "1.0.0"));
			elmMetaData.addAttribute(new Attribute("Date", ""));
		} else {
			elmMetaData.addAttribute(new Attribute("Name",
					!this.str(igModel.getModel().getMetadata().getTitle()).equals("")
							? this.str(igModel.getModel().getMetadata().getTitle())
							: "No Title Info"));
			elmMetaData.addAttribute(new Attribute("OrgName",
					!this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
							? this.str(igModel.getModel().getMetadata().getOrgName())
							: "No Org Info"));
			elmMetaData.addAttribute(new Attribute("Version",
					!this.str(defaultHL7Version).equals("") ? this.str(defaultHL7Version) : "No Version Info"));
			elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

			if (igModel.getModel().getMetadata().getSpecificationName() != null
					&& !igModel.getModel().getMetadata().getSpecificationName().equals(""))
				elmMetaData.addAttribute(new Attribute("SpecificationName",
						this.str(igModel.getModel().getMetadata().getSpecificationName())));
			if (igModel.getModel().getMetadata().getTopics() != null
					&& !igModel.getModel().getMetadata().getTopics().equals(""))
				elmMetaData
						.addAttribute(new Attribute("Topics", this.str(igModel.getModel().getMetadata().getTopics())));
		}
		e.appendChild(elmMetaData);

		this.serializeMain(e, igModel, defaultHL7Version);

		return e;
	}

	/**
	 * @param e
	 * @param igModel
	 */
	private void serializeMain(Element e, IgDataModel igModel, String defaultHL7Version) {
		Element predicates_Elm = new Element("Predicates");

		Element predicates_dataType_Elm = new Element("Datatype");
		for (DatatypeDataModel dtModel : igModel.getDatatypes()) {

			Element elm_ByID = new Element("ByID");

			elm_ByID.addAttribute(new Attribute("ID",
					"" + this.datatypeService.findXMLRefIdById(dtModel.getModel(), defaultHL7Version)));

			if (dtModel.getPredicateMap() != null && dtModel.getPredicateMap().size() > 0) {
				for (String key : dtModel.getPredicateMap().keySet()) {

					Predicate p = dtModel.getPredicateMap().get(key);
					String script = this.generateConditionScript(p, dtModel.getModel().getId());
					Node n = this.innerXMLHandler(script);

					if (n != null) {
						Element elm_Constraint = new Element("Predicate");
						elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
						elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
						elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(p.generateDescription());
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(n);
						elm_ByID.appendChild(elm_Constraint);
					}

				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				predicates_dataType_Elm.appendChild(elm_ByID);
			}
		}
		predicates_Elm.appendChild(predicates_dataType_Elm);

		Element predicates_segment_Elm = new Element("Segment");
		for (SegmentDataModel segModel : igModel.getSegments()) {

			Element elm_ByID = new Element("ByID");
			elm_ByID.addAttribute(
					new Attribute("ID", this.segmentService.findXMLRefIdById(segModel.getModel(), defaultHL7Version)));

			if (segModel.getPredicateMap() != null && segModel.getPredicateMap().size() > 0) {
				for (String key : segModel.getPredicateMap().keySet()) {

					Predicate p = segModel.getPredicateMap().get(key);

					String script = this.generateConditionScript(p, segModel.getModel().getId());
					Node n = this.innerXMLHandler(script);
					if (n != null) {
						Element elm_Constraint = new Element("Predicate");
						elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
						elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
						elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(p.generateDescription());
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(n);
						elm_ByID.appendChild(elm_Constraint);
					}
				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				predicates_segment_Elm.appendChild(elm_ByID);
			}
		}
		predicates_Elm.appendChild(predicates_segment_Elm);

		Element predicates_Group_Elm = new Element("Group");
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
			if (cpModel.getPredicateMap() != null && cpModel.getPredicateMap().size() > 0) {
				for (String key : cpModel.getPredicateMap().keySet()) {

					Predicate p = cpModel.getPredicateMap().get(key);

					if (p.getContext() != null && p.getContext().getElementId() != null) {

						int count = countContextChild(p.getContext(), 1);
						String groupKey = "";

						for (int i = count; i < key.split("\\.").length; i++) {
							if (count + 1 == key.split("\\.").length)
								groupKey = groupKey + key.split("\\.")[i];
							else
								groupKey = groupKey + key.split("\\.")[i] + ".";
						}
						Element elm_ByID = this.findOrCreatByIDElement(predicates_Group_Elm, p.getContext(),
								cpModel.getModel());
						p.setLevel(Level.GROUP);
						String script = this.generateConditionScript(p, cpModel.getModel().getId());
						Node n = this.innerXMLHandler(script);
						if (n != null) {
							Element elm_Constraint = new Element("Predicate");
							elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(groupKey)));
							elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
							elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
							Element elm_Description = new Element("Description");
							elm_Description.appendChild(p.generateDescription());
							elm_Constraint.appendChild(elm_Description);
							elm_Constraint.appendChild(n);
							elm_ByID.appendChild(elm_Constraint);
						}

					}
				}
			}
		}
		predicates_Elm.appendChild(predicates_Group_Elm);

		Element predicates_Message_Elm = new Element("Message");
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

			Element elm_ByID = new Element("ByID");
			elm_ByID.addAttribute(new Attribute("ID", cpModel.getModel().getId()));

			if (cpModel.getPredicateMap() != null && cpModel.getPredicateMap().size() > 0) {
				for (String key : cpModel.getPredicateMap().keySet()) {

					Predicate p = cpModel.getPredicateMap().get(key);

					if (p.getContext() == null || p.getContext().getElementId() == null) {
						p.setLevel(Level.CONFORMANCEPROFILE);
						String script = this.generateConditionScript(p, cpModel.getModel().getId());
						Node n = this.innerXMLHandler(script);
						if (n != null) {
							Element elm_Constraint = new Element("Predicate");
							elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
							elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
							elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
							Element elm_Description = new Element("Description");
							elm_Description.appendChild(p.generateDescription());
							elm_Constraint.appendChild(elm_Description);
							elm_Constraint.appendChild(n);
							elm_ByID.appendChild(elm_Constraint);
						}
					}
				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				predicates_Message_Elm.appendChild(elm_ByID);
			}
		}
		predicates_Elm.appendChild(predicates_Message_Elm);

		Element constraints_Elm = new Element("Constraints");
		Element constraints_dataType_Elm = new Element("Datatype");
		for (DatatypeDataModel dtModel : igModel.getDatatypes()) {

			Element elm_ByID = new Element("ByID");
			elm_ByID.addAttribute(new Attribute("ID",
					"" + this.datatypeService.findXMLRefIdById(dtModel.getModel(), defaultHL7Version)));

			if (dtModel.getConformanceStatements() != null && dtModel.getConformanceStatements().size() > 0) {
				for (ConformanceStatement cs : dtModel.getConformanceStatements()) {

					String script = this.generateAssertionScript(cs, dtModel.getModel().getId());
					Node n = this.innerXMLHandler(script);
					if (n != null) {
						Element elm_Constraint = new Element("Constraint");
						elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
						if (cs.getStrength() != null) {
							elm_Constraint.addAttribute(new Attribute("Strength", cs.getStrength().toString()));
						}
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(cs.generateDescription());
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(n);
						elm_ByID.appendChild(elm_Constraint);
					}
				}
			}

			Datatype dt = dtModel.getModel();

			if (dt.getName().equals("DTM") || dt.getName().equals("TM") || dt.getName().equals("DT")) {
				DateTimeConstraints dateTimeConstraints = null;

				if (dt instanceof DateTimeDatatype) {
					dateTimeConstraints = ((DateTimeDatatype) dt).getDateTimeConstraints();
				}

				if (dateTimeConstraints == null || dateTimeConstraints.getErrorMessage() == null
						|| dateTimeConstraints.getErrorMessage().isEmpty() || dateTimeConstraints.getRegex() == null
						|| dateTimeConstraints.getRegex().isEmpty()) {
					dateTimeConstraints = new DateTimeConstraints();
					if (dt.getName().equals("DTM")) {
						Element elm_Constraint = new Element("Constraint");
						elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(
								"The value SHALL follow the Date/Time pattern 'YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ]'.");
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
								+ XMLManager.parsingSpecialforXml(
										"^(\\d{4}|\\d{6}|\\d{8}|\\d{10}|\\d{12}|\\d{14}|\\d{14}\\.\\d|\\d{14}\\.\\d{2}|\\d{14}\\.\\d{3}|\\d{14}\\.\\d{4})([+-]\\d{4})?$")
								+ "\"/></Assertion>"));
						elm_ByID.appendChild(elm_Constraint);
					} else if (dt.getName().equals("DT")) {
						Element elm_Constraint = new Element("Constraint");
						elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
						Element elm_Description = new Element("Description");
						elm_Description.appendChild("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD]]'.");
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
								+ XMLManager.parsingSpecialforXml("^(\\d{4}|\\d{6}|\\d{8})$") + "\"/></Assertion>"));
						elm_ByID.appendChild(elm_Constraint);
					} else if (dt.getName().equals("TM")) {
						Element elm_Constraint = new Element("Constraint");
						elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(
								"The value SHALL follow the Date/Time pattern 'HH[MM[SS[.S[S[S[S]]]]]][+/-ZZZZ]'.");
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
								+ XMLManager.parsingSpecialforXml(
										"^(\\d{2}|\\d{4}|\\d{6}|\\d{6}\\.\\d|\\d{6}\\.\\d{2}|\\d{6}\\.\\d{3}|\\d{6}\\.\\d{4})([+-]\\d{4})?$")
								+ "\"/></Assertion>"));
						elm_ByID.appendChild(elm_Constraint);
					}
				} else {
					Element elm_Constraint = new Element("Constraint");
					elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
					Element elm_Description = new Element("Description");
					elm_Description.appendChild(dateTimeConstraints.getErrorMessage());
					elm_Constraint.appendChild(elm_Description);
					elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
							+ XMLManager.parsingSpecialforXml(dateTimeConstraints.getRegex()) + "\"/></Assertion>"));
					elm_ByID.appendChild(elm_Constraint);
				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				constraints_dataType_Elm.appendChild(elm_ByID);
			}
		}
		constraints_Elm.appendChild(constraints_dataType_Elm);

		Element constraints_segment_Elm = new Element("Segment");
		for (SegmentDataModel segModel : igModel.getSegments()) {

			Element elm_ByID = new Element("ByID");
			elm_ByID.addAttribute(
					new Attribute("ID", this.segmentService.findXMLRefIdById(segModel.getModel(), defaultHL7Version)));

			if (segModel.getConformanceStatements() != null && segModel.getConformanceStatements().size() > 0) {
				for (ConformanceStatement cs : segModel.getConformanceStatements()) {

					String script = this.generateAssertionScript(cs, segModel.getModel().getId());
					Node n = this.innerXMLHandler(script);
					if (n != null) {
						Element elm_Constraint = new Element("Constraint");
						elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
						if (cs.getStrength() != null) {
							elm_Constraint.addAttribute(new Attribute("Strength", cs.getStrength().toString()));
						}
						Element elm_Description = new Element("Description");
						elm_Description.appendChild(cs.generateDescription());
						elm_Constraint.appendChild(elm_Description);
						elm_Constraint.appendChild(n);
						elm_ByID.appendChild(elm_Constraint);
					}
				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				constraints_segment_Elm.appendChild(elm_ByID);
			}
		}
		constraints_Elm.appendChild(constraints_segment_Elm);

		Element constraints_group_Elm = new Element("Group");
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

			if (cpModel.getConformanceStatements() != null && cpModel.getConformanceStatements().size() > 0) {
				for (ConformanceStatement cs : cpModel.getConformanceStatements()) {
					if (cs.getContext() != null && cs.getContext().getElementId() != null) {
						Element elm_ByID = this.findOrCreatByIDElement(constraints_group_Elm, cs.getContext(),
								cpModel.getModel());
						cs.setLevel(Level.GROUP);
						String script = this.generateAssertionScript(cs, cpModel.getModel().getId());
						Node n = this.innerXMLHandler(script);

						if (n != null) {
							Element elm_Constraint = new Element("Constraint");
							elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
							if (cs.getStrength() != null) {
								elm_Constraint.addAttribute(new Attribute("Strength", cs.getStrength().toString()));
							}
							Element elm_Description = new Element("Description");
							elm_Description.appendChild(cs.generateDescription());
							elm_Constraint.appendChild(elm_Description);
							elm_Constraint.appendChild(n);
							elm_ByID.appendChild(elm_Constraint);
						}
					}
				}
			}
		}
		constraints_Elm.appendChild(constraints_group_Elm);

		Element constraints_message_Elm = new Element("Message");
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

			Element elm_ByID = new Element("ByID");
			elm_ByID.addAttribute(new Attribute("ID", cpModel.getModel().getId()));

			if (cpModel.getConformanceStatements() != null && cpModel.getConformanceStatements().size() > 0) {
				for (ConformanceStatement cs : cpModel.getConformanceStatements()) {
					if (cs.getContext() == null || cs.getContext().getElementId() == null) {
						cs.setLevel(Level.CONFORMANCEPROFILE);
						String script = this.generateAssertionScript(cs, cpModel.getModel().getId());
						Node n = this.innerXMLHandler(script);
						if (n != null) {
							Element elm_Constraint = new Element("Constraint");
							elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
							if (cs.getStrength() != null) {
								elm_Constraint.addAttribute(new Attribute("Strength", cs.getStrength().toString()));
							}
							Element elm_Description = new Element("Description");
							elm_Description.appendChild(cs.generateDescription());
							elm_Constraint.appendChild(elm_Description);
							elm_Constraint.appendChild(n);
							elm_ByID.appendChild(elm_Constraint);
						}

					}
				}
			}

			if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
				constraints_message_Elm.appendChild(elm_ByID);
			}
		}
		constraints_Elm.appendChild(constraints_message_Elm);

		e.appendChild(predicates_Elm);
		e.appendChild(constraints_Elm);

	}

	/**
	 * @param constraints_group_Elm
	 * @param context
	 * @param conformanceProfile
	 * @return
	 */
	private Element findOrCreatByIDElement(Element constraints_group_Elm, InstancePath context,
			ConformanceProfile conformanceProfile) {
		Group group = this.findGroupByContext(context, conformanceProfile.getChildren());
		Elements elements = constraints_group_Elm.getChildElements("ByID");
		if (elements != null && elements.size() > 0) {
			for (int i = 0; i < elements.size(); i++) {
				if (elements.get(i).getAttribute("ID").getValue()
						.equals(conformanceProfile.getId() + "-" + group.getId())) {
					return elements.get(i);
				}
			}
		}

		Element elm_ByID = new Element("ByID");
		elm_ByID.addAttribute(new Attribute("ID", conformanceProfile.getId() + "-" + group.getId()));
		constraints_group_Elm.appendChild(elm_ByID);
		return elm_ByID;
	}

	private Group findGroupByContext(InstancePath context, Set<SegmentRefOrGroup> set) {
		for (SegmentRefOrGroup srog : set) {
			if (srog.getId().equals(context.getElementId())) {
				if (context.getChild() == null)
					return (Group) srog;
				else
					return findGroupByContext(context.getChild(), ((Group) srog).getChildren());
			}
		}
		return null;
	}

	private int countContextChild(InstancePath path, int result) {
		if (path.getChild() == null)
			return result;
		else
			return countContextChild(path.getChild(), result + 1);
	}

	private String bindingInstanceNum(String keyStr) {
		String[] keys = keyStr.split("\\.");
		for (int i = 0; i < keys.length; i++) {
			keys[i] = keys[i] + "[1]";
		}
		return String.join(".", keys);
	}

	private Node innerXMLHandler(String xml) {
		if (xml != null && !xml.equals("")) {
			Builder builder = new Builder(new NodeFactory());
			try {
				Document doc = builder.build(xml, null);
				return doc.getRootElement().copy();
			} catch (ValidityException e) {
				e.printStackTrace();
			} catch (ParsingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	private Element serializeDatatype(DatatypeDataModel dModel, IgDataModel igModel, String defaultHL7Version)
			throws DatatypeSerializationException {
		try {
			Element elmDatatype = new Element("Datatype");

			elmDatatype.addAttribute(new Attribute("Label",
					"" + this.datatypeService.findXMLRefIdById(dModel.getModel(), defaultHL7Version)));
			elmDatatype.addAttribute(new Attribute("ID",
					"" + this.datatypeService.findXMLRefIdById(dModel.getModel(), defaultHL7Version)));

			elmDatatype.addAttribute(new Attribute("Name", this.str(dModel.getModel().getName())));
			elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
			elmDatatype
					.addAttribute(new Attribute("Version", this.str(dModel.getModel().getDomainInfo().getVersion())));
			if (dModel.getModel().getDescription() == null || dModel.getModel().getDescription().equals("")) {
				elmDatatype.addAttribute(new Attribute("Description", "NoDesc"));
			} else {
				elmDatatype.addAttribute(new Attribute("Description", this.str(dModel.getModel().getDescription())));
			}

			if (dModel.getComponentDataModels() != null && dModel.getComponentDataModels().size() > 0) {
				Map<Integer, ComponentDataModel> components = new HashMap<Integer, ComponentDataModel>();
				for (ComponentDataModel cModel : dModel.getComponentDataModels()) {
					components.put(cModel.getModel().getPosition(), cModel);
				}

				for (int i = 1; i < components.size() + 1; i++) {
					ComponentDataModel c = components.get(i);
					Element elmComponent = new Element("Component");
					DatatypeDataModel childDTModel = igModel.findDatatype(c.getModel().getRef().getId());
					Datatype childDT = null;
					if(childDTModel == null) childDT = this.datatypeService.findById(c.getModel().getRef().getId());
					else childDT = childDTModel.getModel();

					elmComponent.addAttribute(new Attribute("Name", this.str(c.getModel().getName())));
					elmComponent.addAttribute(
							new Attribute("Usage", this.str(this.changeCABtoC(c.getModel().getUsage()).toString())));

					elmComponent.addAttribute(new Attribute("Datatype",
							"" + this.datatypeService.findXMLRefIdById(childDT, defaultHL7Version)));

					if (!(c.getModel().getConstantValue() == null || c.getModel().getConstantValue().trim().equals("")) & this.isPrimitiveDatatype(childDT.getName())) {
						elmComponent.addAttribute(
								new Attribute("ConstantValue", this.str(c.getModel().getConstantValue())));
					}

					if (c.getModel().getLengthType().equals(LengthType.Length)) {
						elmComponent.addAttribute(new Attribute("ConfLength", "NA"));

						if (c.getModel().getMinLength() != null && !c.getModel().getMinLength().isEmpty()) {
							elmComponent
									.addAttribute(new Attribute("MinLength", this.str(c.getModel().getMinLength())));

						} else {
							elmComponent.addAttribute(new Attribute("MinLength", "NA"));
						}

						if (c.getModel().getMaxLength() != null && !c.getModel().getMaxLength().isEmpty()) {
							elmComponent
									.addAttribute(new Attribute("MaxLength", this.str(c.getModel().getMaxLength())));

						} else {
							elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

						}

					} else if (c.getModel().getLengthType().equals(LengthType.ConfLength)) {
						elmComponent.addAttribute(new Attribute("MinLength", "NA"));
						elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

						if (c.getModel().getConfLength() != null && !c.getModel().getConfLength().equals("")) {
							elmComponent
									.addAttribute(new Attribute("ConfLength", this.str(c.getModel().getConfLength())));
						} else {
							elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
						}
					}  else if(c.getModel().getLengthType().equals(LengthType.UNSET)) {
						elmComponent.addAttribute(new Attribute("MinLength", "NA"));
						elmComponent.addAttribute(new Attribute("MaxLength", "NA"));
						elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
					}
					elmDatatype.appendChild(elmComponent);
				}
			}
			return elmDatatype;
		} catch (Exception e) {
			e.printStackTrace();
			throw new DatatypeSerializationException(e, dModel.getModel().getLabel());
		}
	}

	private boolean isPrimitiveDatatype(String dtName) {
		Set<String> primitiveDTs = new HashSet<String>(Arrays.asList(new String[] { "ID", "IS", "ST", "NM" }));
		return primitiveDTs.contains(dtName);
	}

	private Element serializeSegment(SegmentDataModel sModel, IgDataModel igModel, Set<Datatype> missingDts,
			String defaultHL7Version) throws SegmentSerializationException {
		try {
			// TODO DynamicMapping Need
			Element elmSegment = new Element("Segment");

			elmSegment.addAttribute(
					new Attribute("Label", this.segmentService.findXMLRefIdById(sModel.getModel(), defaultHL7Version)));
			elmSegment.addAttribute(
					new Attribute("ID", this.segmentService.findXMLRefIdById(sModel.getModel(), defaultHL7Version)));

			elmSegment.addAttribute(new Attribute("Name", this.str(sModel.getModel().getName())));
			elmSegment.addAttribute(new Attribute("Version", this.str(sModel.getModel().getDomainInfo().getVersion())));
			if (sModel.getModel().getDescription() == null || sModel.getModel().getDescription().equals("")) {
				elmSegment.addAttribute(new Attribute("Description", "NoDesc"));
			} else {
				elmSegment.addAttribute(new Attribute("Description", this.str(sModel.getModel().getDescription())));
			}

			// DynamicMapping
			if (sModel.getModel().getName().equals("OBX") && sModel.getModel().getDynamicMappingInfo() != null
					&& sModel.getModel().getDynamicMappingInfo().getItems() != null
					&& sModel.getModel().getDynamicMappingInfo().getItems().size() > 0) {
				Element elmDynamicMapping = new Element("DynamicMapping");
				Element elmMapping = new Element("Mapping");
				elmMapping.addAttribute(new Attribute("Position", "5"));
				elmMapping.addAttribute(new Attribute("Reference", "2"));
				elmMapping.addAttribute(new Attribute("SecondReference", "3.1"));

				// #1 User's Defined Dynamic Mapping
				if (sModel.getModel().getDynamicMappingInfo() != null
						&& sModel.getModel().getDynamicMappingInfo().getItems() != null) {
					for (DynamicMappingItem item : sModel.getModel().getDynamicMappingInfo().getItems()) {

						Element elmCase = new Element("Case");
						elmCase.addAttribute(new Attribute("Value", item.getValue()));

						DatatypeDataModel itemDTModel = igModel.findDatatype(item.getDatatypeId());
						if (itemDTModel != null) {
							elmCase.addAttribute(new Attribute("Datatype", "" + this.datatypeService
									.findXMLRefIdById(itemDTModel.getModel(), defaultHL7Version)));

							elmMapping.appendChild(elmCase);
						} else {
							// throw new SegmentSerializationException("Datatype not found");
						}
					}
				}

//         #2 CoConstraint's Defined Dynamic Mapping
				if (sModel.getModel().getId().indexOf("COCON") > 0) {
					for (ConformanceProfileDataModel cpdm : igModel.getConformanceProfiles()) {
						if (sModel.getModel().getId().indexOf(cpdm.getModel().getId()) > 0) {
							Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> map = this.coConstraintSerializationHelper
									.getOBX3ToFlavorMap(cpdm.getModel());

							for (CoConstraintMappingLocation key : map.keySet()) {
								if (sModel.getModel().getId().indexOf(key.getLocationId().replaceAll("\\.", "_")) > 0) {
									for (CoConstraintOBX3MappingValue item : map.get(key)) {
										Element elmCase = new Element("Case");
										elmCase.addAttribute(new Attribute("Value",
												igModel.findDatatype(item.getFlavorId()).getModel().getName()));
										elmCase.addAttribute(new Attribute("SecondValue", item.getCode()));
										elmCase.addAttribute(new Attribute("Datatype",
												"" + this.datatypeService.findXMLRefIdById(
														igModel.findDatatype(item.getFlavorId()).getModel(),
														defaultHL7Version)));
										elmMapping.appendChild(elmCase);
									}
								}
							}
						}
					}
				}

				// #3 OBX-2 Dynamic Mapping

//        String version = null;
//        String refValuesetId = null;
//        ValuesetDataModel vsModel = null;
//        if (sModel.getValuesetMap().get("2") != null) {
//          for (ValuesetBindingDataModel m : sModel.getValuesetMap().get("2")) {
//            // TODO update value set binding export
//
//            if (m.getValuesetBinding() != null && m.getValuesetBinding().getValueSets() != null
//                && m.getValuesetBinding().getValueSets().size() == 1) {
//              refValuesetId = m.getValuesetBinding().getValueSets().get(0);
//            }
//          }
//        }
//        if (refValuesetId != null) {
//          vsModel = igModel.findValueset(refValuesetId);
//        }
//        if (vsModel != null) {
//          version = vsModel.getModel().getDomainInfo().getVersion();
//          if (version != null) {
//            for (Code c : vsModel.getModel().getCodes()) {
//              String value = c.getValue();
//              DatatypeDataModel itemDTModel = igModel.findDatatype(value, version);
//
//              if (itemDTModel != null) {
//                Element elmCase = new Element("Case");
//                elmCase.addAttribute(new Attribute("Value", itemDTModel.getModel().getName()));
//                if (defaultHL7Version != null
//                    && itemDTModel.getModel().getDomainInfo() != null
//                    && itemDTModel.getModel().getDomainInfo().getVersion() != null) {
//                  if (defaultHL7Version.equals(itemDTModel.getModel().getDomainInfo().getVersion())) {
//                    elmCase.addAttribute(new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
//                  } else {
//                    elmCase.addAttribute(new Attribute("Datatype",
//                        this.str(itemDTModel.getModel().getLabel() + "_" + itemDTModel.getModel()
//                            .getDomainInfo().getVersion().replaceAll("\\.", "-"))));
//                  }
//                } else {
//                  elmCase.addAttribute(
//                      new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
//                }
//                elmMapping.appendChild(elmCase);
//              } else {
//                Datatype dt = this.datatypeService.findOneByNameAndVersionAndScope(value, version,
//                    "HL7STANDARD");
//                if (dt != null) {
//                  Element elmCase = new Element("Case");
//                  elmCase.addAttribute(new Attribute("Value", dt.getName()));
//                  if (defaultHL7Version != null && dt.getDomainInfo() != null && dt.getDomainInfo().getVersion() != null) {
//                    if (defaultHL7Version.equals(dt.getDomainInfo().getVersion())) {
//                      elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel())));
//                    } else {
//                      elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel() + "_"
//                          + dt.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
//                    }
//                  } else {
//                    elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel())));
//                  }
//                  elmMapping.appendChild(elmCase);
//
//                  missingDts.add(dt);
//                  if (dt instanceof ComplexDatatype) {
//                    ComplexDatatype complexDatatype = (ComplexDatatype) dt;
//                    if (complexDatatype.getComponents() != null) {
//                      for (Component component : complexDatatype.getComponents()) {
//                        if (igModel.findDatatype(component.getRef().getId()) == null) {
//                          Datatype childDT =
//                              this.datatypeService.findById(component.getRef().getId());
//                          if (childDT != null)
//                            missingDts.add(childDT);
//
//                          if (childDT instanceof ComplexDatatype) {
//                            ComplexDatatype complexChildDatatype = (ComplexDatatype) childDT;
//                            if (complexChildDatatype.getComponents() != null) {
//                              for (Component subComponent : complexChildDatatype.getComponents()) {
//                                if (igModel.findDatatype(subComponent.getRef().getId()) == null) {
//                                  Datatype childchildDT =
//                                      this.datatypeService.findById(subComponent.getRef().getId());
//                                  if (childchildDT != null)
//                                    missingDts.add(childchildDT);
//                                }
//                              }
//                            }
//                          }
//
//                        }
//                      }
//                    }
//
//                  }
//                } else {
//                  System.out.println(value + "-" + version);
//                }
//
//              }
//
//            }
//          }
//        }
				elmDynamicMapping.appendChild(elmMapping);
				elmSegment.appendChild(elmDynamicMapping);
			}

			Map<Integer, FieldDataModel> fields = new HashMap<Integer, FieldDataModel>();

			for (FieldDataModel fModel : sModel.getFieldDataModels()) {
				fields.put(fModel.getModel().getPosition(), fModel);
			}

			for (int i = 1; i < fields.size() + 1; i++) {
				try {
					FieldDataModel f = fields.get(i);

					if (f != null) {
						DatatypeBindingDataModel dBindingModel = f.getDatatype();
						
						Datatype childDT = null;
						DatatypeDataModel found = igModel.findDatatype(dBindingModel.getId());
						if(found != null) childDT = igModel.findDatatype(dBindingModel.getId()).getModel();
						else childDT = this.datatypeService.findById(dBindingModel.getId());
						
						Element elmField = new Element("Field");
						elmField.addAttribute(new Attribute("Name", this.str(f.getModel().getName())));
						elmField.addAttribute(new Attribute("Usage",
								this.str(this.changeCABtoC(f.getModel().getUsage()).toString())));
						elmField.addAttribute(new Attribute("Datatype",
								"" + this.datatypeService.findXMLRefIdById(childDT, defaultHL7Version)));

						if (!(f.getModel().getConstantValue() == null || f.getModel().getConstantValue().trim().equals("")) && this.isPrimitiveDatatype(childDT.getName())) {
							elmField.addAttribute(
									new Attribute("ConstantValue", this.str(f.getModel().getConstantValue())));
						}

						if (f.getModel().getLengthType().equals(LengthType.Length)) {
							elmField.addAttribute(new Attribute("ConfLength", "NA"));

							if (f.getModel().getMinLength() != null && !f.getModel().getMinLength().isEmpty()) {
								elmField.addAttribute(
										new Attribute("MinLength", this.str(f.getModel().getMinLength())));
							} else {
								elmField.addAttribute(new Attribute("MinLength", "NA"));
							}

							if (f.getModel().getMaxLength() != null && !f.getModel().getMaxLength().isEmpty()) {
								elmField.addAttribute(
										new Attribute("MaxLength", this.str(f.getModel().getMaxLength())));
							} else {
								elmField.addAttribute(new Attribute("MaxLength", "NA"));

							}

						} else if (f.getModel().getLengthType().equals(LengthType.ConfLength)) {
							elmField.addAttribute(new Attribute("MinLength", "NA"));
							elmField.addAttribute(new Attribute("MaxLength", "NA"));

							if (f.getModel().getConfLength() != null && !f.getModel().getConfLength().equals("")) {
								elmField.addAttribute(
										new Attribute("ConfLength", this.str(f.getModel().getConfLength())));
							} else {
								elmField.addAttribute(new Attribute("ConfLength", "NA"));
							}
						}   else if(f.getModel().getLengthType().equals(LengthType.UNSET)) {
							elmField.addAttribute(new Attribute("MinLength", "NA"));
							elmField.addAttribute(new Attribute("MaxLength", "NA"));
							elmField.addAttribute(new Attribute("ConfLength", "NA"));
						}

						elmField.addAttribute(new Attribute("Min", "" + f.getModel().getMin()));
						elmField.addAttribute(new Attribute("Max", "" + f.getModel().getMax()));
						elmSegment.appendChild(elmField);
					}
				} catch (Exception e) {
					e.printStackTrace();
					throw new FieldSerializationException(e, "Field[" + i + "]");
				}
			}

			return elmSegment;
		} catch (Exception e) {
			e.printStackTrace();
			throw new SegmentSerializationException(e, sModel != null ? sModel.getModel().getId() : "");
		}
	}

	private Element serializeConformanceProfile(ConformanceProfileDataModel cpModel, IgDataModel igModel,
			String defaultHL7Version) throws MessageSerializationException {
		try {
			Element elmMessage = new Element("Message");
			elmMessage.addAttribute(new Attribute("ID", cpModel.getModel().getId()));
			if (cpModel.getModel().getDisplayName() != null && !cpModel.getModel().getDisplayName().equals(""))
				elmMessage.addAttribute(new Attribute("Identifier", this.str(cpModel.getModel().getDisplayName())));
			if (cpModel.getModel().getName() != null && !cpModel.getModel().getName().equals(""))
				elmMessage.addAttribute(new Attribute("Name", this.str(cpModel.getModel().getName())));
			elmMessage.addAttribute(new Attribute("Type", this.str(cpModel.getModel().getMessageType())));
			elmMessage.addAttribute(new Attribute("Event", this.str(cpModel.getModel().getEvent())));
			elmMessage.addAttribute(new Attribute("StructID", this.str(cpModel.getModel().getStructID())));

			if (cpModel.getModel().getDescription() != null && !cpModel.getModel().getDescription().equals(""))
				elmMessage.addAttribute(new Attribute("Description", this.str(cpModel.getModel().getDescription())));

			Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels = new HashMap<Integer, SegmentRefOrGroupDataModel>();

			for (SegmentRefOrGroupDataModel segmentRefOrGroupDataModel : cpModel.getSegmentRefOrGroupDataModels()) {
				segmentRefOrGroupDataModels.put(segmentRefOrGroupDataModel.getModel().getPosition(),
						segmentRefOrGroupDataModel);
			}

			for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
				SegmentRefOrGroupDataModel segmentRefOrGroupDataModel = segmentRefOrGroupDataModels.get(i);
				if (segmentRefOrGroupDataModel.getType().equals(Type.SEGMENTREF)) {
					elmMessage.appendChild(serializeSegmentRef(segmentRefOrGroupDataModel, igModel, defaultHL7Version));
				} else if (segmentRefOrGroupDataModel.getType().equals(Type.GROUP)) {
					elmMessage.appendChild(serializeGroup(segmentRefOrGroupDataModel, igModel, defaultHL7Version,
							cpModel.getModel().getId()));
				}
			}

			return elmMessage;
		} catch (Exception e) {
			e.printStackTrace();
			throw new MessageSerializationException(e, cpModel != null ? cpModel.getModel().getId() : "");
		}
	}

	private Element serializeGroup(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel, IgDataModel igModel,
			String defaultHL7Version, String messageId) throws GroupSerializationException {
		try {
			Element elmGroup = new Element("Group");
			elmGroup.addAttribute(new Attribute("ID",
					this.str(messageId) + "-" + this.str(segmentRefOrGroupDataModel.getModel().getId())));
			elmGroup.addAttribute(new Attribute("Name", this.str(segmentRefOrGroupDataModel.getModel().getName())));
			elmGroup.addAttribute(new Attribute("Usage",
					this.str(this.changeCABtoC(segmentRefOrGroupDataModel.getModel().getUsage()).toString())));
			elmGroup.addAttribute(new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
			elmGroup.addAttribute(new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));

			Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels = new HashMap<Integer, SegmentRefOrGroupDataModel>();

			if (segmentRefOrGroupDataModel.getChildren() != null) {
				for (SegmentRefOrGroupDataModel child : segmentRefOrGroupDataModel.getChildren()) {
					segmentRefOrGroupDataModels.put(child.getModel().getPosition(), child);
				}

				for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
					SegmentRefOrGroupDataModel childModel = segmentRefOrGroupDataModels.get(i);
					if (childModel.getType().equals(Type.SEGMENTREF)) {
						elmGroup.appendChild(serializeSegmentRef(childModel, igModel, defaultHL7Version));
					} else if (childModel.getType().equals(Type.GROUP)) {
						elmGroup.appendChild(serializeGroup(childModel, igModel, defaultHL7Version, messageId));
					}
				}
			}

			return elmGroup;
		} catch (Exception e) {
			e.printStackTrace();
			throw new GroupSerializationException(e,
					segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
		}
	}

	private Element serializeSegmentRef(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel, IgDataModel igModel,
			String defaultHL7Version) throws SegmentSerializationException {
		try {
			SegmentBindingDataModel segModel = segmentRefOrGroupDataModel.getSegment();
			Element elmSegment = new Element("Segment");
			elmSegment.addAttribute(new Attribute("Ref", this.segmentService
					.findXMLRefIdById(igModel.findSegment(segModel.getId()).getModel(), defaultHL7Version)));

			elmSegment.addAttribute(new Attribute("Usage",
					this.str(this.changeCABtoC(segmentRefOrGroupDataModel.getModel().getUsage()).toString())));
			elmSegment
					.addAttribute(new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
			elmSegment.addAttribute(new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));
			return elmSegment;
		} catch (Exception e) {
			e.printStackTrace();
			throw new SegmentSerializationException(e,
					segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
		}
	}

	private void serializeProfileMetaData(Element e, IgDataModel igModel, String type, String defaultHL7Version) {
		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "Profile.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		e.addAttribute(schemaDecl);

		if (igModel != null && igModel.getModel() != null) {
			e.addAttribute(new Attribute("ID", UUID.randomUUID().toString()));
			if (defaultHL7Version != null && defaultHL7Version.equals("NOTFOUND"))
				e.addAttribute(new Attribute("HL7Version", this.str(defaultHL7Version)));

			Element elmMetaData = new Element("MetaData");

			if (igModel.getModel().getMetadata() != null) {
				elmMetaData.addAttribute(new Attribute("Name",
						!this.str(igModel.getModel().getMetadata().getTitle()).equals("")
								? this.str(igModel.getModel().getMetadata().getTitle())
								: "No Title Info"));
				elmMetaData.addAttribute(new Attribute("OrgName",
						!this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
								? this.str(igModel.getModel().getMetadata().getOrgName())
								: "No Org Info"));
				elmMetaData.addAttribute(new Attribute("Version",
						!this.str(igModel.getModel().getVersion() + "").equals("")
								? this.str(igModel.getModel().getVersion() + "")
								: "No Version Info"));

				if (igModel.getModel().getUpdateDate() != null)
					elmMetaData.addAttribute(new Attribute("Date",
							!this.str(igModel.getModel().getUpdateDate().toString()).equals("")
									? this.str(igModel.getModel().getUpdateDate().toString())
									: "No Date Info"));
				else
					elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

				elmMetaData.addAttribute(new Attribute("SpecificationName",
						!this.str(igModel.getModel().getMetadata().getSpecificationName()).equals("")
								? this.str(igModel.getModel().getMetadata().getSpecificationName())
								: "No Version Info"));
			}
			e.appendChild(elmMetaData);
		}
	}

	private String str(String value) {
		return value != null ? value : "";
	}

	private Usage changeCABtoC(Usage value) {
		return Usage.CAB.equals(value) ? Usage.C : value;
	}

	@Override
	public void generateIS(ZipOutputStream out, String xmlStr, String fileName) throws IOException {
		byte[] buf = new byte[1024];
		out.putNextEntry(new ZipEntry(fileName));
		InputStream inValueSet = IOUtils.toInputStream(xmlStr);
		int lenTP;
		while ((lenTP = inValueSet.read(buf)) > 0) {
			out.write(buf, 0, lenTP);
		}
		out.closeEntry();
		inValueSet.close();
	}

	@Override
	public void normalizeIgModel(IgDataModel igModel, String[] conformanceProfileIds) throws AmbiguousOBX3MappingException, PathNotFoundException, ResourceNotFoundException, IOException {
		Map<String, SegmentDataModel> toBeAddedSegments = new HashMap<>();
		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
			Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> maps = this.coConstraintSerializationHelper.getOBX3ToFlavorMap(cpModel.getModel());
			for (CoConstraintMappingLocation coconLocation : maps.keySet()) {
				SegmentDataModel sdm = igModel.findSegment(coconLocation.getFlavorId());
				SegmentDataModel copySegModel = new SegmentDataModel();
				copySegModel.setModel(sdm.getModel().clone());
				copySegModel.setPredicateMap(sdm.getPredicateMap());
				copySegModel.setConformanceStatements(sdm.getConformanceStatements());
				copySegModel.setSingleCodeMap(sdm.getSingleCodeMap());
				copySegModel.setValuesetMap(sdm.getValuesetMap());
				copySegModel.setFieldDataModels(sdm.getFieldDataModels());
				copySegModel.getModel().setId(copySegModel.getModel().getId() + "_COCON"
						+ coconLocation.getLocationId().replaceAll("\\.", "_") + "_" + cpModel.getModel().getId());
				String ext = copySegModel.getModel().getExt();
				if (ext == null)
					ext = "";
				copySegModel.getModel().setExt(ext + "_COCON" + coconLocation.getLocationId().replaceAll("\\.", "_")
						+ "_" + cpModel.getModel().getId());

				this.inMemoryDomainExtensionService.put(copySegModel.getModel().getId(), copySegModel.getModel());

				toBeAddedSegments.put(copySegModel.getModel().getId(), copySegModel);
				SegmentRefOrGroupDataModel srogdm = cpModel
						.findSegmentRefOrGroupDataModelById(coconLocation.getLocationId().split("\\-"));
				srogdm.getSegment().setId(srogdm.getSegment().getId() + "_COCON"
						+ coconLocation.getLocationId().replaceAll("\\.", "_") + "_" + cpModel.getModel().getId());
			}
		}
		for (String key : toBeAddedSegments.keySet()) {
			igModel.getSegments().add(toBeAddedSegments.get(key));
		}
	}

	private void updateGroupOrSegmentRefModel(List<String> pathList, SegmentRefOrGroupDataModel sgModel,
			IgDataModel igModel, Set<ValuesetBindingDataModel> valuesetBindingDataModels,
			Map<String, DatatypeDataModel> toBeAddedDTs, Map<String, SegmentDataModel> toBeAddedSegs)
			throws ClassNotFoundException, IOException {
		if (sgModel.getType().equals(Type.GROUP)) {
			SegmentRefOrGroupDataModel childModel = sgModel.findChildByPosition(Integer.parseInt(pathList.remove(0)));
			updateGroupOrSegmentRefModel(pathList, childModel, igModel, valuesetBindingDataModels, toBeAddedDTs,
					toBeAddedSegs);
		} else {
			SegmentDataModel sModel = igModel.findSegment(sgModel.getSegment().getId());
			if (sModel == null)
				sModel = toBeAddedSegs.get(sgModel.getSegment().getId());

			SegmentDataModel copySModel = XMLSerializeServiceImpl.cloneThroughJson(sModel);

			int randumNum = new SecureRandom().nextInt(100000);
			copySModel.getModel().setId(sModel.getModel().getId() + "_A" + randumNum);
			String ext = sModel.getModel().getExt();
			if (ext == null)
				ext = "";
			copySModel.getModel().setExt(ext + "_A" + randumNum);

			if (pathList.size() == 1) {
				if (valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
					valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
					copySModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
					FieldDataModel fModel = copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.get(0)));
					fModel.setValuesets(valuesetBindingDataModels);
				}
			} else if (pathList.size() > 1) {
				FieldDataModel fModel = copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.remove(0)));

				DatatypeDataModel childDtModel = igModel.findDatatype(fModel.getDatatype().getId());
				if (childDtModel == null)
					childDtModel = toBeAddedDTs.get(fModel.getDatatype().getId());
				DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);

				int randumNum2 = new SecureRandom().nextInt(100000);
				copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum2);
				String ext2 = childDtModel.getModel().getExt();
				if (ext2 == null)
					ext2 = "";
				copyDtModel.getModel().setExt(ext2 + "_A" + randumNum2);
				toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
				fModel.getDatatype().setId(copyDtModel.getModel().getId());
				fModel.getDatatype().setExt(ext2 + "_A" + randumNum2);

				this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels, toBeAddedDTs);
			}
			sgModel.getSegment().setId(copySModel.getModel().getId());
			sgModel.getSegment().setExt(ext + "_A" + randumNum);
			toBeAddedSegs.put(copySModel.getModel().getId(), copySModel);
		}

	}

	@SuppressWarnings("unchecked")
	public static <T> T cloneThroughJson(T t) {
		Gson gson = new Gson();
		String json = gson.toJson(t);
		return (T) gson.fromJson(json, t.getClass());
	}

	private void updateChildDatatype(List<String> pathList, DatatypeDataModel dtModel, IgDataModel igModel,
			Set<ValuesetBindingDataModel> valuesetBindingDataModels, Map<String, DatatypeDataModel> toBeAddedDTs)
			throws ClassNotFoundException, IOException {
		if (pathList.size() == 1) {
			if (valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
				valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
				dtModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
				ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.get(0)));
				cModel.setValuesets(valuesetBindingDataModels);
			}

		} else if (pathList.size() > 1) {
			ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));

			DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
			if (childDtModel == null)
				childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
			DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);

			int randumNum = new SecureRandom().nextInt(100000);
			copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
			String ext = childDtModel.getModel().getExt();
			if (ext == null)
				ext = "";
			copyDtModel.getModel().setExt(ext + "_A" + randumNum);
			toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
			cModel.getDatatype().setId(copyDtModel.getModel().getId());

			this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels, toBeAddedDTs);
		}

	}

	private Set<ValuesetBindingDataModel> makeCopySet(Set<ValuesetBindingDataModel> valuesetBindingDataModels)
			throws IOException, ClassNotFoundException {
		Set<ValuesetBindingDataModel> copy = new HashSet<ValuesetBindingDataModel>();
		for (ValuesetBindingDataModel o : valuesetBindingDataModels) {
			copy.add(XMLSerializeServiceImpl.cloneThroughJson(o));
		}
		return copy;
	}

	public String generateConditionScript(Predicate p, String targetId) {
		if (p instanceof FreeTextPredicate) {
			FreeTextPredicate cp = (FreeTextPredicate) p;
			if (cp.getAssertionScript() != null) {
				return cp.getAssertionScript().replace("\n", "").replace("\r", "");
			}

		} else if (p instanceof AssertionPredicate) {
			AssertionPredicate cp = (AssertionPredicate) p;
			if (cp.getAssertion() != null)
				return "<Condition>" + this.assertionXMLSerialization
						.generateAssertionScript(cp.getAssertion(), cp.getLevel(), targetId, cp.getContext(), true)
						.replace("\n", "").replace("\r", "") + "</Condition>";
		}
		return null;
	}

	public String generateAssertionScript(ConformanceStatement c, String targetId) {
		if (c instanceof FreeTextConformanceStatement) {
			FreeTextConformanceStatement cs = (FreeTextConformanceStatement) c;
			if (cs.getAssertionScript() != null) {
				return cs.getAssertionScript().replace("\n", "").replace("\r", "");
			}
		} else if (c instanceof AssertionConformanceStatement) {
			AssertionConformanceStatement cs = (AssertionConformanceStatement) c;
			if (cs.getAssertion() != null) {
				String asserionScript = this.assertionXMLSerialization.generateAssertionScript(cs.getAssertion(),
						cs.getLevel(), targetId, cs.getContext(), false);
				if (asserionScript != null)
					return "<Assertion>" + asserionScript.replace("\n", "").replace("\r", "") + "</Assertion>";
			}
		}
		return null;
	}

	@Override
	public Element serializeSlicingXML(IgDataModel igModel) {

		Element e = new Element("ProfileSlicing");
		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "ProfileSlicing.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		e.addAttribute(schemaDecl);
		e.addAttribute(new Attribute("ID", UUID.randomUUID().toString()));

		String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());

		Element elmSegmentSlicing = new Element("SegmentSlicing");
		Element elmFieldSlicing = new Element("FieldSlicing");

		for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
			ConformanceProfile cp = cpModel.getModel();
			Element elmMessage = new Element("Message");
			elmMessage.addAttribute(new Attribute("ID", this.str(cp.getId())));

			if (cp.getSlicings() != null) {
				cp.getSlicings().forEach(item -> {
					String[] pathArray = item.getPath().split("\\-");
					
					String groupContextId = "";
					if (pathArray.length > 1) {
						groupContextId = this.str(cp.getId()) + "-" + pathArray[pathArray.length - 2];
					} else {
						groupContextId = this.str(cp.getId());
					}
					
					Element elmGroupContext = this.findGroupContextElm(elmMessage, groupContextId);

					if (item.getType().equals(SlicingMethod.OCCURRENCE)) {
						OrderedSlicing orderedSlicing = (OrderedSlicing) item;

						if (orderedSlicing.getSlices() != null) {
							Element elmOccurrenceSlicing = new Element("OccurrenceSlicing");

							String[] segId = pathArray[pathArray.length - 1].split("\\.");
							elmOccurrenceSlicing.addAttribute(new Attribute("Position", "" + segId[segId.length - 1]));

							orderedSlicing.getSlices().forEach(slice -> {
								if (slice.getFlavorId() != null && slice.getPosition() > 0) {
									Element elmSlice = new Element("Slice");
									elmSlice.addAttribute(new Attribute("Occurrence", "" + slice.getPosition()));
									elmSlice.addAttribute(new Attribute("Ref",
											"" + this.segmentService.findXMLRefIdById(
													this.segmentService.findById(slice.getFlavorId()),
													defaultHL7Version)));
//									elmSlice.addAttribute(new Attribute("Ref",
//											"" + this.segmentService.findXMLRefIdById(
//													igModel.findSegment(slice.getFlavorId()).getModel(),
//													defaultHL7Version)));
									elmOccurrenceSlicing.appendChild(elmSlice);
								}

							});
							if (elmOccurrenceSlicing.getChildElements().size() > 0) {
								elmGroupContext.appendChild(elmOccurrenceSlicing);
							}
						}
					} else if (item.getType().equals(SlicingMethod.ASSERTION)) {
						ConditionalSlicing conditionalSlicing = (ConditionalSlicing) item;
						Element elmAssertionSlicing = new Element("AssertionSlicing");

						String[] segId = pathArray[pathArray.length - 1].split("\\.");
						elmAssertionSlicing.addAttribute(new Attribute("Position", "" + segId[segId.length - 1]));

						conditionalSlicing.getSlices().forEach(slice -> {
							Element elmSlice = new Element("Slice");
							if (slice.getFlavorId() != null) {
								elmSlice.addAttribute(new Attribute("Ref",
										"" + this.segmentService.findXMLRefIdById(
												this.segmentService.findById(slice.getFlavorId()),
												defaultHL7Version)));
								
								
//								elmSlice.addAttribute(new Attribute("Ref",
//										"" + this.segmentService.findXMLRefIdById(
//												igModel.findSegment(slice.getFlavorId()).getModel(),
//												defaultHL7Version)));
							}

							Element elmDescription = new Element("Description");
							Element elmAssertion = new Element("Assertion");

							String xmlScript = this.assertionXMLSerialization.generateAssertionScript(
									slice.getAssertion(), Level.SEGMENT, slice.getFlavorId(), null, true);
							if (xmlScript != null) {
								elmAssertion.appendChild(
										this.innerXMLHandler(xmlScript.replace("\n", "").replace("\r", "")));

								elmDescription.appendChild(slice.getAssertion().getDescription());
								elmAssertionSlicing.appendChild(elmSlice);

								elmSlice.appendChild(elmDescription);
								elmSlice.appendChild(elmAssertion);
							}

						});
						if (elmAssertionSlicing.getChildElements().size() > 0) {
							elmGroupContext.appendChild(elmAssertionSlicing);
						}
					}
					if (elmGroupContext.getChildElements().size() > 0) {
						try {
							elmMessage.appendChild(elmGroupContext);
						} catch (Exception er) {
							
						}
					}
				});
			}

			if (elmMessage.getChildElements().size() > 0) {
				elmSegmentSlicing.appendChild(elmMessage);
			}

		}

		for (SegmentDataModel sModel : igModel.getSegments()) {
			Segment s = sModel.getModel();
			Element elmSegmentContext = new Element("SegmentContext");
			elmSegmentContext.addAttribute(new Attribute("ID", this.str(s.getLabel())));

			if (s.getSlicings() != null) {
				s.getSlicings().forEach(item -> {
					if (item.getType().equals(SlicingMethod.OCCURRENCE)) {
						OrderedSlicing orderedSlicing = (OrderedSlicing) item;

						if (orderedSlicing.getSlices() != null) {
							Element elmOccurrenceSlicing = new Element("OccurrenceSlicing");
							elmOccurrenceSlicing.addAttribute(new Attribute("Position", "" + orderedSlicing.getPath()));
							orderedSlicing.getSlices().forEach(slice -> {
								if (slice.getFlavorId() != null && slice.getPosition() > 0) {
									Element elmSlice = new Element("Slice");
									elmSlice.addAttribute(new Attribute("Occurrence", "" + slice.getPosition()));
									elmSlice.addAttribute(new Attribute("Ref",
											"" + this.datatypeService.findXMLRefIdById(
													igModel.findDatatype(slice.getFlavorId()).getModel(),
													defaultHL7Version)));
									elmOccurrenceSlicing.appendChild(elmSlice);
								}

							});

							if (elmOccurrenceSlicing.getChildElements().size() > 0) {
								elmSegmentContext.appendChild(elmOccurrenceSlicing);
							}
						}

					} else if (item.getType().equals(SlicingMethod.ASSERTION)) {
						ConditionalSlicing conditionalSlicing = (ConditionalSlicing) item;
						Element elmAssertionSlicing = new Element("AssertionSlicing");
						elmAssertionSlicing.addAttribute(new Attribute("Position", "" + conditionalSlicing.getPath()));

						conditionalSlicing.getSlices().forEach(slice -> {
							Element elmSlice = new Element("Slice");
							if (slice.getFlavorId() != null) {
								elmSlice.addAttribute(new Attribute("Ref",
										"" + this.datatypeService.findXMLRefIdById(
												igModel.findDatatype(slice.getFlavorId()).getModel(),
												defaultHL7Version)));
							}

							Element elmDescription = new Element("Description");
							Element elmAssertion = new Element("Assertion");

							String xmlScript = this.assertionXMLSerialization.generateAssertionScript(
									slice.getAssertion(), Level.DATATYPE, slice.getFlavorId(), null, true);
							if (xmlScript != null) {
								elmAssertion.appendChild(
										this.innerXMLHandler(xmlScript.replace("\n", "").replace("\r", "")));

								elmDescription.appendChild(slice.getAssertion().getDescription());
								elmAssertionSlicing.appendChild(elmSlice);

								elmSlice.appendChild(elmDescription);
								elmSlice.appendChild(elmAssertion);
							}

						});

						if (elmAssertionSlicing.getChildElements().size() > 0) {
							elmSegmentContext.appendChild(elmAssertionSlicing);
						}
					}
				});
			}

			if (elmSegmentContext.getChildElements().size() > 0) {
				elmFieldSlicing.appendChild(elmSegmentContext);
			}
		}
		
		
		if (elmSegmentSlicing.getChildElements().size() > 0) {
			e.appendChild(elmSegmentSlicing);
		}
		if (elmFieldSlicing.getChildElements().size() > 0) {
			e.appendChild(elmFieldSlicing);
		}
		return e;
	}

	private Element findGroupContextElm(Element elmMessage, String groupContextId) {
		if(elmMessage.getChildElements() != null ) {
			for (int i = 0; i < elmMessage.getChildElements().size(); i++) {
				Element e = elmMessage.getChildElements().get(i);

				if (e.getLocalName() != null && e.getLocalName().equals("GroupContext"))
					if (e.getAttribute("ID") != null && e.getAttribute("ID").getValue().equals(groupContextId))
						return e;
			}	
		}

		Element elmGroupContext = new Element("GroupContext");
		elmGroupContext.addAttribute(new Attribute("ID", groupContextId));
		return elmGroupContext;
	}

	@Override
	public Element serializeBindingsXML(IgDataModel igModel) {
		Element e = new Element("ValueSetBindingsContext");
		Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
				schemaURL+ "ValueSetBindings.xsd");
		schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
		e.addAttribute(schemaDecl);
		e.addAttribute(new Attribute("ID", UUID.randomUUID().toString()));

		String defaultHL7Version = this.igService.findDefaultHL7VersionById(igModel.getModel().getId());

		Element elmValueSetBindings = new Element("ValueSetBindings");

		Element elmDatatypeV = new Element("Datatype");

		for (DatatypeDataModel dtdm : igModel.getDatatypes()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(
					new Attribute("ID", this.datatypeService.findXMLRefIdById(dtdm.getModel(), defaultHL7Version)));

			if (dtdm.getModel().getBinding() != null && dtdm.getModel().getBinding().getChildren() != null) {
				this.generateElmValueSetBinding(elmByID, dtdm.getModel().getBinding().getChildren(), "", "",
						defaultHL7Version, igModel, dtdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmDatatypeV.appendChild(elmByID);
			}

		}

		if (elmDatatypeV.getChildElements().size() > 0) {
			elmValueSetBindings.appendChild(elmDatatypeV);
		}

		Element elmSegmentV = new Element("Segment");

		for (SegmentDataModel segdm : igModel.getSegments()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(
					new Attribute("ID", this.segmentService.findXMLRefIdById(segdm.getModel(), defaultHL7Version)));

			if (segdm.getModel().getBinding() != null && segdm.getModel().getBinding().getChildren() != null) {
				this.generateElmValueSetBinding(elmByID, segdm.getModel().getBinding().getChildren(), "", "", defaultHL7Version, igModel, segdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmSegmentV.appendChild(elmByID);
			}

		}

		if (elmSegmentV.getChildElements().size() > 0) {
			elmValueSetBindings.appendChild(elmSegmentV);
		}

		Element elmMessageV = new Element("Message");

		for (ConformanceProfileDataModel cpdm : igModel.getConformanceProfiles()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(new Attribute("ID", cpdm.getModel().getId()));

			if (cpdm.getModel().getBinding() != null && cpdm.getModel().getBinding().getChildren() != null) {
				this.generateElmValueSetBinding(elmByID, cpdm.getModel().getBinding().getChildren(), "", "", defaultHL7Version, igModel, cpdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmMessageV.appendChild(elmByID);
			}

		}

		if (elmMessageV.getChildElements().size() > 0) {
			elmValueSetBindings.appendChild(elmMessageV);
		}

		if (elmValueSetBindings.getChildElements().size() > 0) {
			e.appendChild(elmValueSetBindings);
		}

		Element elmSingleCodeBindings = new Element("SingleCodeBindings");

		Element elmDatatypeS = new Element("Datatype");

		for (DatatypeDataModel dtdm : igModel.getDatatypes()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(
					new Attribute("ID", this.datatypeService.findXMLRefIdById(dtdm.getModel(), defaultHL7Version)));

			if (dtdm.getModel().getBinding() != null && dtdm.getModel().getBinding().getChildren() != null) {
				this.generateElmSingleCodeBinding(elmByID, dtdm.getModel().getBinding().getChildren(), "", "",
						defaultHL7Version, igModel, dtdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmDatatypeS.appendChild(elmByID);
			}

		}

		if (elmDatatypeS.getChildElements().size() > 0) {
			elmSingleCodeBindings.appendChild(elmDatatypeS);
		}

		Element elmSegmentS = new Element("Segment");

		for (SegmentDataModel segdm : igModel.getSegments()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(
					new Attribute("ID", this.segmentService.findXMLRefIdById(segdm.getModel(), defaultHL7Version)));

			if (segdm.getModel().getBinding() != null && segdm.getModel().getBinding().getChildren() != null) {
				this.generateElmSingleCodeBinding(elmByID, segdm.getModel().getBinding().getChildren(), "", "",
						defaultHL7Version, igModel, segdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmSegmentS.appendChild(elmByID);
			}

		}

		if (elmSegmentS.getChildElements().size() > 0) {
			elmSingleCodeBindings.appendChild(elmSegmentS);
		}

		Element elmMessageS = new Element("Message");

		for (ConformanceProfileDataModel cpdm : igModel.getConformanceProfiles()) {
			Element elmByID = new Element("ByID");
			elmByID.addAttribute(new Attribute("ID", cpdm.getModel().getId()));

			if (cpdm.getModel().getBinding() != null && cpdm.getModel().getBinding().getChildren() != null) {
				this.generateElmSingleCodeBinding(elmByID, cpdm.getModel().getBinding().getChildren(), "", "",
						defaultHL7Version, igModel, cpdm);
			}

			if (elmByID.getChildElements().size() > 0) {
				elmMessageS.appendChild(elmByID);
			}

		}

		if (elmMessageS.getChildElements().size() > 0) {
			elmSingleCodeBindings.appendChild(elmMessageS);
		}

		if (elmSingleCodeBindings.getChildElements().size() > 0) {
			e.appendChild(elmSingleCodeBindings);
		}

		return e;
	}

	private void generateElmSingleCodeBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath, String defaultHL7Version, IgDataModel igModel, DatatypeDataModel dtdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getSingleCodeBindings() != null) {
				for (SingleCodeBinding sb : seb.getSingleCodeBindings()) {
					Element elmSingleCodeBinding = new Element("SingleCodeBinding");

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmSingleCodeBinding.addAttribute(new Attribute("Target", instancePositionPath));
					elmSingleCodeBinding.addAttribute(new Attribute("Code", sb.getCode()));
					elmSingleCodeBinding.addAttribute(new Attribute("CodeSystem", sb.getCodeSystem()));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), dtdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmSingleCodeBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);
							}
						}
					}

					if (elmSingleCodeBinding.getChildElements().size() > 0) {
						parentElm.appendChild(elmSingleCodeBinding);
					}
				}
			}
			if (seb.getChildren() != null) {
				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();
				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmSingleCodeBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, dtdm);
			}
		}
	}

	private void generateElmSingleCodeBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath,
			String defaultHL7Version, IgDataModel igModel, SegmentDataModel segdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getSingleCodeBindings() != null) {
				for (SingleCodeBinding sb : seb.getSingleCodeBindings()) {
					Element elmSingleCodeBinding = new Element("SingleCodeBinding");

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmSingleCodeBinding.addAttribute(new Attribute("Target", instancePositionPath));
					elmSingleCodeBinding.addAttribute(new Attribute("Code", sb.getCode()));
					elmSingleCodeBinding.addAttribute(new Attribute("CodeSystem", sb.getCodeSystem()));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), segdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmSingleCodeBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);
							}
						}
					}

					if (elmSingleCodeBinding.getChildElements().size() > 0) {
						parentElm.appendChild(elmSingleCodeBinding);
					}
				}
			}
			if (seb.getChildren() != null) {
				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();
				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmSingleCodeBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, segdm);
			}
		}
	}

	private void generateElmSingleCodeBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath,
			String defaultHL7Version, IgDataModel igModel, ConformanceProfileDataModel cpdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getSingleCodeBindings() != null) {
				for (SingleCodeBinding sb : seb.getSingleCodeBindings()) {
					Element elmSingleCodeBinding = new Element("SingleCodeBinding");

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmSingleCodeBinding.addAttribute(new Attribute("Target", instancePositionPath));
					elmSingleCodeBinding.addAttribute(new Attribute("Code", sb.getCode()));
					elmSingleCodeBinding.addAttribute(new Attribute("CodeSystem", sb.getCodeSystem()));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), cpdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmSingleCodeBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : sb.getLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmSingleCodeBinding.appendChild(elmBindingLocations);
							}
						}
					}

					if (elmSingleCodeBinding.getChildElements().size() > 0) {
						parentElm.appendChild(elmSingleCodeBinding);
					}
				}
			}
			if (seb.getChildren() != null && seb.getLocationInfo() != null) {
				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();
				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmSingleCodeBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, cpdm);
			}
		}
	}

	private String makeInstancePath(String path) {

		String paths[] = path.split("\\.");
		for (int i = 0; i < paths.length; i++) {
			paths[i] = paths[i] + "[*]";
		}
		return String.join(".", paths);
	}

	private void generateElmValueSetBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath, String defaultHL7Version, IgDataModel igModel, DatatypeDataModel dtdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getValuesetBindings() != null) {
				for (ValuesetBinding vsb : seb.getValuesetBindings()) {
					Element elmValueSetBinding = new Element("ValueSetBinding");
					if (vsb.getStrength() == null) {
						elmValueSetBinding
								.addAttribute(new Attribute("BindingStrength", ValuesetStrength.U.toString()));
					} else {
						elmValueSetBinding.addAttribute(new Attribute("BindingStrength", vsb.getStrength().toString()));
					}

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmValueSetBinding.addAttribute(new Attribute("Target", instancePositionPath));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), dtdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmValueSetBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);
							}
						}
					}

					Element elmBindings = new Element("Bindings");

					if (vsb.getValueSets() != null) {
						for (String vs : vsb.getValueSets()) {
							Element elmBinding = new Element("Binding");
							if (igModel.findValueset(vs) != null) {
								elmBinding.addAttribute(new Attribute("BindingIdentifier", this.valuesetService
										.findXMLRefIdById(igModel.findValueset(vs).getModel(), defaultHL7Version)));
								elmBindings.appendChild(elmBinding);
							}

						}
					}

					if (elmBindings.getChildElements().size() > 0) {
						elmValueSetBinding.appendChild(elmBindings);
						if (elmValueSetBinding.getChildElements().size() > 0) {
							parentElm.appendChild(elmValueSetBinding);
						}
					}
				}
			}
			if (seb.getChildren() != null) {
				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();
				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmValueSetBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, dtdm);
			}
		}
	}

	private void generateElmValueSetBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath, String defaultHL7Version, IgDataModel igModel, SegmentDataModel segdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getValuesetBindings() != null) {
				for (ValuesetBinding vsb : seb.getValuesetBindings()) {
					Element elmValueSetBinding = new Element("ValueSetBinding");
					if (vsb.getStrength() == null) {
						elmValueSetBinding
								.addAttribute(new Attribute("BindingStrength", ValuesetStrength.U.toString()));
					} else {
						elmValueSetBinding.addAttribute(new Attribute("BindingStrength", vsb.getStrength().toString()));
					}

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmValueSetBinding.addAttribute(new Attribute("Target", instancePositionPath));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), segdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmValueSetBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);
							}
						}
					}

					Element elmBindings = new Element("Bindings");

					if (vsb.getValueSets() != null) {
						for (String vs : vsb.getValueSets()) {
							Element elmBinding = new Element("Binding");

							if (igModel.findValueset(vs) != null) {
								elmBinding.addAttribute(new Attribute("BindingIdentifier", this.valuesetService
										.findXMLRefIdById(igModel.findValueset(vs).getModel(), defaultHL7Version)));
								elmBindings.appendChild(elmBinding);
							}
						}
					}

					if (elmBindings.getChildElements().size() > 0) {
						elmValueSetBinding.appendChild(elmBindings);

						if (elmValueSetBinding.getChildElements().size() > 0) {
							parentElm.appendChild(elmValueSetBinding);
						}
					}

				}
			}
			if (seb.getChildren() != null) {
				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();
				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmValueSetBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, segdm);
			}
		}
	}

	private void generateElmValueSetBinding(Element parentElm, Set<StructureElementBinding> children, String pathId, String positionPath, String defaultHL7Version, IgDataModel igModel, ConformanceProfileDataModel cpdm) {
		for (StructureElementBinding seb : children) {
			if (seb.getValuesetBindings() != null) {
				for (ValuesetBinding vsb : seb.getValuesetBindings()) {
					Element elmValueSetBinding = new Element("ValueSetBinding");
					if (vsb.getStrength() == null) {
						elmValueSetBinding
								.addAttribute(new Attribute("BindingStrength", ValuesetStrength.U.toString()));
					} else {
						elmValueSetBinding.addAttribute(new Attribute("BindingStrength", vsb.getStrength().toString()));
					}

					String instancePositionPath = this.makeInstancePath((positionPath + "." + seb.getLocationInfo().getPosition()).substring(1));
					elmValueSetBinding.addAttribute(new Attribute("Target", instancePositionPath));

					String childPathId = pathId + "-" + seb.getElementId();
					DatatypeDataModel dt = this.findDatatype(igModel, childPathId.substring(1).split("\\-"), cpdm);

					if (dt.getComponentDataModels() == null || dt.getComponentDataModels().size() == 0) {
						Element elmBindingLocations = new Element("BindingLocations");
						Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
						elmSimpleBindingLocation.addAttribute(new Attribute("CodeLocation", "."));
						elmBindingLocations.appendChild(elmSimpleBindingLocation);
						elmValueSetBinding.appendChild(elmBindingLocations);
					} else {
						Config config = this.configService.findOne();
						BindingInfo bindingInfo = config.getValueSetBindingConfig().get(dt.getModel().getName());

						if (bindingInfo != null) {
							if (bindingInfo.isCoded()) {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmComplexBindingLocation = new Element("ComplexBindingLocation");
									elmComplexBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));
									elmComplexBindingLocation.addAttribute(
											new Attribute("CodeSystemLocation", this.findCodeSystemLocation(location)));

									elmBindingLocations.appendChild(elmComplexBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);

							} else {
								Element elmBindingLocations = new Element("BindingLocations");
								for (Integer location : vsb.getValuesetLocations()) {
									Element elmSimpleBindingLocation = new Element("SimpleBindingLocation");
									elmSimpleBindingLocation
											.addAttribute(new Attribute("CodeLocation", location + "[1]"));

									elmBindingLocations.appendChild(elmSimpleBindingLocation);
								}
								elmValueSetBinding.appendChild(elmBindingLocations);
							}
						}
					}

					Element elmBindings = new Element("Bindings");

					if (vsb.getValueSets() != null) {
						for (String vs : vsb.getValueSets()) {
							Element elmBinding = new Element("Binding");

							if (igModel.findValueset(vs) != null) {
								elmBinding.addAttribute(new Attribute("BindingIdentifier", this.valuesetService
										.findXMLRefIdById(igModel.findValueset(vs).getModel(), defaultHL7Version)));
								elmBindings.appendChild(elmBinding);
							}
						}
					}

					if (elmBindings.getChildElements().size() > 0) {
						elmValueSetBinding.appendChild(elmBindings);

						if (elmValueSetBinding.getChildElements().size() > 0) {
							parentElm.appendChild(elmValueSetBinding);
						}
					}

				}
			}
			if (seb.getChildren() != null && seb.getLocationInfo() != null) {

				String instancePositionPath = positionPath + "." + seb.getLocationInfo().getPosition();

				String childPathId = pathId + "-" + seb.getElementId();
				this.generateElmValueSetBinding(parentElm, seb.getChildren(), childPathId, instancePositionPath, defaultHL7Version, igModel, cpdm);
			}
		}
	}

	private String findCodeSystemLocation(Integer location) {
		if (location == 1) {
			return "3[1]";

		} else if (location == 4) {
			return "6[1]";
		} else if (location == 10) {
			return "12[1]";
		} else if (location == 2) {
			return "4[1]";
		} else if (location == 5) {
			return "7[1]";
		}
		return null;
	}

	private DatatypeDataModel findDatatype(IgDataModel igModel, String[] paths, DatatypeDataModel dtdm) {
		ComponentDataModel cdm = dtdm.findComponentDataModelByPosition(Integer.parseInt(paths[0]));

		if (paths.length > 1) {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length),
					igModel.findDatatype(cdm.getDatatype().getId()));
		} else if (paths.length == 1) {
			return igModel.findDatatype(cdm.getDatatype().getId());
		}
		return null;
	}

	private DatatypeDataModel findDatatype(IgDataModel igModel, String[] paths, SegmentDataModel segdm) {
		FieldDataModel fdm = segdm.findFieldDataModelByPosition(Integer.parseInt(paths[0]));

		if (paths.length > 1) {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length),
					igModel.findDatatype(fdm.getDatatype().getId()));
		} else if (paths.length == 1) {
			return igModel.findDatatype(fdm.getDatatype().getId());
		}
		return null;
	}

	private DatatypeDataModel findDatatype(IgDataModel igModel, String[] paths, ConformanceProfileDataModel cpdm) {
		SegmentRefOrGroupDataModel srogdm = cpdm.findChildById(paths[0]);

		if (srogdm.getChildren() == null || srogdm.getChildren().size() == 0) {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length),
					igModel.findSegment(srogdm.getSegment().getId()));
		} else {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length), srogdm);
		}

	}

	private DatatypeDataModel findDatatype(IgDataModel igModel, String[] paths, SegmentRefOrGroupDataModel parent) {
		SegmentRefOrGroupDataModel srogdm = parent.findChildById(paths[0]);

		if (srogdm.getChildren() == null || srogdm.getChildren().size() == 0) {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length),
					igModel.findSegment(srogdm.getSegment().getId()));
		} else {
			return this.findDatatype(igModel, Arrays.copyOfRange(paths, 1, paths.length), srogdm);
		}
	}



}
