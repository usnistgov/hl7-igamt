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
package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeClassification;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeVersionGroup;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassifier;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DeltaService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;

/**
 * @author ena3
 *
 */
@Service
public class DatatypeClassifierImpl implements DatatypeClassifier {
  @Autowired
  DatatypeService datatypeService;

  @Autowired
  DeltaService deltaService;
  @Autowired
  DatatypeClassificationService datatypeClassificationService;

  @Autowired
  ConfigService configService;

  private final HashMap<String, ArrayList<List<String>>> datatypeMap =
      new HashMap<String, ArrayList<List<String>>>();
  private HashMap<String, Integer> visited = new HashMap<String, Integer>();

  @Override
  public void classify(List<String> versions, HashMap<EvolutionPropertie, Boolean> criterias)
      throws DatatypeNotFoundException {



    List<String> hl7Versions = configService.findOne().getHl7Versions();



    HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();

    criterias1.put(EvolutionPropertie.CONFLENGTH, true);
    criterias1.put(EvolutionPropertie.MAXLENGTH, true);
    criterias1.put(EvolutionPropertie.MINLENGTH, true);
    criterias1.put(EvolutionPropertie.CPDATATYPE, true);
    criterias1.put(EvolutionPropertie.CPNUMBER, true);
    criterias1.put(EvolutionPropertie.CPNAME, true);



    for (int i = 0; i < hl7Versions.size(); i++) {
      AddVersion(hl7Versions.get(i), criterias1);
    }
    for (String s : datatypeMap.keySet()) {
      DatatypeClassification classification = new DatatypeClassification();
      classification.setName(s);


      if (datatypeMap.get(s) != null) {
        ArrayList<List<String>> groups = datatypeMap.get(s);
        for (int i = 0; i < groups.size(); i++) {
          DatatypeVersionGroup group = new DatatypeVersionGroup();
          group.setPosition(i + 1);
          group.setVersions(groups.get(i));
          classification.getClasses().add(group);

        }
      }

      System.out.println("Saving Classe Of Unchanged Datatype");

      datatypeClassificationService.save(classification);

    }



  }



  private void init(String version) {

    HashMap<EvolutionPropertie, Boolean> criterias = new HashMap<EvolutionPropertie, Boolean>();
    List<Datatype> dataInit =
        datatypeService.findByScopeAndVersion(Scope.HL7STANDARD.toString(), version);
    for (Datatype dt : dataInit) {
      ArrayList<List<String>> temp = new ArrayList<List<String>>();
      List<String> version1 = new ArrayList<String>();
      version1.add(version);
      temp.add(version1);
      datatypeMap.put(dt.getName(), temp);

    }

  }


  private void AddVersion(String version, HashMap<EvolutionPropertie, Boolean> criterias)
      throws DatatypeNotFoundException {
    visited = new HashMap<String, Integer>();
    List<Datatype> datatypesToAdd =
        datatypeService.findByScopeAndVersion(Scope.HL7STANDARD.toString(), version);

    for (Datatype dt : datatypesToAdd) {
      if (!datatypeMap.containsKey(dt.getName())) {
        ArrayList<List<String>> temp = new ArrayList<List<String>>();
        List<String> version1 = new ArrayList<String>();
        version1.add(version);
        temp.add(version1);
        datatypeMap.put(dt.getName(), temp);
      } else {
        for (int i = 0; i < datatypeMap.get(dt.getName()).size(); i++) {
          List<Datatype> datatypes = datatypeService.findByNameAndVersionAndScope(dt.getName(),
              datatypeMap.get(dt.getName()).get(i).get(0), Scope.HL7STANDARD.toString());
          Datatype d = null;
          if (datatypes != null && !datatypes.isEmpty()) {
            d = datatypes.get(0);
          } else {
            throw new DatatypeNotFoundException(dt.getName(),
                datatypeMap.get(dt.getName()).get(i).get(0), Scope.HL7STANDARD.toString());
          }
          if (d != null && !visited.containsKey(dt.getName())) {
            if (deltaService.compareDatatypes(d, dt, criterias)) {
              datatypeMap.get(dt.getName()).get(i).add(version);

              System.out.println("FOUND IDENTIQUE");
              visited.put(dt.getName(), 1);
            }
          }
        }
        if (!visited.containsKey(dt.getName())) {
          List<String> version2Add = new ArrayList<String>();
          version2Add.add(version);
          datatypeMap.get(dt.getName()).add(version2Add);
          visited.put(dt.getName(), 1);
        }
      }
    }
  }


  @Override
  public void classify() throws DatatypeNotFoundException {
    System.out.println("Called Classifier");
    List<String> hl7Versions = configService.findOne().getHl7Versions();
    HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();
    criterias1.put(EvolutionPropertie.CONFLENGTH, true);
    criterias1.put(EvolutionPropertie.MAXLENGTH, true);
    criterias1.put(EvolutionPropertie.MINLENGTH, true);
    criterias1.put(EvolutionPropertie.CPDATATYPE, true);
    criterias1.put(EvolutionPropertie.CPNUMBER, true);
    criterias1.put(EvolutionPropertie.CPNAME, true);
    for (int i = 0; i < hl7Versions.size(); i++) {
      AddVersion(hl7Versions.get(i), criterias1);
    }
    for (String s : datatypeMap.keySet()) {
      DatatypeClassification classification = new DatatypeClassification();
      classification.setName(s);
      if (datatypeMap.get(s) != null) {
        ArrayList<List<String>> groups = datatypeMap.get(s);
        for (int i = 0; i < groups.size(); i++) {
          DatatypeVersionGroup group = new DatatypeVersionGroup();
          group.setPosition(i + 1);
          group.setVersions(groups.get(i));
          classification.getClasses().add(group);

        }
      }
      System.out.println("Saving Classe Of Unchanged Datatype");
      datatypeClassificationService.save(classification);
    }
  }


}
