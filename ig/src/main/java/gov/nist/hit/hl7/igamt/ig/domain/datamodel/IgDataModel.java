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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.GeneratedResourceMetadata;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

/**
 * @author jungyubw
 *
 */
public class IgDataModel extends DocumentStructureDataModel implements Serializable{
	
	private Ig model;
	private Set<DatatypeDataModel> datatypes = new HashSet<DatatypeDataModel>();
	private Set<SegmentDataModel> segments = new HashSet<SegmentDataModel>();
	private Set<ConformanceProfileDataModel> conformanceProfiles = new HashSet<ConformanceProfileDataModel>();
    private Set<ProfileComponentDataModel> profileComponents = new HashSet<ProfileComponentDataModel>();
    private Set<CompositeProfileDataModel> compositeProfile = new HashSet<CompositeProfileDataModel>();
	private Set<ValuesetDataModel> valuesets = new HashSet<ValuesetDataModel>();
	private Map<SegmentDataModel, GeneratedResourceMetadata> allFlavoredSegmentDataModelsMap = new HashMap<>();
	private Map<DatatypeDataModel, GeneratedResourceMetadata> allFlavoredDatatypeDataModelsMap = new HashMap<>();
	private Set<String> dataExtensionTokens = new HashSet<>();

	public Ig getModel() {
		return model;
	}

	public Set<ConformanceProfileDataModel> getConformanceProfiles() {
		return conformanceProfiles;
	}

	public void setConformanceProfiles(Set<ConformanceProfileDataModel> conformanceProfiles) {
		this.conformanceProfiles = conformanceProfiles;
	}

	public Set<ValuesetDataModel> getValuesets() {
		return valuesets;
	}

	public void setDatatypes(Set<DatatypeDataModel> datatypes) {
		this.datatypes = datatypes;
	}

	public void setModel(Ig model) {
		this.model = model;
	}

	public Set<DatatypeDataModel> getDatatypes() {
		return datatypes;
	}

	public void setValuesets(Set<ValuesetDataModel> valuesets) {
		this.valuesets = valuesets;
	}

	public Set<SegmentDataModel> getSegments() {
		return segments;
	}

	public void setSegments(Set<SegmentDataModel> segments) {
		this.segments = segments;
	}

	public DatatypeDataModel findDatatype(String id) {
		for (DatatypeDataModel dtModel : this.datatypes) {
			if (dtModel.getModel().getId().equals(id))
				return dtModel;
		}
		if(this.allFlavoredDatatypeDataModelsMap != null) {
			return this.allFlavoredDatatypeDataModelsMap.keySet().stream()
			                                           .filter((datatype) -> datatype.getModel().getId().equals(id))
			                                           .findFirst()
			                                           .orElse(null);
		}
		return null;
	}

	public SegmentDataModel findSegment(String id) {
		for (SegmentDataModel segModel : this.segments) {
			if (segModel.getModel().getId().equals(id))
				return segModel;
		}
		if(this.allFlavoredSegmentDataModelsMap != null) {
			return this.allFlavoredSegmentDataModelsMap.keySet().stream()
			                                    .filter((segment) -> segment.getModel().getId().equals(id))
												.findFirst()
												.orElse(null);
		}
		return null;
	}

	public ValuesetDataModel findValueset(String id) {
		for (ValuesetDataModel vsModel : this.valuesets) {
			if (vsModel.getModel().getId().equals(id))
				return vsModel;
		}
		return null;
	}
	
	public ValuesetDataModel findValuesetByBId(String bId) {
		for (ValuesetDataModel vsModel : this.valuesets) {
			if (vsModel.getModel().getBindingIdentifier().contentEquals(bId))
				return vsModel;
		}
		return null;
	}

	public DatatypeDataModel findDatatype(String dtName, String version) {
		for (DatatypeDataModel dtModel : this.datatypes) {
			if (dtModel.getModel().getDomainInfo().getVersion().equals(version) && dtModel.getModel().getName().equals(dtName))
				return dtModel;
		}
		return null;
	}

	public Set<ProfileComponentDataModel> getProfileComponents() {
		return profileComponents;
	}

	public void setProfileComponents(Set<ProfileComponentDataModel> profileComponents) {
		this.profileComponents = profileComponents;
	}

	public Set<CompositeProfileDataModel> getCompositeProfile() {
		return compositeProfile;
	}

	public void setCompositeProfile(Set<CompositeProfileDataModel> compositeProfile) {
		this.compositeProfile = compositeProfile;
	}

	public Map<SegmentDataModel, GeneratedResourceMetadata> getAllFlavoredSegmentDataModelsMap() {
		return allFlavoredSegmentDataModelsMap;
	}

	public void setAllFlavoredSegmentDataModelsMap(
			Map<SegmentDataModel, GeneratedResourceMetadata> allFlavoredSegmentDataModelsMap) {
		this.allFlavoredSegmentDataModelsMap = allFlavoredSegmentDataModelsMap;
	}

	public Map<DatatypeDataModel, GeneratedResourceMetadata> getAllFlavoredDatatypeDataModelsMap() {
		return allFlavoredDatatypeDataModelsMap;
	}

	public void setAllFlavoredDatatypeDataModelsMap(
			Map<DatatypeDataModel, GeneratedResourceMetadata> allFlavoredDatatypeDataModelsMap) {
		this.allFlavoredDatatypeDataModelsMap = allFlavoredDatatypeDataModelsMap;
	}

	public Set<String> getDataExtensionTokens() {
		return dataExtensionTokens;
	}

	public void setDataExtensionTokens(Set<String> dataExtensionTokens) {
		this.dataExtensionTokens = dataExtensionTokens;
	}
}
