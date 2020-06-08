package gov.nist.hit.hl7.igamt.export.service.impl;

import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.lang3.SerializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaMode;
import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingContained;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingRef;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.VariesCell;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
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
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibraryDataModel;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
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
import gov.nist.hit.hl7.igamt.export.service.DlNewExportService;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.IgDataModelSerializationService;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class DlNewExportServiceImpl implements DlNewExportService {
	
	@Autowired
	DatatypeLibraryService datatypeLibraryService;
	
	@Autowired
	FroalaSerializationUtil cleaner;

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
	
	@Autowired
	CoConstraintService coConstraintService;

	private static final String IG_XSLT_PATH = "/IGDocumentExport.xsl";

	@Override
	public ExportedFile exportDlDocumentToHtml(String username, String dlDocumentId, ExportFilterDecision decision,
			String configId) throws Exception {
		DatatypeLibrary datatypeLibrary = datatypeLibraryService.findById(dlDocumentId);
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (datatypeLibrary != null) {
			ExportedFile htmlFile = this.serializeDlDocumentToHtml(username, datatypeLibrary, ExportFormat.HTML, decision, exportConfiguration);
			return htmlFile;
		}
		return null;
	}


	@Override
	public ExportedFile serializeDlDocumentToHtml(String username, DatatypeLibrary dl, ExportFormat exportFormat,
			ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception {
		try {			
			ExportFontConfiguration exportFontConfiguration =
					exportFontConfigurationService.getExportFontConfiguration(username);
			DatatypeLibraryDataModel datatypeLibraryDataModel = datatypeLibraryService.generateDataModel(dl);
			String xmlContent =
					igDataModelSerializationService.serializeDocument(datatypeLibraryDataModel, exportConfiguration,decision).toXML();
					      System.out.println("XML_EXPORT_DATATYPELIBRARY : " + xmlContent);
//					      System.out.println("XmlContent in IgExportService is : " + xmlContent);
			// TODO add app infoservice to get app version
			ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
					dl.getName(), dl.getMetadata().getCoverPicture(), exportConfiguration,
					exportFontConfiguration, "2.0_beta",dl.getType());
			InputStream htmlContent = exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH,
					exportParameters);
			ExportedFile exportedFile = new ExportedFile(htmlContent, dl.getName(), dl.getId(),
					exportFormat);
			exportedFile.setContent(htmlContent);
			// return new ExportedFile(htmlContent, igDocument.getName(),
			// igDocument.getId(), exportFormat);

			return exportedFile;
		} catch (SerializationException serializationException) {
			throw new ExportException(serializationException,
					"Unable to serialize Document with ID " + dl.getId());
		}
	}

	@Override
	public ExportedFile exportDlDocumentToWord(String username, String id, ExportFilterDecision decision,
			String configId) throws Exception {
		DatatypeLibrary dl = datatypeLibraryService.findById(id);
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (dl != null) {
			ExportedFile htmlFile = this.serializeDlDocumentToHtml(username, dl, ExportFormat.WORD, decision, exportConfiguration);
			ExportedFile wordFile = WordUtil.convertHtmlToWord(htmlFile, dl.getMetadata(),
					dl.getUpdateDate(),
					dl.getDomainInfo() != null ? dl.getDomainInfo().getVersion() : null);
			return wordFile;
		}
		return null;
	}
	
	@Override
	public ExportFilterDecision getExportFilterDecision(DatatypeLibrary dl, ExportConfiguration config)
			throws CoConstraintGroupNotFoundException {

		ExportFilterDecision decision = new ExportFilterDecision();

//		for (Link l : ig.getConformanceProfileRegistry().getChildren()) {
//			decision.getConformanceProfileFilterMap().put(l.getId(), true);
//		}
//		for (Link l : ig.getSegmentRegistry().getChildren()) {
//			decision.getSegmentFilterMap().put(l.getId(), false);
//		}
		for (Link l : dl.getDatatypeRegistry().getChildren()) {
			decision.getDatatypesFilterMap().put(l.getId(), false);
		}
//		for (Link l : ig.getValueSetRegistry().getChildren()) {
//			decision.getValueSetFilterMap().put(l.getId(), false);
//		}
//		processConformanceProfiles(ig, decision, config);
		return decision;
	}

	
	}
