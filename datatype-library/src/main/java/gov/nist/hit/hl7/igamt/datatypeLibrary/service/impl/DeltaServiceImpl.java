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

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DeltaService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaCell;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaRowData;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaTreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;

/**
 * @author ena3
 *
 */
@Service
public class DeltaServiceImpl implements DeltaService {


  @Autowired
  DatatypeService datatypeService;

  @Override
  public boolean compareDatatypes(Datatype d1, Datatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException {
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
   * @throws DatatypeNotFoundException
   */
  private boolean compareComplexDatatypes(ComplexDatatype d1, ComplexDatatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException {
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
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException {

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
      if (!c1.getMaxLength().equalsIgnoreCase(c2.getMaxLength())) {
        return false;
      }

    }


    if (criterias.containsKey(EvolutionPropertie.CPDATATYPE)
        && criterias.get((EvolutionPropertie.CPDATATYPE))) {
      Datatype d1 = null;
      Datatype d2 = null;

      if (c1.getRef() != null && c1.getRef().getId() != null) {
        d1 = datatypeService.getLatestById(c1.getRef().getId());
        if (d1 == null) {
          throw new DatatypeNotFoundException(c1.getRef().getId());
        }

      }
      if (c2.getRef() != null && c2.getRef().getId() != null) {
        d2 = datatypeService.getLatestById(c2.getRef().getId());
        if (d2 == null) {
          throw new DatatypeNotFoundException(c2.getRef().getId());
        }
      }

      return this.compareDatatypes(d1, d2, criterias);
    }

    // TODO Auto-generated method stub
    return true;
  }


  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DeltaService#getDatatypesDelta(gov.nist.hit.hl7.
   * igamt.datatype.domain.Datatype, gov.nist.hit.hl7.igamt.datatype.domain.Datatype,
   * java.util.HashMap)
   */
  @Override
  public DeltaTreeNode getDatatypesDelta(Datatype d1, Datatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException {
    DeltaTreeNode deltaNode = new DeltaTreeNode();
    DeltaRowData data = new DeltaRowData();
    if (!d1.getName().toLowerCase().equals(d2.getName().toLowerCase())) {
      data.addCell(EvolutionPropertie.CPDATATYPENAME, new DeltaCell(d1.getName(), d2.getName()));
    }
    if (d1 instanceof ComplexDatatype && d2 instanceof ComplexDatatype) {

      compareComplexDatatypes((ComplexDatatype) d1, (ComplexDatatype) d2, criterias, deltaNode);

    }
    return deltaNode;
    // TODO Auto-generated method stub
  }



  /**
   * @param d1
   * @param d2
   * @param criterias
   * @param deltaNode
   * @throws DatatypeNotFoundException
   */
  private void compareComplexDatatypes(ComplexDatatype d1, ComplexDatatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias, DeltaTreeNode deltaNode)
      throws DatatypeNotFoundException {

    List<Component> cps1 = d1.getComponents().stream()
        .sorted((Component t1, Component t2) -> t1.getPosition() - t2.getPosition())
        .collect(Collectors.toList());

    List<Component> cps2 = d2.getComponents().stream()
        .sorted((Component t1, Component t2) -> t1.getPosition() - t2.getPosition())
        .collect(Collectors.toList());
    int min = Integer.min(cps1.size(), cps2.size());


    if (d1.getComponents().size() != d2.getComponents().size()) {
      deltaNode.getData().addCell(EvolutionPropertie.CPNUMBER, new DeltaCell(
          String.valueOf(d1.getComponents().size()), String.valueOf(d2.getComponents().size())));
      for (int i = 0; i < min; i++) {

        compareComponent(cps1.get(i), cps2.get(i), criterias, deltaNode);

      }

      if (cps1.size() > min) {
        for (int i = min; i < cps1.size(); i++) {

          AddNewComponent(cps1.get(i), criterias, deltaNode);

        }
      } else {
        for (int i = min; i < cps2.size(); i++) {

          AddNewComponent(cps2.get(i), criterias, deltaNode);

        }
      }


    } else {

      for (int i = 0; i < min; i++) {

        compareComponent(cps1.get(i), cps2.get(i), criterias, deltaNode);

      }
    }


  }


  /**
   * @param component
   * @param criterias
   * @param deltaNode
   * @throws DatatypeNotFoundException
   */
  private void AddNewComponent(Component c1, HashMap<EvolutionPropertie, Boolean> criterias,
      DeltaTreeNode deltaNode) throws DatatypeNotFoundException {

    // TODO Auto-generated method stub

    DeltaTreeNode child = new DeltaTreeNode();
    DeltaRowData childData = new DeltaRowData();
    child.setPosition(c1.getPosition());
    childData.setPosition(c1.getPosition());
    if (criterias.containsKey(EvolutionPropertie.CPNAME)
        && criterias.get((EvolutionPropertie.CPNAME))) {
      childData.addCell(EvolutionPropertie.CPNAME, new DeltaCell(c1.getName(), ""));

    }

    if (criterias.containsKey(EvolutionPropertie.CONFLENGTH)
        && criterias.get((EvolutionPropertie.CONFLENGTH))) {
      childData.addCell(EvolutionPropertie.CONFLENGTH, new DeltaCell(c1.getConfLength(), ""));

    }

    if (criterias.containsKey(EvolutionPropertie.MINLENGTH)
        && criterias.get((EvolutionPropertie.MINLENGTH))) {
      childData.addCell(EvolutionPropertie.MINLENGTH, new DeltaCell(c1.getMinLength(), ""));

    }

    if (criterias.containsKey(EvolutionPropertie.MAXLENGTH)
        && criterias.get((EvolutionPropertie.MAXLENGTH))) {
      childData.addCell(EvolutionPropertie.MAXLENGTH, new DeltaCell(c1.getMaxLength(), ""));

    }


    if (criterias.containsKey(EvolutionPropertie.CPDATATYPE)
        && criterias.get((EvolutionPropertie.CPDATATYPE))) {
      Datatype d1 = null;
      if (c1.getRef() != null && c1.getRef().getId() != null) {
        d1 = datatypeService.getLatestById(c1.getRef().getId());
        if (d1 == null) {
          throw new DatatypeNotFoundException(c1.getRef().getId());
        }

      }


      childData.addCell(EvolutionPropertie.CPDATATYPENAME, new DeltaCell(d1.getName(), ""));
      childData.addCell(EvolutionPropertie.CPDATATYPE, new DeltaCell(d1.getName(), ""));



    }

    child.setData(childData);

    deltaNode.getChildren().add(child);



    // TODO Auto-generated method stub

  }


  /**
   * @param component
   * @param component2
   * @param criterias
   * @param deltaNode
   * @throws DatatypeNotFoundException
   */
  private void compareComponent(Component c1, Component c2,
      HashMap<EvolutionPropertie, Boolean> criterias, DeltaTreeNode deltaNode)
      throws DatatypeNotFoundException {
    // TODO Auto-generated method stub

    DeltaTreeNode child = new DeltaTreeNode();
    DeltaRowData childData = new DeltaRowData();
    child.setPosition(c1.getPosition());
    childData.setPosition(c1.getPosition());
    if (criterias.containsKey(EvolutionPropertie.CPNAME)
        && criterias.get((EvolutionPropertie.CPNAME))) {
      if (!c1.getName().equalsIgnoreCase(c2.getName())) {
        childData.addCell(EvolutionPropertie.CPNAME, new DeltaCell(c1.getName(), c2.getName()));
      }

    }

    if (criterias.containsKey(EvolutionPropertie.CONFLENGTH)
        && criterias.get((EvolutionPropertie.CONFLENGTH))) {
      if (!c1.getConfLength().equalsIgnoreCase(c2.getConfLength())) {
        childData.addCell(EvolutionPropertie.CONFLENGTH,
            new DeltaCell(c1.getConfLength(), c2.getConfLength()));
      }

    }

    if (criterias.containsKey(EvolutionPropertie.MINLENGTH)
        && criterias.get((EvolutionPropertie.MINLENGTH))) {
      if (!c1.getMinLength().equalsIgnoreCase(c2.getMinLength())) {
        childData.addCell(EvolutionPropertie.MINLENGTH,
            new DeltaCell(c1.getMinLength(), c2.getMinLength()));
      }

    }

    if (criterias.containsKey(EvolutionPropertie.MAXLENGTH)
        && criterias.get((EvolutionPropertie.MAXLENGTH))) {
      if (!c1.getMaxLength().equalsIgnoreCase(c2.getMaxLength())) {
        childData.addCell(EvolutionPropertie.MAXLENGTH,
            new DeltaCell(c1.getMaxLength(), c2.getMaxLength()));
      }

    }


    if (criterias.containsKey(EvolutionPropertie.CPDATATYPE)
        && criterias.get((EvolutionPropertie.CPDATATYPE))) {
      Datatype d1 = null;
      Datatype d2 = null;

      if (c1.getRef() != null && c1.getRef().getId() != null) {
        d1 = datatypeService.getLatestById(c1.getRef().getId());
        if (d1 == null) {
          throw new DatatypeNotFoundException(c1.getRef().getId());
        }

      }
      if (c2.getRef() != null && c2.getRef().getId() != null) {
        d2 = datatypeService.getLatestById(c2.getRef().getId());
        if (d2 == null) {
          throw new DatatypeNotFoundException(c2.getRef().getId());
        }
      }


      DeltaTreeNode childNode = getDatatypesDelta(d1, d2, criterias);

      if (d1.getName().equals("HD")) {
        System.out.println(d1);
      }
      if (childNode.getChildren() != null && !childNode.getChildren().isEmpty()) {
        child.setChildren(childNode.getChildren());
        childData.addCell(EvolutionPropertie.CPDATATYPE, new DeltaCell(d1.getName(), d2.getName()));
      }
      if (childNode.getData().getData().containsKey(EvolutionPropertie.CPDATATYPENAME)) {
        childData.addCell(EvolutionPropertie.CPDATATYPENAME,
            childNode.getData().getData().get(EvolutionPropertie.CPDATATYPENAME));
      }

    }


    if (!childData.getData().isEmpty()) {
      child.setData(childData);
      deltaNode.getChildren().add(child);
    }


  }


}
