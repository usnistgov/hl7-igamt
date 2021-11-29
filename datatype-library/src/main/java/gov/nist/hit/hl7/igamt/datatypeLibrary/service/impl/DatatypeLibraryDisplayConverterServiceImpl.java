package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryConverterException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DatatypeLibraryDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.ElementTreeData;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.TextSectionData;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.TreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryDisplayConverterService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;

/**
 * @author ena3
 *
 */
@Service
public class DatatypeLibraryDisplayConverterServiceImpl
    implements DatatypeLibraryDisplayConverterService {


  @Autowired
  DatatypeService datatypeService;


  @Override
  public TreeNode createNarrativeNode(TextSection s) {
    TreeNode t = new TreeNode();
    TextSectionData sectionTree = new TextSectionData();
    sectionTree.setLabel(s.getLabel());
    sectionTree.setPosition(s.getPosition());
    sectionTree.setType(s.getType());
    t.setId(s.getId());
    if (s.getDescription() != null) {
      sectionTree.setDescription(s.getDescription());

    } else {
      sectionTree.setDescription("");

    }
    t.setData(sectionTree);

    if (s.getChildren() != null && !s.getChildren().isEmpty()) {

      List<TreeNode> children = new ArrayList<TreeNode>();

      for (TextSection section : s.getChildren()) {
        if (s instanceof TextSection) {
          TextSection sect = section;
          children.add(createNarrativeNode(sect));
        }

      }
      children.sort((h1, h2) -> h1.compareTo(h2));

      t.setChildren(children);
    }
    return t;

  }



 



  private List<TreeNode> createDatatypesNodes(Set<Link> children) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      Datatype dt = datatypeService.findById(l.getId());
      if (dt != null) {


        Nodes.add(createDatatypeNode(dt, l.getPosition()));
      }
    }

    return Nodes;
  }




  @Override
  public List<TreeNode> getDatatypesNodes(Set<Datatype> datatypes) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Datatype elm : datatypes) {


      Nodes.add(createDatatypeNode(elm, 0));

    }

    return Nodes;
  }



  /**
   * @param elm
   * @return
   */
  @Override
  public TreeNode createDatatypeNode(Datatype elm, int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    if (!(elm instanceof ComplexDatatype)) {
      data.lazyLoading = false;
    }
    data.setPosition(position);
    data.setLabel(elm.getName());
    data.setExt(elm.getExt());
    data.setDescription(elm.getDescription());
    data.setId(elm.getId());
    data.setDomainInfo(elm.getDomainInfo());
    data.setType(Type.DATATYPE);
    node.setData(data);
    node.setId(elm.getId());
    return node;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertTocToDomain(java.util.List)
   */
  @Override
  public Set<TextSection> convertTocToDomain(List<TreeNode> toc) {

    Set<TextSection> result = new HashSet<TextSection>();
    for (TreeNode t : toc) {
      result.add(this.convertTreeNodeToTextSection(t));
    }

    return result;

  }

  /**
   * @param t
   * @return
   */
  private TextSection convertTreeNodeToTextSection(TreeNode t) {
    // TODO Auto-generated method stub
    TextSection s = new TextSection();
    s.setId(t.getId());
    s.setPosition(t.getData().getPosition());
    s.setLabel(t.getData().getLabel());
    s.setType(t.getData().getType());
    s.setDescription((t.getData()).getDescription());

    if (t.getData().getType().equals(Type.TEXT) || t.getData().getType().equals(Type.PROFILE)) {
      if (t.getChildren() != null && !t.getChildren().isEmpty()) {

        for (TreeNode child : t.getChildren()) {
          s.getChildren().add(convertTreeNodeToTextSection(child));
        }
      }
    }
    return s;

  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryDisplayConverterService#
   * convertDatatypeResponseToDisplay(gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.
   * AddDatatypeResponseObject)
   */
  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertDatatypeResponseToDisplay(gov.
   * nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject)
   */
  @Override
  public AddDatatypeResponseDisplay convertDatatypeResponseToDisplay(
      AddDatatypeResponseObject objects) {
    // TODO Auto-generated method stub
    AddDatatypeResponseDisplay addedNodes = new AddDatatypeResponseDisplay();
    // TODO Auto-generated method stub

    List<TreeNode> datatypes = this.getDatatypesNodes(objects.getDatatypes());


    addedNodes.setDatatypes(datatypes);

    return addedNodes;
  }







  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryDisplayConverterService#convertDomainToModel(gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary)
   */
  @Override
  public DatatypeLibraryDisplay convertDomainToModel(DatatypeLibrary lib)
      throws DatatypeLibraryConverterException {
    // TODO Auto-generated method stub
    return null;
  }

}
