package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.SerializableDatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibrarySerializationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util.WebExportObject;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service
public class DatatypeLibrarySerializationServiceImpl
    implements DatatypeLibrarySerializationService {

  @Autowired
  private DatatypeService datatypeService;

  private Map<String, Datatype> datatypesMap = new HashMap<>();
  private Map<String, Valueset> valuesetsMap = new HashMap<>();
  private Map<String, String> datatypeNamesMap = new HashMap<>();
  private Set<String> bindedDatatypes = new HashSet<>();
  private Set<String> bindedComponents = new HashSet<>();

  private void initializeDatatypeNamesAndBindedComponents() {
    for (String key : datatypesMap.keySet()) {
      Datatype datatype = datatypesMap.get(key);
      if (datatype.getLabel() != null) {
        datatypeNamesMap.put(datatype.getId().getId(), datatype.getLabel());
      }
      if (datatype instanceof ComplexDatatype) {
        ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
        for (Component component : complexDatatype.getComponents()) {
          bindedComponents.add(component.getId());
        }
      }
    }
  }

  private void initializeDatatypesMap(Registry datatypeLibrary,
      UsageConfiguration usageConfiguration) throws DatatypeNotFoundException {
    for (Link datatypeLink : datatypeLibrary.getChildren()) {
      if (datatypeLink != null && datatypeLink.getId() != null
          && !datatypesMap.containsKey(datatypeLink.getId().getId())) {
        Datatype datatype = datatypeService.findByKey(datatypeLink.getId());
        if (datatype != null) {
          datatypesMap.put(datatypeLink.getId().getId(), datatype);
        } else {
          throw new DatatypeNotFoundException(datatypeLink.getId().getId());
        }
      }
    }
  }

  @Override
  public String serializeDatatypeLibrary(DatatypeLibrary datatypeLibrary,
      ExportConfiguration exportConfiguration) throws SerializationException {
    WebExportObject webExportObject = new WebExportObject();
    try {
      this.initializeDatatypesMap(datatypeLibrary.getDatatypeRegistry(),
          exportConfiguration.getDatatypesExport());
      // // added code starts here
      // webExportObject.populateMap(this.datatypesMap);
      // System.out.println("DONE");
      // HtmlWriter hw = new HtmlWriter();
      // PageCreator pg = new PageCreator();
      // BasicXsl bx = new BasicXsl();
      // hw.generateVersionInIndex(webExportObject);
      //// bx.BuildXMLfromMap(webExportObject.getDatatypesXMLOneByOne());
      // pg.generateLeafPageTable(webExportObject);
      // pg.generateIndex(webExportObject);
      // try {
      // hw.generateHtmlNameThenVersion(webExportObject);
      // hw.generateHtmlVersionsThenName(webExportObject);
      //
      // } catch (IOException e) {
      // // TODO Auto-generated catch block
      // e.printStackTrace();
      // }
      // System.out.println("END-HT");
      //
      // //added code ends here

      this.initializeDatatypeNamesAndBindedComponents();
      SerializableDatatypeLibrary serializableDatatypeLibrary =
          new SerializableDatatypeLibrary(datatypeLibrary, "1", datatypesMap, datatypeNamesMap,
              valuesetsMap, this.bindedDatatypes, this.bindedComponents);
      return serializableDatatypeLibrary.serialize().toXML();
    } catch (DatatypeNotFoundException e) {
      throw new SerializationException(e, Type.DATATYPELIBRARY, datatypeLibrary.getLabel());
    }
  }
}

