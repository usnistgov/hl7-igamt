package gov.nist.hit.hl7.igamt.web.export;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

/**
 * @author ynb4
 *
 */
public class MyExportObject {
	
	private 	Map<String,String> datatypesXMLOneByOne;
	private 	Map<String,String> datatypesXMLByRoot;
	private 	Map<Ref,String> datatypeNamesMap;
	private 	Map<Datatype,String> mapDatatypeToXML;
	private List<String> allDomainCompatibilityVersions;
	Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = new HashMap<>();
	Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = new HashMap<>();
	String allDatatypesXml;
	
	

	
	public Map<Ref, String> getDatatypeNamesMap() {
		return datatypeNamesMap;
	}
	public void setDatatypeNamesMap(Map<Ref, String> datatypeNamesMap) {
		this.datatypeNamesMap = datatypeNamesMap;
	}
	public String getAllDatatypesXml() {
		return allDatatypesXml;
	}
	public void setAllDatatypesXml(String allDatatypesXml) {
		this.allDatatypesXml = allDatatypesXml;
	}
	public Map<Datatype, String> getMapDatatypeToXML() {
		return mapDatatypeToXML;
	}
	public void setMapDatatypeToXML(Map<Datatype, String> mapDatatypeToXM) {
		this.mapDatatypeToXML = mapDatatypeToXM;
	}
	public Map<String, Map<String, List<Datatype>>> getDatatypesbyVersionThenName() {
		return datatypesbyVersionThenName;
	}
	public void setDatatypesbyVersionThenName(Map<String, Map<String, List<Datatype>>> datatypesbyVersionThenName) {
		this.datatypesbyVersionThenName = datatypesbyVersionThenName;
	}
	public Map<String, Map<Set<String>, List<Datatype>>> getDatatypesbyNameThenVersion() {
		return datatypesbyNameThenVersion;
	}
	public void setDatatypesbyNameThenVersion(Map<String, Map<Set<String>, List<Datatype>>> datatypesbyNameThenVersion) {
		this.datatypesbyNameThenVersion = datatypesbyNameThenVersion;
	}
	public List<String> getAllDomainCompatibilityVersions() {
		return allDomainCompatibilityVersions;
	}
	public void setAllDomainCompatibilityVersions(List<String> allDomainCompatibilityVersions) {
		this.allDomainCompatibilityVersions = allDomainCompatibilityVersions;
	}
	public Map<String, String> getDatatypesXMLOneByOne() {
		return datatypesXMLOneByOne;
	}
	public void setDatatypesXMLOneByOne(Map<String, String> datatypesXMLOneByOne) {
		this.datatypesXMLOneByOne = datatypesXMLOneByOne;
	}
	public Map<String, String> getDatatypesXMLByRoot() {
		return datatypesXMLByRoot;
	}
	public void setDatatypesXMLByRoot(Map<String, String> datatypesXMLByRoot) {
		this.datatypesXMLByRoot = datatypesXMLByRoot;
	}
	
	

}
