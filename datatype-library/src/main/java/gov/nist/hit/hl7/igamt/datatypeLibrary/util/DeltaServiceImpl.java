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
package gov.nist.hit.hl7.igamt.datatypeLibrary.util;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl.DeltaService;

/**
 * @author ena3
 *
 */
@Service
public class DeltaServiceImpl implements DeltaService {


  @Override
  public boolean compareDatatypes(Datatype d1, Datatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) {
    // TODO Auto-generated method stub


    if (!d1.getName().toLowerCase().equals(d2.getName().toLowerCase())) {

      return false;
    } else if (!d1.getClass().equals(d2.getClass())) {
      return false;
    } else if (d1 instanceof ComplexDatatype && d2 instanceof ComplexDatatype) {

      return compareComplexDatatypes((ComplexDatatype) d1, (ComplexDatatype) d2, criterias);
    } else {
      return true;
    }



  }


  /**
   * @param d1
   * @param d2
   * @return
   */
  private boolean compareComplexDatatypes(ComplexDatatype d1, ComplexDatatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) {
    // TODO Auto-generated method stub
    if (d1.getComponents().size() != d2.getComponents().size()) {

      return false;
    } else if (d1.getComponents().size() == 0) {
      return true;
    } else {
      List<Component> cps1 = d1.getComponents().stream()
          .sorted((Component t1, Component t2) -> t1.getPosition() - t2.getPosition())
          .collect(Collectors.toList());

      List<Component> cps2 = d2.getComponents().stream()
          .sorted((Component t1, Component t2) -> t1.getPosition() - t2.getPosition())
          .collect(Collectors.toList());


      for (int i = 0; i < cps1.size(); i++) {

        if (!compareComponent(cps1.get(i), cps2.get(i), criterias)) {
          return false;
        }

      }
      return true;
    }
  }


  @Override
  public boolean compareComponent(Component c1, Component c2,
      HashMap<EvolutionPropertie, Boolean> criterias) {

    if (criterias.containsKey(EvolutionPropertie.CPNAME)
        && criterias.get((EvolutionPropertie.CPNAME))) {
      if (!c1.getName().equalsIgnoreCase(c2.getName())) {
        return false;
      }

    }

    if (criterias.containsKey(EvolutionPropertie.CONFLENGTH)
        && criterias.get((EvolutionPropertie.CONFLENGTH))) {
      if (!c1.getConfLength().equalsIgnoreCase(c2.getConfLength())) {
        return false;
      }

    }

    if (criterias.containsKey(EvolutionPropertie.MINLENGTH)
        && criterias.get((EvolutionPropertie.MINLENGTH))) {
      if (!c1.getMinLength().equalsIgnoreCase(c2.getMinLength())) {
        return false;
      }

    }

    if (criterias.containsKey(EvolutionPropertie.MAXLENGTH)
        && criterias.get((EvolutionPropertie.MAXLENGTH))) {
      if (!c1.getName().equalsIgnoreCase(c2.getName())) {
        return false;
      }

    }


    // TODO Auto-generated method stub
    return true;
  }

}
