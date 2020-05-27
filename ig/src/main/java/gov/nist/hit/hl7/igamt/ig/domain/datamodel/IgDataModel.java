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
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
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
	private Set<ValuesetDataModel> valuesets = new HashSet<ValuesetDataModel>();

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

	/**
	 * @param id
	 * @return
	 */
	public DatatypeDataModel findDatatype(String id) {
		for (DatatypeDataModel dtModel : this.datatypes) {
			if (dtModel.getModel().getId().equals(id))
				return dtModel;
		}
		return null;
	}

	/**
	 * @param id
	 * @return
	 */
	public SegmentDataModel findSegment(String id) {
		for (SegmentDataModel segModel : this.segments) {
			if (segModel.getModel().getId().equals(id))
				return segModel;
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

	/**
	 * @param value
	 * @param version
	 * @return
	 */
	public DatatypeDataModel findDatatype(String dtName, String version) {
		for (DatatypeDataModel dtModel : this.datatypes) {
			if (dtModel.getModel().getDomainInfo().getVersion().equals(version) && dtModel.getModel().getName().equals(dtName))
				return dtModel;
		}
		return null;
	}

}
