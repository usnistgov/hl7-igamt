package gov.nist.hit.hl7.igamt.datatypeLibrary.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;

/**
 * @author youssef
 *
 */

public class DatatypeLibraryDataModel extends DocumentStructureDataModel implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private DatatypeLibrary model;

	private Set<DatatypeDataModel> datatypes = new HashSet<DatatypeDataModel>();


	public DatatypeLibrary getModel() {
		return model;
	}




	public void setModel(DatatypeLibrary model) {
		this.model = model;
	}




	public Set<DatatypeDataModel> getDatatypes() {
		return datatypes;
	}




	public void setDatatypes(Set<DatatypeDataModel> datatypes) {
		this.datatypes = datatypes;
	}




	public static long getSerialversionuid() {
		return serialVersionUID;
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
