package gov.nist.hit.hl7.igamt.export.service.impl;

import java.io.InputStream;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import org.apache.commons.lang3.SerializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaAction;
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
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
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
import gov.nist.hit.hl7.igamt.export.util.FileWritter;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
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
	DeltaService deltaService;

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
	public ExportedFile exportIgDocumentToHtml(String username,IgDataModel igDataModel, ExportFilterDecision decision, String configId)
			throws Exception {
		Ig igDocument = igDataModel.getModel();
		System.out.println("in html export");
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (igDocument != null) {
			ExportedFile htmlFile = this.serializeIgDocumentToHtml(username, igDataModel, ExportFormat.HTML, decision, exportConfiguration);
			return htmlFile;
		}
		return null;
	}
	@Override
	public String exportIgDocumentToDiffXml( String igDocumentId)
			throws Exception {
		Ig igDocument = igService.findById(igDocumentId);
		if (igDocument != null) {
			String htmlFile = this.serializeIgDocumentToDiffXml(igDocument);
			return htmlFile;
		}
		return null;
	}

	@Override
	public String exportIgDocumentToDiffXml(Ig ig)
			throws Exception {
		if (ig != null) {
			String htmlFile = this.serializeIgDocumentToDiffXml(ig);
			return htmlFile;
		}
		return null;
	}

	@Override
	public String serializeIgDocumentToDiffXml( Ig igDocument) throws Exception {
		try {

			ExportConfiguration exportConfiguration = ExportConfiguration.getBasicExportConfiguration(true, ExportType.IGDOCUMENT);
			exportConfiguration.getIgGeneralConfiguration().setNotMessageInfrastructure(true);
			exportConfiguration.setDeltaMode(false);
			exportConfiguration.setReasonForChange(true);
			exportConfiguration.getSegmentExportConfiguration().setDeltaMode(false);
			exportConfiguration.getSegmentExportConfiguration().setReasonForChange(true);

			exportConfiguration.getValueSetExportConfiguration().setDeltaMode(false);
			exportConfiguration.getValueSetExportConfiguration().setReasonForChange(true);

			exportConfiguration.getDatatypeExportConfiguration().setDeltaMode(false);
			exportConfiguration.getDatatypeExportConfiguration().setReasonForChange(true);

			exportConfiguration.getConformamceProfileExportConfiguration().setDeltaMode(false);
			exportConfiguration.getConformamceProfileExportConfiguration().setReasonForChange(true);

			IgDataModel igDataModel = igService.generateDataModel(igDocument);
			String xmlContent =
					igDataModelSerializationService.serializeDocument(igDataModel, exportConfiguration,null).toXML();
			System.out.println("XML_EXPORT : " + xmlContent);

			return xmlContent;

		} catch (SerializationException serializationException) {
			throw new ExportException(serializationException,
					"Unable to serialize IG Document with ID " + igDocument.getId());
		}
	}

	@Override
	public ExportedFile serializeIgDocumentToHtml(String username,IgDataModel igDataModel, ExportFormat exportFormat,
			ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception {
		Ig igDocument = igDataModel.getModel();
		try {
			ExportFontConfiguration exportFontConfiguration =
					exportFontConfigurationService.getExportFontConfiguration(username);
			DocumentStructureDataModel documentStructureDataModel = new DocumentStructureDataModel();
			String xmlContent =
					igDataModelSerializationService.serializeDocument(igDataModel, exportConfiguration,decision).toXML();
					      FileWritter fw = new FileWritter();
					      fw.createAndWriteToFile(xmlContent);

			// TODO add app infoservice to get app version
			ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
					igDocument.getName(), igDocument.getMetadata().getCoverPicture(), exportConfiguration,
					exportConfiguration.getExportFontConfiguration(), "2.0_beta",igDocument.getType());
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
	public ExportFilterDecision getExportFilterDecision(DocumentStructure documentStructure, ExportConfiguration config) throws EntityNotFound, IGDeltaException {
		ExportFilterDecision decision = new ExportFilterDecision();
		if(documentStructure instanceof Ig) {
			Ig ig = (Ig) documentStructure;
			for (Link l : ig.getProfileComponentRegistry().getChildren()) {
				decision.getProfileComponentFilterMap().put(l.getId(), true);
			}
		for (Link l : ig.getConformanceProfileRegistry().getChildren()) {
			decision.getConformanceProfileFilterMap().put(l.getId(), true);
		}
	    for (Link l : ig.getCompositeProfileRegistry().getChildren()) {
            decision.getCompositeProfileFilterMap().put(l.getId(), true);
        }
	    for (Link l : ig.getProfileComponentRegistry().getChildren()) {
            decision.getProfileComponentFilterMap().put(l.getId(), true);
        }
		for (Link l : ig.getSegmentRegistry().getChildren()) {
			decision.getSegmentFilterMap().put(l.getId(), false);
		}
		for (Link l : ig.getDatatypeRegistry().getChildren()) {
			if(l.getId()==null) {
//				System.out.println("NULL HERE :" + l.get);
			}
			decision.getDatatypesFilterMap().put(l.getId(), false);
		}
		for (Link l : ig.getValueSetRegistry().getChildren()) {
			decision.getValueSetFilterMap().put(l.getId(), false);
		}
		if(documentStructure.getOrigin() !=null && config.getType().equals(ExportType.DIFFERENTIAL)) {
		  calculateDeltaAndDecide(ig, decision);
		} else {
		  processConformanceProfiles(ig, decision, config); 
		  
		  // TODO: Process Profile Components and composite
		}
		return decision;
		} else if(documentStructure instanceof DatatypeLibrary) {
			DatatypeLibrary datatypeLibrary = (DatatypeLibrary) documentStructure;
			for (Link l : datatypeLibrary.getDatatypeRegistry().getChildren()) {
				Datatype dt = datatypeService.findById(l.getId());
//				System.out.println("link id :" + l.getId() + " link parent id : " + l.getParentId() + " datatype parent id : " + dt.getParentId());
				if(dt !=null) {
				if(DatatypeLibrary.isLibFlavor(dt, datatypeLibrary.getId())) {
					System.out.println("found one");
				decision.getDatatypesFilterMap().put(l.getId(), true);
				}
			} else {
				decision.getDatatypesFilterMap().put(l.getId(), false);
			}
			}
			return decision;

		}
		return null;
	}

	/**
   * @param ig
	 * @throws IGDeltaException 
   */
  private void calculateDeltaAndDecide(Ig ig, ExportFilterDecision decision ) throws IGDeltaException {
    // TODO Auto-generated method stub
    Ig origin = igService.findById(ig.getOrigin());
    decision.setDelta(true);
    if(origin != null) {
      IGDisplayInfo info =  this.deltaService.delta(ig, origin);
      for(DisplayElement elm: info.getMessages()) {
        if(elm.getDelta() ==null ||elm.getDelta().equals(DeltaAction.UNCHANGED) ){
          decision.getConformanceProfileFilterMap().put(elm.getId(), false);
        }else {
          if(elm.getDelta().equals(DeltaAction.ADDED)) {
            decision.getAdded().put(elm.getId(), true);     
          }
          if(elm.getDelta().equals(DeltaAction.UPDATED)) {
            decision.getChanged().put(elm.getId(), true);
          }
          decision.getConformanceProfileFilterMap().put(elm.getId(), true);
        }
      }
      
      for(DisplayElement elm: info.getDatatypes()) {
        if(elm.getDelta() ==null ||elm.getDelta().equals(DeltaAction.UNCHANGED) ){
          decision.getDatatypesFilterMap().put(elm.getId(), false);
        }else {
          if(elm.getDelta().equals(DeltaAction.ADDED)) {
            decision.getAdded().put(elm.getId(), true);     
          }
          if(elm.getDelta().equals(DeltaAction.UPDATED)) {
            decision.getChanged().put(elm.getId(), true);
          }
          if(elm.getId()==null) {
        	  System.out.println("Look here for null1 : " + elm.getFixedName());
          }
          decision.getDatatypesFilterMap().put(elm.getId(), true);
        }
      }
      for(DisplayElement elm: info.getSegments()) {
        if(elm.getDelta() ==null ||elm.getDelta().equals(DeltaAction.UNCHANGED) ){
          decision.getSegmentFilterMap().put(elm.getId(), false);
        }else {
          if(elm.getDelta().equals(DeltaAction.ADDED)) {
            decision.getAdded().put(elm.getId(), true);     
          }
          if(elm.getDelta().equals(DeltaAction.UPDATED)) {
            decision.getChanged().put(elm.getId(), true);
          }
          decision.getSegmentFilterMap().put(elm.getId(), true);
          
        }
      }
      for(DisplayElement elm: info.getValueSets()) {
        if(elm.getDelta() ==null ||elm.getDelta().equals(DeltaAction.UNCHANGED) ){
          decision.getValueSetFilterMap().put(elm.getId(), false);
        }else {
          if(elm.getDelta().equals(DeltaAction.ADDED)) {
            decision.getAdded().put(elm.getId(), true);     
          }
          if(elm.getDelta().equals(DeltaAction.UPDATED)) {
            decision.getChanged().put(elm.getId(), true);
          }
          decision.getValueSetFilterMap().put(elm.getId(), true);
        }
      }
    }
  }

  private void processConformanceProfiles(Ig ig, ExportFilterDecision decision, ExportConfiguration config) throws EntityNotFound {
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
					if(child.getRef().getId()==null) {
			        	  System.out.println("Look here for null2 : " + child.getName());
			          }
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}
			}
		}
		if(s.getDynamicMappingInfo() != null) {
			if(s.getDynamicMappingInfo().getItems() != null) {
				for (DynamicMappingItem item: s.getDynamicMappingInfo().getItems()) {
					if(item.getDatatypeId()!= null) {
						decision.getDatatypesFilterMap().put(item.getDatatypeId(), true);

						datatypesIds.add(item.getDatatypeId());
					}
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
					if(child.getRef().getId()==null) {
			        	  System.out.println("Look here for null3 : " + child.getName());
			          }
					decision.getDatatypesFilterMap().put(child.getRef().getId(), true);
					bindedPaths.put(child.getId(), true);
				}
			}
		}
		this.processBinding(dt.getBinding(), bindedPaths, decision);
		return datatypesIds;
	}

	private Set<String> processConformanceProfile(ConformanceProfile cp, ExportFilterDecision decision,
			ExportConfiguration config) throws EntityNotFound {
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
	public ExportedFile exportIgDocumentToWord(String username, IgDataModel igDatamodel, ExportFilterDecision decision, String configId )
			throws Exception {
		Ig igDocument = igDatamodel.getModel();
		ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
		if (igDocument != null) {
			ExportedFile htmlFile = this.serializeIgDocumentToHtml(username, igDatamodel, ExportFormat.WORD, decision, exportConfiguration);
			ExportedFile wordFile = WordUtil.convertHtmlToWord(htmlFile, igDocument.getMetadata(),
					igDocument.getUpdateDate(),
					igDocument.getDomainInfo() != null ? igDocument.getDomainInfo().getVersion() : null);
			return wordFile;
		}
		return null;
	}

	// Co Constraints


	  public void processCoConstraintsBinding(ExportFilterDecision decision, ExportConfiguration config,
	      List<CoConstraintBinding> coConstraintsBindings) throws EntityNotFound {
	    // TODO Auto-generated method stub
	    for(CoConstraintBinding binding:coConstraintsBindings) {
	      if(binding.getBindings()!=null) {
	        for(CoConstraintBindingSegment segBinding: binding.getBindings()) {
	        	// TODO Do we want to force export of whatever flavor is used in CP at CoConstraint binding location?
//	          decision.getSegmentFilterMap().put(segBinding.getFlavorId(), true);
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
	   * @param value
	   * @return
	   * @throws EntityNotFound 
	   */
	  private void processCoConstraintTable(CoConstraintTable value, ExportFilterDecision decision, ExportConfiguration config) throws EntityNotFound {
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
	      if(dtCell.getDatatypeId()!=null) {
		      decision.getDatatypesFilterMap().put(dtCell.getDatatypeId(), true);
          }
	    }else if(cell instanceof VariesCell) {
	      VariesCell vrCell= (VariesCell)cell;
	      if(vrCell.getCellValue() !=null) {
	        processCoConstraintCell(vrCell.getCellValue(), decision, config);
	      }
	    }
	  }

	


}
