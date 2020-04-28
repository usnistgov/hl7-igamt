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
public class IgNewExportServiceImpl implements IgNewExportService {

	@Autowired
	IgService igService;
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
	public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId, ExportFilterDecision decision, String configId)
			throws Exception {
		Ig igDocument = igService.findById(igDocumentId);
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (igDocument != null) {
			ExportedFile htmlFile = this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.HTML, decision, exportConfiguration);
			return htmlFile;
		}
		return null;
	}

	@Override
	public ExportedFile serializeIgDocumentToHtml(String username, Ig igDocument, ExportFormat exportFormat,
			ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception {
		try {
//			ExportConfiguration exportConfiguration =
//					exportConfigurationService.getExportConfiguration(username);
			
//			DeltaConfiguration deltaConfig = new DeltaConfiguration();
//			deltaConfig.setColors(exportConfiguration.getSegmentExportConfiguration().getDeltaConfig().getColors());
//			deltaConfig.setMode(exportConfiguration.getSegmentExportConfiguration().getDeltaConfig().getMode());
//			Boolean deltaMode = exportConfiguration.getSegmentExportConfiguration().isDeltaMode();
//			exportConfiguration.getSegmentExportConfiguration().setDeltaConfig(deltaConfig);
//			exportConfiguration.getSegmentExportConfiguration().setDeltaMode(deltaMode);
			
			ExportFontConfiguration exportFontConfiguration =
					exportFontConfigurationService.getExportFontConfiguration(username);
			IgDataModel igDataModel = igService.generateDataModel(igDocument);
			String xmlContent =
					igDataModelSerializationService.serializeIgDocument(igDataModel, exportConfiguration,decision).toXML();
					      System.out.println("XML_EXPORT : " + xmlContent);
//					      System.out.println("XmlContent in IgExportService is : " + xmlContent);
			// TODO add app infoservice to get app version
			ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
					igDocument.getName(), igDocument.getMetadata().getCoverPicture(), exportConfiguration,
					exportFontConfiguration, "2.0_beta");
			InputStream htmlContent = exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH,
					exportParameters);
			ExportedFile exportedFile = new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(),
					exportFormat);
			exportedFile.setContent(htmlContent);
			// return new ExportedFile(htmlContent, igDocument.getName(),
			// igDocument.getId(), exportFormat);

			return exportedFile;
		} catch (SerializationException serializationException) {
			throw new ExportException(serializationException,
					"Unable to serialize IG Document with ID " + igDocument.getId());
		}
	}

	@Override
	public ExportFilterDecision getExportFilterDecision(Ig ig, ExportConfiguration config) throws CoConstraintGroupNotFoundException {
		ExportFilterDecision decision = new ExportFilterDecision();

		for (Link l : ig.getConformanceProfileRegistry().getChildren()) {
			decision.getConformanceProfileFilterMap().put(l.getId(), true);
		}
		for (Link l : ig.getSegmentRegistry().getChildren()) {
			decision.getSegmentFilterMap().put(l.getId(), false);
		}
		for (Link l : ig.getDatatypeRegistry().getChildren()) {
			decision.getDatatypesFilterMap().put(l.getId(), false);
		}
		for (Link l : ig.getValueSetRegistry().getChildren()) {
			decision.getValueSetFilterMap().put(l.getId(), false);
		}
		processConformanceProfiles(ig, decision, config);
		return decision;
	}

	private void processConformanceProfiles(Ig ig, ExportFilterDecision decision, ExportConfiguration config) throws CoConstraintGroupNotFoundException {
		Set<String> segmentIds = new HashSet<String>();
		Set<String> datatypesIds = new HashSet<String>();
		List<ConformanceProfile> profiles = conformanceProfileService
				.findByIdIn(ig.getConformanceProfileRegistry().getLinksAsIds());
		for (ConformanceProfile profile : profiles) {
			segmentIds.addAll(processConformanceProfile(profile, decision, config));
		}
		List<Segment> BindedSegments = segmentService.findByIdIn(segmentIds);

		for (Segment s : BindedSegments) {
			datatypesIds.addAll(processSegment(s, decision, config));
		}
		List<Datatype> bindedDatatypes = datatypeService.findByIdIn(datatypesIds);

		for (Datatype dt : bindedDatatypes) {
			HashMap<String, Boolean> processed = new HashMap<String, Boolean>();
			datatypesIds.addAll(processDatatype(dt, decision, config, new HashMap<String, Boolean>(), processed));
		}
	}

	private Set<String> processSegment(Segment s, ExportFilterDecision decision, ExportConfiguration config) {
		Set<String> datatypesIds = new HashSet<String>();
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();
		for (Field child : s.getChildren()) {
			if (child.getRef() != null && child.getRef().getId() != null) {
				if (child.getUsage() != null && config.getSegmentExportConfiguration().getFieldsExport().isBinded(child.getUsage())) {
					datatypesIds.add(child.getRef().getId());
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}
			}
		}
		this.processBinding(s.getBinding(), bindedPaths, decision);
		return datatypesIds;
	}

	private Set<String> processDatatype(Datatype dt, ExportFilterDecision decision, ExportConfiguration config,
			HashMap<String, Boolean> bindedPaths, HashMap<String, Boolean> processed) {
		Set<String> datatypesIds = new HashSet<String>();
		if (!processed.containsKey(dt.getId())) {
			if (dt instanceof ComplexDatatype) {
				datatypesIds.addAll(processComplexDatatype((ComplexDatatype) dt, decision, config));
			}
		}
		processed.put(dt.getId(), true);
		return datatypesIds;
	}

	private Set<String> processComplexDatatype(ComplexDatatype dt, ExportFilterDecision decision,
			ExportConfiguration config) {
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();
		Set<String> datatypesIds = new HashSet<String>();
		for (Component child : dt.getComponents()) {
			if (child.getRef() != null && child.getRef().getId() != null) {
				if (child.getUsage() != null && config.getDatatypeExportConfiguration().getComponentExport().isBinded(child.getUsage())) {
					datatypesIds.add(child.getRef().getId());
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}
			}
		}
		this.processBinding(dt.getBinding(), bindedPaths, decision);
		return datatypesIds;
	}

	private Set<String> processConformanceProfile(ConformanceProfile cp, ExportFilterDecision decision,
			ExportConfiguration config) throws CoConstraintGroupNotFoundException {
		// TODO Auto-generated method stub
		Set<String> segmentsIds = new HashSet<String>();
		HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();

		for (MsgStructElement segOrgroup : cp.getChildren()) {
			if (segOrgroup instanceof SegmentRef) {
				SegmentRef ref = (SegmentRef) segOrgroup;
				if (ref.getRef() != null && ref.getRef().getId() != null) {
					if (ref.getUsage() != null && config.getConformamceProfileExportConfiguration().getSegmentORGroupsMessageExport().isBinded(ref.getUsage())) {
						segmentsIds.add(ref.getRef().getId());
						decision.getSegmentFilterMap().put(ref.getRef().getId(), true);
						bindedPaths.put(ref.getId(), true);
					}
				}
			} else {
				processSegmentorGroup(segOrgroup, decision, config, bindedPaths, segOrgroup.getId(), segmentsIds);
			}
		}
		this.processBinding(cp.getBinding(), bindedPaths, decision);
		if(cp.getCoConstraintsBindings() !=null) {
		  this.processCoConstraintsBinding(decision, config, cp.getCoConstraintsBindings());
		}
		return segmentsIds;
	}

	private void processSegmentorGroup(MsgStructElement segOrgroup, ExportFilterDecision decision,
			ExportConfiguration config, HashMap<String, Boolean> bindedPaths, String path, Set<String> ids) {
		if (segOrgroup instanceof SegmentRef) {
			SegmentRef ref = (SegmentRef) segOrgroup;
			if (ref.getRef() != null && ref.getRef().getId() != null) {
				if (ref.getUsage() != null && config.getConformamceProfileExportConfiguration().getSegmentORGroupsMessageExport().isBinded(ref.getUsage())) {
					ids.add(ref.getRef().getId());
					bindedPaths.put(path, true);
					decision.getSegmentFilterMap().put(ref.getRef().getId(), true);
				}
			}
		} else if (segOrgroup instanceof Group) {
			Group g = (Group) segOrgroup;
			for (MsgStructElement child : g.getChildren()) {
				processSegmentorGroup(child, decision, config, bindedPaths, path, ids);
			}
		}
	}

	public void processBinding(ResourceBinding binding, HashMap<String, Boolean> bindedPaths,
			ExportFilterDecision decision) {
		if (binding.getChildren() != null) {
			for (StructureElementBinding child : binding.getChildren()) {
				if (child.getValuesetBindings() != null) {
					for (ValuesetBinding vs : child.getValuesetBindings()) {
						
						if (vs.getValueSets() != null && bindedPaths.containsKey(child.getElementId())) {
							for (String s : vs.getValueSets()) {
								decision.getValueSetFilterMap().put(s, true);
							}
						}

					}
				}
				if (child.getChildren() != null && !child.getChildren().isEmpty()) {
					processStructureElementBinding(child, bindedPaths, decision, child.getElementId());
				}
			}
		}
	}

	private void processStructureElementBinding(StructureElementBinding structureElementBinding,
			HashMap<String, Boolean> bindedPaths, ExportFilterDecision decision, String path) {
		for (StructureElementBinding child : structureElementBinding.getChildren()) {
			if (child.getValuesetBindings() != null) {
				for (ValuesetBinding vs : child.getValuesetBindings()) {
					if (vs.getValueSets() != null && bindedPaths.containsKey(path)) {
						for (String s : vs.getValueSets()) {
							decision.getValueSetFilterMap().put(s, true);
						}
					}
				}
			}
			if (child.getChildren() != null && !child.getChildren().isEmpty()) {
				processStructureElementBinding(child, bindedPaths, decision, path);
			}
		}
	}

	@Override
	public ExportedFile exportIgDocumentToWord(String username, String id, ExportFilterDecision decision, String configId )
			throws Exception {
		Ig igDocument = igService.findById(id);
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (igDocument != null) {
			ExportedFile htmlFile = this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.WORD, decision, exportConfiguration);
			ExportedFile wordFile = WordUtil.convertHtmlToWord(htmlFile, igDocument.getMetadata(),
					igDocument.getUpdateDate(),
					igDocument.getDomainInfo() != null ? igDocument.getDomainInfo().getVersion() : null);
			return wordFile;
		}
		return null;
	}

	// Co Constraints


	  public void processCoConstraintsBinding(ExportFilterDecision decision, ExportConfiguration config,
	      List<CoConstraintBinding> coConstraintsBindings) throws CoConstraintGroupNotFoundException {
	    // TODO Auto-generated method stub
	    for(CoConstraintBinding binding:coConstraintsBindings) {
	      if(binding.getBindings()!=null) {
	        for(CoConstraintBindingSegment segBinding: binding.getBindings()) {
	          decision.getSegmentFilterMap().put(segBinding.getFlavorId(), true);
	          for( CoConstraintTableConditionalBinding CoConstraintTableConditionalBinding : segBinding.getTables()) {
	            if(CoConstraintTableConditionalBinding.getValue() !=null) {
	              this.processCoConstraintTable(CoConstraintTableConditionalBinding.getValue(), decision, config);
	            }
	          }
	        }
	      }
	    }     
	  }

	  /**
	   * @param parent
	   * @param value
	   * @return
	   * @throws CoConstraintGroupNotFoundException 
	   */
	  private void processCoConstraintTable(CoConstraintTable value, ExportFilterDecision decision, ExportConfiguration config) throws CoConstraintGroupNotFoundException {
	    // TODO Auto-generated method stub
	    if(value.getGroups() !=null) {
	      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {

	        if(groupBinding instanceof CoConstraintGroupBindingContained) {
	          CoConstraintGroupBindingContained  coConstraintGroupBindingContained = (CoConstraintGroupBindingContained)(groupBinding);
	          if( coConstraintGroupBindingContained.getCoConstraints() !=null) {
	            for(CoConstraint cc: coConstraintGroupBindingContained.getCoConstraints() ) {
	              processCoConstraint(cc, decision,  config);
	            }
	          }
	          }else if(groupBinding instanceof CoConstraintGroupBindingRef) {
	            CoConstraintGroupBindingRef ref = (CoConstraintGroupBindingRef)groupBinding;
	            CoConstraintGroup group = coConstraintService.findById(ref.getRefId());
	            if(group.getCoConstraints() !=null) {
	              for(CoConstraint cc: group.getCoConstraints() ) {
	                processCoConstraint(cc, decision,  config);  
	              }
	            }
	          }
	        }
	      }
	    if(value.getCoConstraints() !=null) {
	      for(CoConstraint cc: value.getCoConstraints() ) {
	        processCoConstraint(cc, decision,  config);  
	      } 
	    }
	  }
	  
	  
	  /**
	   * @param cc
	   * @param decision
	   * @param config
	   */
	  private void processCoConstraint(CoConstraint cc, ExportFilterDecision decision,
	      ExportConfiguration config) {
	    // TODO Auto-generated method stub
	    if(cc.getCells() !=null && cc.getCells().values() !=null) {
	      for(CoConstraintCell cell: cc.getCells().values()) {
	        processCoConstraintCell(cell, decision, config);
	      }
	    }    
	  }

	  private void processCoConstraintCell( CoConstraintCell cell, ExportFilterDecision decision, ExportConfiguration config) {
	    // TODO Auto-generated method stub
	    if(cell instanceof ValueSetCell) {
	      ValueSetCell vsCell= (ValueSetCell)cell;
	      if(vsCell.getBindings() !=null) {
	        for(ValuesetBinding vsb : vsCell.getBindings()) {
	          if(vsb.getValueSets() !=null ) {
	            for(String vs : vsb.getValueSets()) {
	              decision.getValueSetFilterMap().put(vs, true);
	            }
	          }
	        }
	      }
	    }else if(cell instanceof DatatypeCell ) {
	      DatatypeCell dtCell= (DatatypeCell)cell; 
	      decision.getDatatypesFilterMap().put(dtCell.getDatatypeId(), true);
	    }else if(cell instanceof VariesCell) {
	      VariesCell vrCell= (VariesCell)cell;
	      if(vrCell.getCellValue() !=null) {
	        processCoConstraintCell(vrCell.getCellValue(), decision, config);
	      }
	    }
	  }

}
