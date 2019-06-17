//package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;
//
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.Map;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.Link;
//import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
//import gov.nist.hit.hl7.igamt.datatype.domain.Component;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.SerializableDatatypeLibrary;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibrarySerializationService;
//import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
//import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
//import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
//import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
//
//@Service
//public class DatatypeLibrarySerializationServiceImpl
//    implements DatatypeLibrarySerializationService {
//
//  @Autowired
//  private DatatypeService datatypeService;
//
//  private Map<String, Datatype> datatypesMap = new HashMap<>();
//  private Map<String, Valueset> valuesetsMap = new HashMap<>();
//  private Map<String, String> datatypeNamesMap = new HashMap<>();
//  private Set<String> bindedDatatypes = new HashSet<>();
//  private Set<String> bindedComponents = new HashSet<>();
//
//  private void initializeDatatypeNamesAndBindedComponents() {
//    for (String key : datatypesMap.keySet()) {
//      Datatype datatype = datatypesMap.get(key);
//      if (datatype.getLabel() != null) {
//        datatypeNamesMap.put(datatype.getId(), datatype.getLabel());
//      }
//      if (datatype instanceof ComplexDatatype) {
//        ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
//        for (Component component : complexDatatype.getComponents()) {
//          bindedComponents.add(component.getId());
//        }
//      }
//    }
//  }
//
//  private void initializeDatatypesMap(Registry datatypeLibrary,
//      UsageConfiguration usageConfiguration) throws DatatypeNotFoundException {
//    for (Link datatypeLink : datatypeLibrary.getChildren()) {
//      if (datatypeLink != null && datatypeLink.getId() != null
//          && !datatypesMap.containsKey(datatypeLink.getId())) {
//        Datatype datatype = datatypeService.findById(datatypeLink.getId());
//        if (datatype != null) {
//          datatypesMap.put(datatypeLink.getId(), datatype);
//        } else {
//          throw new DatatypeNotFoundException(datatypeLink.getId());
//        }
//      }
//    }
//    
//  }
//
//  @Override
//  public String serializeDatatypeLibrary(DatatypeLibrary datatypeLibrary,
//      ExportConfiguration exportConfiguration) throws SerializationException {
//    try {
//      this.initializeDatatypesMap(datatypeLibrary.getDatatypeRegistry(),
//          exportConfiguration.getDatatypesExport());
//      this.initializeDatatypesMap(datatypeLibrary.getDerivedRegistry(),
//              exportConfiguration.getDatatypesExport());
//      this.initializeDatatypeNamesAndBindedComponents();
//      SerializableDatatypeLibrary serializableDatatypeLibrary =
//          new SerializableDatatypeLibrary(datatypeLibrary, "1", datatypesMap, datatypeNamesMap,
//              valuesetsMap, this.bindedDatatypes, this.bindedComponents);
//      return serializableDatatypeLibrary.serialize().toXML();
//    } catch (DatatypeNotFoundException e) {
//      throw new SerializationException(e, Type.DATATYPELIBRARY, datatypeLibrary.getLabel());
//    }
//  }
//}
//
