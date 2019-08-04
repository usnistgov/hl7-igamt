package gov.nist.hit.hl7.igamt.export.service.impl;

import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.lang3.SerializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationFilterService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.IgDataModelSerializationService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class IgNewExportServiceImpl implements IgNewExportService {

	@Autowired
	IgService igService;

	@Autowired
	ExportConfigurationService exportConfigurationService;

	@Autowired
	ExportFontConfigurationService exportFontConfigurationService;

	@Autowired
	IgDataModelSerializationService igDataModelSerializationService;
	@Autowired
	private DatatypeService datatypeService;

	@Autowired
	private ValuesetService valuesetService;

	@Autowired
	private SegmentService segmentService;

	@Autowired
	private ConformanceProfileService conformanceProfileService;

	@Autowired
	ExportService exportService;

	@Autowired
	ExportConfigurationFilterService exportConfigurationFilterService;

	private static final String IG_XSLT_PATH = "/IGDocumentExport.xsl";

	public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId) throws Exception {
		Ig igDocument = igService.findById(igDocumentId);
		if (igDocument != null) {
			ExportedFile htmlFile =
					this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.HTML);
			return htmlFile;
		}
		return null;
	}

	private ExportedFile serializeIgDocumentToHtml(String username, Ig igDocument,
			ExportFormat exportFormat) throws Exception {
		try {
			ExportConfiguration exportConfiguration =
					exportConfigurationService.getExportConfiguration(username);
			exportConfiguration = ExportConfiguration.populateRestOfExportConfiguration(exportConfiguration);
			ExportFontConfiguration exportFontConfiguration =
					exportFontConfigurationService.getExportFontConfiguration(username);

			//		      ExportFilterDecision exportFilterDecision = exportConfigurationFilterService.getExportFilterConfiguration(username);
			ExportFilterDecision exportFilterDecision = ExportFilterDecision.CreateExportFilterDecision(exportConfiguration);


			//		      String xmlContent =
			//		          igSerializationService.serializeIgDocument(igDocument, exportConfiguration); 
			IgDataModel igDataModel = igService.generateDataModel(igDocument);
			String xmlContent =
					igDataModelSerializationService.serializeIgDocument(igDataModel, exportConfiguration,exportFilterDecision).toXML();
			//		      System.out.println("XML_EXPORT : " + xmlContent);
			//		      System.out.println("XmlContent in IgExportService is : " + xmlContent);
			// TODO add app infoservice to get app version
			ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
					igDocument.getName(), igDocument.getMetadata().getCoverPicture(), exportConfiguration,
					exportFontConfiguration, "2.0_beta");
			InputStream htmlContent =
					exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH, exportParameters);
			ExportedFile exportedFile = new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(), exportFormat);
			exportedFile.setContent(htmlContent);
			//		      return new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(), exportFormat);

			return exportedFile;
		} catch (SerializationException  serializationException) {
			throw new ExportException(serializationException,
					"Unable to serialize IG Document with ID " + igDocument.getId());
		}
	}

	@Override
	public ExportFilterDecision getExportFilterDecision(Ig ig, ExportConfiguration config) {
		ExportFilterDecision decision = new ExportFilterDecision();

		for(Link l : ig.getConformanceProfileRegistry().getChildren()) {
			decision.getConformanceProfileFilterMap().put(l.getId(), true);		
		}
		for(Link l : ig.getSegmentRegistry().getChildren()) {
			decision.getSegmentFilterMap().put(l.getId(), false);
		}
		for(Link l : ig.getDatatypeRegistry().getChildren()) {
			decision.getDatatypesFilterMap().put(l.getId(), false);
		}
		for(Link l : ig.getValueSetRegistry().getChildren()) {
			decision.getValueSetFilterMap().put(l.getId(), false);	
		}
		processConformanceProfiles(ig,decision,config);
		return decision;
	}


	private void processConformanceProfiles(Ig ig,ExportFilterDecision decision , ExportConfiguration config) {

		Set<String> segmentIds = new HashSet<String>(); 
		Set<String> datatypesIds = new HashSet<String>();
		List<ConformanceProfile> profiles = conformanceProfileService
				.findByIdIn(ig.getConformanceProfileRegistry().getLinksAsIds());
		for (ConformanceProfile profile : profiles) {
			segmentIds.addAll(processConformanceProfile(profile, decision, config));
		}
		List<Segment> BindedSegments = segmentService.findByIdIn(segmentIds);

		for(Segment s: BindedSegments) {
			datatypesIds.addAll(processSegment(s, decision, config));
		}
		List<Datatype> bindedDatatypes = datatypeService.findByIdIn(datatypesIds);

		for(Datatype dt: bindedDatatypes) {
			HashMap<String,Boolean> processed= new HashMap<String,Boolean>();
			datatypesIds.addAll(processDatatype(dt, decision, config, new HashMap<String, Boolean>(), processed));
		}
	}

	private Set<String> processSegment(Segment s, ExportFilterDecision decision, ExportConfiguration config) {
		Set<String> datatypesIds = new HashSet<String>();
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();
		for(Field child: s.getChildren() ) {
			if(child.getRef() != null && child.getRef().getId() !=null) {
				if(child.getUsage() !=null && config.getDatatypesExport().isBinded(child.getUsage())) {
					datatypesIds.add(child.getRef().getId());
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}			
			}		
		}
		this.processBinding(s.getBinding(), bindedPaths, decision);
		return datatypesIds;
	}


	private Set<String> processDatatype(Datatype dt, ExportFilterDecision decision, ExportConfiguration config, HashMap<String, Boolean> bindedPaths, HashMap<String,Boolean> processed) {
		Set<String> datatypesIds = new HashSet<String>();
		if(!processed.containsKey(dt.getId())) {
			if(dt instanceof ComplexDatatype) {
				datatypesIds.addAll(processComplexDatatype((ComplexDatatype) dt, decision, config));
			}
		}
		processed.put(dt.getId(),true);
		return datatypesIds;
	}


	private Set<String> processComplexDatatype(ComplexDatatype dt, ExportFilterDecision decision, ExportConfiguration config) {
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean> ();
		Set<String> datatypesIds = new HashSet<String>();
		for(Component child: dt.getComponents() ) {
			if(child.getRef() != null && child.getRef().getId() !=null) {
				if(child.getUsage() !=null && config.getDatatypesExport().isBinded(child.getUsage())) {
					datatypesIds.add(child.getRef().getId());
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}			
			}		
		}
		this.processBinding(dt.getBinding(), bindedPaths, decision);
		return datatypesIds;
	}


	private Set<String> processConformanceProfile(ConformanceProfile cp, ExportFilterDecision decision, ExportConfiguration config) {
		// TODO Auto-generated method stub
		Set<String> segmentsIds = new HashSet<String>();
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();
			
		for (MsgStructElement segOrgroup : cp.getChildren()) {
			if (segOrgroup instanceof SegmentRef) {
				SegmentRef ref = (SegmentRef) segOrgroup;
				if (ref.getRef() != null && ref.getRef().getId() != null) {
					if(ref.getUsage() !=null && config.getSegmentsExport().isBinded(ref.getUsage())) {
						segmentsIds.add(ref.getRef().getId());
						decision.getSegmentFilterMap().put(ref.getRef().getId(), true);
						bindedPaths.put(ref.getId(), true);
					}
				}
			} else {
				processSegmentorGroup(segOrgroup,  decision,  config, bindedPaths,segOrgroup.getId(), segmentsIds);
			}
		}
		this.processBinding(cp.getBinding(), bindedPaths, decision);
		return segmentsIds;
	}

	private void processSegmentorGroup(MsgStructElement segOrgroup, ExportFilterDecision decision, ExportConfiguration config,
			HashMap<String, Boolean> bindedPaths, String path, Set<String> ids) {
		if (segOrgroup instanceof SegmentRef) {
			SegmentRef ref = (SegmentRef) segOrgroup;
			if (ref.getRef() != null && ref.getRef().getId() != null) {
				if(ref.getUsage() !=null && config.getSegmentsExport().isBinded(ref.getUsage())) {
					ids.add(ref.getRef().getId());
					bindedPaths.put(path, true);
					decision.getSegmentFilterMap().put(ref.getRef().getId(), true);
				}
			}
		} else if (segOrgroup instanceof Group) {
			Group g = (Group) segOrgroup;
			for (MsgStructElement child : g.getChildren()) {
				processSegmentorGroup(child,  decision,  config, bindedPaths,path, ids);	   
			}
		}
	}
	
	public void processBinding(ResourceBinding binding, HashMap<String, Boolean> bindedPaths, ExportFilterDecision decision) {
		if (binding.getChildren() != null) {
			for (StructureElementBinding child : binding.getChildren()) {
				if (child.getValuesetBindings() != null) {
					for (ValuesetBinding vs : child.getValuesetBindings()) {
						if (vs.getValuesetId() != null && bindedPaths.containsKey(child.getElementId())) {
							decision.getValueSetFilterMap().put(vs.getValuesetId(), true);
						}
					}
				}
				if (child.getChildren() != null && !child.getChildren().isEmpty()) {
					processStructureElementBinding(child, bindedPaths,decision,child.getElementId());
				}
			}
		}
	}

	private void processStructureElementBinding(StructureElementBinding structureElementBinding,
			HashMap<String, Boolean> bindedPaths, ExportFilterDecision decision, String path) {
		for (StructureElementBinding child : structureElementBinding.getChildren()) {
			if (child.getValuesetBindings() != null) {
				for (ValuesetBinding vs : child.getValuesetBindings()) {
					if (vs.getValuesetId() != null && bindedPaths.containsKey(path)) {
						decision.getValueSetFilterMap().put(vs.getValuesetId(), true);
					}
				}
			}
			if (child.getChildren() != null && !child.getChildren().isEmpty()) {
				processStructureElementBinding(child, bindedPaths,decision,path);
			}
		}
	}


}
