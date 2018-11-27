package gov.nist.hit.hl7.igamt.web.export.model;



import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;

/**
 * @author ynb4
 *
 */

@org.springframework.stereotype.Component
public class MyExportObject  {
	
	
	
	private 	Map<String,String> datatypesXMLOneByOne;
	private 	Map<String,String> datatypesXMLByRoot;
	private 	Map<String,String> datatypeNamesMap;
	private 	Map<Datatype,String> mapDatatypeToXML;
	private List<String> allDomainCompatibilityVersions;
	Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = new HashMap<>();
	Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = new HashMap<>();
	Map<String,Datatype> datatypesMap = new HashMap<>();
	String allDatatypesXml;
	
	

	
	public Map<String, String> getDatatypeNamesMap() {
		return datatypeNamesMap;
	}
	public void setDatatypeNamesMap(Map<String, String> datatypeNamesMap) {
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
