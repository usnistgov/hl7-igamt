//package gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util;
//
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
//import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
//import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
//import gov.nist.hit.hl7.igamt.datatype.domain.Component;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
//
///**
// * @author ynb4
// *
// */
//public class WebExportObject {
//	
//	@Autowired
//	  private DatatypeService datatypeService;
//	
//	private 	Map<String,String> datatypesXMLOneByOne;
//	private 	Map<String,String> datatypesXMLByRoot;
//	private 	Map<Ref,String> datatypeNamesMap;
//	private 	Map<Datatype,String> mapDatatypeToXML;
//	private List<String> allDomainCompatibilityVersions;
//	Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = new HashMap<>();
//	Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = new HashMap<>();
//	Map<String,Datatype> datatypesMap = new HashMap<>();
//	String allDatatypesXml;
//	
//	
//
//	
//	public Map<Ref, String> getDatatypeNamesMap() {
//		return datatypeNamesMap;
//	}
//	public void setDatatypeNamesMap(Map<Ref, String> datatypeNamesMap) {
//		this.datatypeNamesMap = datatypeNamesMap;
//	}
//	public String getAllDatatypesXml() {
//		return allDatatypesXml;
//	}
//	public void setAllDatatypesXml(String allDatatypesXml) {
//		this.allDatatypesXml = allDatatypesXml;
//	}
//	public Map<Datatype, String> getMapDatatypeToXML() {
//		return mapDatatypeToXML;
//	}
//	public void setMapDatatypeToXML(Map<Datatype, String> mapDatatypeToXM) {
//		this.mapDatatypeToXML = mapDatatypeToXM;
//	}
//	public Map<String, Map<String, List<Datatype>>> getDatatypesbyVersionThenName() {
//		return datatypesbyVersionThenName;
//	}
//	public void setDatatypesbyVersionThenName(Map<String, Map<String, List<Datatype>>> datatypesbyVersionThenName) {
//		this.datatypesbyVersionThenName = datatypesbyVersionThenName;
//	}
//	public Map<String, Map<Set<String>, List<Datatype>>> getDatatypesbyNameThenVersion() {
//		return datatypesbyNameThenVersion;
//	}
//	public void setDatatypesbyNameThenVersion(Map<String, Map<Set<String>, List<Datatype>>> datatypesbyNameThenVersion) {
//		this.datatypesbyNameThenVersion = datatypesbyNameThenVersion;
//	}
//	public List<String> getAllDomainCompatibilityVersions() {
//		return allDomainCompatibilityVersions;
//	}
//	public void setAllDomainCompatibilityVersions(List<String> allDomainCompatibilityVersions) {
//		this.allDomainCompatibilityVersions = allDomainCompatibilityVersions;
//	}
//	public Map<String, String> getDatatypesXMLOneByOne() {
//		return datatypesXMLOneByOne;
//	}
//	public void setDatatypesXMLOneByOne(Map<String, String> datatypesXMLOneByOne) {
//		this.datatypesXMLOneByOne = datatypesXMLOneByOne;
//	}
//	public Map<String, String> getDatatypesXMLByRoot() {
//		return datatypesXMLByRoot;
//	}
//	public void setDatatypesXMLByRoot(Map<String, String> datatypesXMLByRoot) {
//		this.datatypesXMLByRoot = datatypesXMLByRoot;
//	}
//	
//	public void populateMap(Map<String, Datatype> datatypesMap){
//		WebExportObject webExportObject = new WebExportObject();
//		String allDatatypesXml ;
//		Map<Ref,String> datatypeNamesMap = new HashMap<>();
//		Map<String,String> datatypesXMLOneByOne = new HashMap<>();
//		Map<String,String> datatypesXMLbyRoot = new HashMap<>();
//		Map<Datatype,String> mapDatatypeToXML = new HashMap<>();
//		Map<String,List<Datatype>> datatypesbyRoot = new HashMap<>();
//		Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = new HashMap<>();
//		Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = new HashMap<>();
//		
//		List<String> listIDs = new ArrayList<String>();
//
//
//
//		List<String> versionSets = new ArrayList<String>();
//		Set<String> hs = new HashSet<>();
//		List<String> orderedVersionList = new ArrayList();
//		
//
//
//
//		for(Datatype datatype : datatypesMap.values()) {
//			listIDs.add(datatype.getId().getId());
//			
//		}
//
//		
//		for(Datatype datatype : datatypesMap.values()) {
////			System.out.println(datatypeService);
//			if(datatypesbyRoot.containsKey(datatype.getName())){
//				datatypesbyRoot.get(datatype.getName()).add(datatype);
//			}else {
//				List<Datatype> listDataype = new ArrayList<Datatype>();
//				listDataype.add(datatype);
//				datatypesbyRoot.put(datatype.getName(), listDataype);
////				System.out.println("Size ofdatatypesbyRoot" + datatypesbyRoot.size());
//			}
////			System.out.println(datatype.getName());
//			
//			hs.addAll(datatype.getDomainInfo().getCompatibilityVersion());
//			versionSets.addAll(datatype.getDomainInfo().getCompatibilityVersion());
//			List list = new ArrayList(hs);
//			Collections.sort(list);
//			datatypesMap.put(datatype.getId().getId(), datatype);
//			datatypeNamesMap.put(new Ref(datatype.getId().getId()), datatype.getName());
//			orderedVersionList = list;
//
//		}
//		
//		webExportObject.setDatatypeNamesMap(datatypeNamesMap);
//		
////		System.out.println("SIIIIIZE " +datatypesMap.size());
////		for(Ref key : datatypeNamesMap.keySet()) {
//////			
////			System.out.println(key.toString() + datatypeNamesMap.get(key));
////
////		}
//		
//		
//		webExportObject.setAllDomainCompatibilityVersions(orderedVersionList);
//
//
////		System.out.println("size before "+datatypeNamesMap.size());
//		for(String key : datatypesMap.keySet()) {
//			Datatype datatype = datatypesMap.get(key);
//			if(datatype instanceof ComplexDatatype) {
//				for(Component component : ((ComplexDatatype) datatype).getComponents()) {
//					if(component.getRef() != null && !datatypeNamesMap.containsKey(component.getRef())) {
//						Datatype datatype2 = datatypeService.findByKey(new CompositeKey(component.getRef().getId(),2));
//						datatypeNamesMap.put(component.getRef(), datatype2.getName());
//					}
//				}
//			}
//		}
////		System.out.println("size after "+datatypeNamesMap.size());
//
//		
//		int position = 0;
//		String Encoding = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
//		allDatatypesXml = Encoding + "<Datatypes>";
//		for(String key : datatypesMap.keySet()) {
//			Datatype datatype = datatypesMap.get(key);
//			if(!datatype.getName().equals("-")) {
//			SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,String.valueOf(position));
//			try {
//				String datatypeXmlWhitoutEncoding = serializableDatatype.serialize().toXML();
//				String datatypeXml = Encoding + datatypeXmlWhitoutEncoding;
//				position++;
//				allDatatypesXml = allDatatypesXml + datatypeXmlWhitoutEncoding;
//				datatypesXMLOneByOne.put(String.valueOf(position), datatypeXml);
//				mapDatatypeToXML.put(datatype, datatypeXml);
////				System.out.println("ASDASDASDASD" +datatypesXMLOneByOne.size());
//			} catch (ResourceSerializationException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			}
//		}
//		System.out.println("sizf of datatypesXMLOneByOne " + datatypesXMLOneByOne.size());
//		allDatatypesXml = allDatatypesXml + "</Datatypes>";
//
//		webExportObject.setAllDatatypesXml(allDatatypesXml);
////		System.out.println("ADASDASDASDASDAS" + allDatatypesXml);
//		webExportObject.setDatatypesXMLOneByOne(datatypesXMLOneByOne);
//		
//		String allRootDatatypeXML = "";
//		
//		for(String key : datatypesbyRoot.keySet()) {
//			 allRootDatatypeXML = "<Datatypes>";
////			System.out.println("valeur de 1 key"+datatypesbyRoot.get("CE").get(0).getName());
//			for(Datatype datatype : datatypesbyRoot.get(key)) {
////				System.out.println("valeur de la cle"+ key+ " est la chose suivante" +datatype.getName());
//
//			SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,String.valueOf(position));
//			try {
//				String datatypeXml = serializableDatatype.serialize().toXML();
//				allRootDatatypeXML = allRootDatatypeXML + datatypeXml;
//				position++;
//			} catch (ResourceSerializationException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			
//		}
//			allRootDatatypeXML = allRootDatatypeXML + "</Datatypes>";
////			System.out.println("XXXXXXXXXXXXXXXXMMMMMMMMMMMMLLLLLLLLLLLLLLLLL" + allRootDatatypeXML);
//			datatypesXMLbyRoot.put(key, allRootDatatypeXML);
//
//		}
//		
//		for(String version : orderedVersionList) {
//			for(Datatype datatype : datatypesMap.values()) {
//				if(!datatype.getExt().isEmpty()) {
//				if(datatype.getDomainInfo().getCompatibilityVersion().contains(version)) {
//					if(datatypesbyVersionThenName.containsKey(version)){
//						if(datatypesbyVersionThenName.get(version).containsKey(datatype.getName())) {
//							datatypesbyVersionThenName.get(version).get(datatype.getName()).add(datatype);
//						}else {
//							List<Datatype> listDataype = new ArrayList<Datatype>();
//							listDataype.add(datatype);
//							datatypesbyVersionThenName.get(version).put(datatype.getName(), listDataype);
//						}
//					}else {
//						List<Datatype> listDataype = new ArrayList<Datatype>();
//						listDataype.add(datatype);
//						Map<String,List<Datatype>> newmap = new HashMap<>();
//						newmap.put(datatype.getName(), listDataype);
//						datatypesbyVersionThenName.put(version, newmap);
//					}		
//				}
//
//			}
//			}
//
//		}
//		
//		
//		for(String name : datatypesbyRoot.keySet()) {
//			for(Datatype datatype : datatypesMap.values()) {
//				if(!datatype.getExt().isEmpty()) {
//				if(datatype.getName().equals(name) ) {
//				if(datatypesbyNameThenVersion.containsKey(name)) {
//					Set<String> versionSet = new HashSet<>();
//						if(datatypesbyNameThenVersion.get(name).keySet().contains(datatype.getDomainInfo().getCompatibilityVersion())) {
////						System.out.println("LES VERSIONS DANS LA VERSIONSET SONT" + versionSet.toString());
//								datatypesbyNameThenVersion.get(name).get(datatype.getDomainInfo().getCompatibilityVersion()).add(datatype);
//								
//						} else {
//							List<Datatype> listDataype = new ArrayList<Datatype>();
//							listDataype.add(datatype);
//							datatypesbyNameThenVersion.get(name).put(datatype.getDomainInfo().getCompatibilityVersion(), listDataype);					}	
//				} else { 
//					Map<Set<String>,List<Datatype>> newmap = new HashMap<>();
//					Set<String> versionSet = new HashSet<>();
//					List<Datatype> listDataype = new ArrayList<Datatype>();
//					listDataype.add(datatype);
//					newmap.put(datatype.getDomainInfo().getCompatibilityVersion(), listDataype);
////						System.out.println("LES VERSIONS DANS LE DEUSIEME IF DANS LA VERSIONSET SONT" + versionSet.toString());
//
////						newmap.put(versionSet, listDataype);
//						datatypesbyNameThenVersion.put(name, newmap);
//
//					}	
//				}
//			}
//			}
//			}
//			
//
//
//		
////		for(String name : datatypesbyNameThenVersion.keySet()) {
////			System.out.println("Pour le datatype " + name + " Il y'a  :" + datatypesbyNameThenVersion.size());
////			for(Set<String> versionSet : datatypesbyNameThenVersion.get(name).keySet()) {
////				System.out.println("Pour la versionSet  :" + versionSet.toString() + "Il y'a " + datatypesbyNameThenVersion.get(name).size());	
////			for(Datatype datatype : datatypesbyNameThenVersion.get(name).get(versionSet) ) {
////				System.out.println("Voici la liste des"+ datatypesbyNameThenVersion.get(name).get(versionSet).size()+ "Datatypes :" + datatype.getName() + datatype.getExt() );
////
////			}
////		}
////		}
//		
//		
//// Old code for building datatypesbyNameThenVersion		
////		for(String name : datatypesbyRoot.keySet()) {
////			for(Datatype datatype : datatypesMap.values()) {
////				if(datatype.getName().equals(name)) {
////				if(datatypesbyNameThenVersion.containsKey(name)) {
////					for(String version : datatype.getDomainInfo().getCompatibilityVersion()) {
////						if(datatypesbyNameThenVersion.get(name).containsKey(version)) {
////							datatypesbyNameThenVersion.get(name).get(version).add(datatype);
////						} else {
////							List<Datatype> listDataype = new ArrayList<Datatype>();
////							listDataype.add(datatype);
////							datatypesbyNameThenVersion.get(name).put(version, listDataype);					}	
////					}
////				
////				} else { 
////					Map<String,List<Datatype>> newmap = new HashMap<>();
////					for(String version : datatype.getDomainInfo().getCompatibilityVersion()) {
////						List<Datatype> listDataype = new ArrayList<Datatype>();
////						listDataype.add(datatype);
////						newmap.put(version, listDataype);
////					}
////					
////					
////					datatypesbyNameThenVersion.put(name, newmap);
////					
////				}
////			}
////			}
////			
////		}
//		
//
////		
////		for(String name : datatypesbyNameThenVersion.keySet()) {
////			System.out.println("Pour le datatype " + name + " Il y'a  :" + datatypesbyNameThenVersion.size());
////			for(String version : datatypesbyNameThenVersion.get(name).keySet()) {
////				System.out.println("Pour la version  :" + version + "Il y'a " + datatypesbyNameThenVersion.get(name).size());	
////			for(Datatype datatype : datatypesbyNameThenVersion.get(name).get(version) ) {
////				System.out.println("Voici la liste des"+ datatypesbyNameThenVersion.get(name).get(version).size()+ "Datatypes :" + datatype.getName() + datatype.getExt() );
////
////			}
////		}
////		}
//			
//			
//		for(String name : datatypesbyNameThenVersion.keySet()) {
//			for(Set<String> versionSet : datatypesbyNameThenVersion.get(name).keySet()) {
//				Collections.sort(datatypesbyNameThenVersion.get(name).get(versionSet), Comparator.comparing(Datatype::getExt));
//				for(Datatype datatype : datatypesbyNameThenVersion.get(name).get(versionSet)) {
////				System.out.println("Look Here : " + datatype.getName()+datatype.getExt());
//			}
//			}
//		}	
//		
//		for(String version : datatypesbyVersionThenName.keySet()) {
//			for(String name : datatypesbyVersionThenName.get(version).keySet()) {
//				Collections.sort(datatypesbyVersionThenName.get(version).get(name), Comparator.comparing(Datatype::getExt));
//				for(Datatype datatype : datatypesbyVersionThenName.get(version).get(name)) {
////				System.out.println("Look Here : " + datatype.getName()+datatype.getExt());
//			}
//			}
//		}
//
//		webExportObject.setDatatypesXMLByRoot(datatypesXMLbyRoot);
//		webExportObject.setDatatypesbyVersionThenName(datatypesbyVersionThenName);
//		webExportObject.setDatatypesbyNameThenVersion(datatypesbyNameThenVersion);
//		webExportObject.setMapDatatypeToXML(mapDatatypeToXML);
//	}
//
//}
