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
package gov.nist.hit.hl7.igamt.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.management.loading.MLet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGConverterException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetsResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.ElementTreeData;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.TextSectionData;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author ena3
 *
 */
@Service
public class DisplayConverterServiceImpl implements DisplayConverterService {
  @Autowired
  IgRepository igRepository;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  ProfileComponentService profileComponentService;


  @Autowired
  CompositeProfileStructureService compositeProfileServie;


  @Autowired
  ValuesetService valueSetService;

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertTextSectionToNode(gov.nist.hit
   * .hl7.igamt.shared.domain.TextSection)
   */



  private TreeNode createTextSectionNode(TextSection s, Ig ig, IGContentMap igData) throws IGConverterException, ResourceNotFoundException {
    TreeNode t = new TreeNode();
    TextSectionData sectionTree = new TextSectionData();
    sectionTree.setLabel(s.getLabel());
    sectionTree.setPosition(s.getPosition());
    sectionTree.setType(s.getType());
    t.setId(s.getId());

    sectionTree.setDescription(s.getDescription());
    t.setData(sectionTree);
    if (s.getType() == null) {
      throw new IGConverterException("Section type is missing");
    }
    if (s.getType().equals(Type.TEXT) || s.getType().equals(Type.PROFILE)) {

      if (s.getChildren() != null && !s.getChildren().isEmpty()) {

        List<TreeNode> children = new ArrayList<TreeNode>();

        for (TextSection section : s.getChildren()) {
          if (s instanceof TextSection) {
            TextSection sect = section;
            children.add(createTextSectionNode(sect, ig,igData));
          }

        }
        children.sort((h1, h2) -> h1.compareTo(h2));

        t.setChildren(children);
      }
    } else {
      t.setChildren(generateChildrenByType(s, s.getType(), ig, igData));
    }

    return t;
  }

  @Override
  public TreeNode createNarrativeNode(TextSection s) {
    TreeNode t = new TreeNode();
    TextSectionData sectionTree = new TextSectionData();
    sectionTree.setLabel(s.getLabel());
    sectionTree.setPosition(s.getPosition());
    sectionTree.setType(s.getType());
    t.setId(s.getId());
    sectionTree.setDescription(s.getDescription());
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



  /**
   * @param s
   * @param type
 * @param igData 
   * @return
 * @throws ResourceNotFoundException 
   */
  private List<TreeNode> generateChildrenByType(TextSection s, Type type, Ig ig, IGContentMap igData) throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    List<TreeNode> sectionChildren = new ArrayList<TreeNode>();

    if (type.equals(Type.PROFILECOMPONENTREGISTRY)) {
    	//      sectionChildren = createPcsNodes(ig.getProfileComponentRegistry().getChildren());

    } else if (type.equals(Type.CONFORMANCEPROFILEREGISTRY)) {
      sectionChildren = createCpsNodes(ig.getConformanceProfileRegistry().getChildren(), igData.getConformanceProfiles());

    } else if (type.equals(Type.COMPOSITEPROFILEREGISTRY)) {
     // sectionChildren = createCompositeProfileNodes(ig.getCompositeProfileRegistry().getChildren());

    } else if (type.equals(Type.SEGMENTREGISTRY)) {
      sectionChildren = createSegmentsNodes(ig.getSegmentRegistry().getChildren(), igData.getSegments());

    } else if (type.equals(Type.DATATYPEREGISTRY)) {
      sectionChildren = createDatatypesNodes(ig.getDatatypeRegistry().getChildren(), igData.getDatatypes());

    } else if (type.equals(Type.VALUESETREGISTRY)) {
      sectionChildren = createValueSetsNodes(ig.getValueSetRegistry().getChildren(),igData.getValuesets());

    }
    sectionChildren.sort((h1, h2) -> h1.compareTo(h2));

    return sectionChildren;

  }



  private List<TreeNode> createDatatypesNodes(Set<Link> children, Map<String, Datatype> map) throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    List<TreeNode> nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
    	if(map.containsKey(l.getId())) {    	  
        nodes.add(createDatatypeNode(map.get(l.getId()), l.getPosition()));
    }else {
    		throw new ResourceNotFoundException(l.getId(), Type.DATATYPE);
    }
    	}

    return nodes;
  }

  private List<TreeNode> createSegmentsNodes(Set<Link> children, Map<String, Segment> map) throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    List<TreeNode> nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
    	if(map.containsKey(l.getId())) {
    	    nodes.add(createSegmentNode( map.get(l.getId()), l.getPosition()));
    	}else {
    		throw new ResourceNotFoundException(l.getId(), Type.SEGMENT);
    	  }
    }
    nodes.sort((h1, h2) -> h1.compareTo(h2));

    return nodes;
  }



  private List<TreeNode> createCompositeProfileNodes(Set<Link> children) {

    // TODO Auto-generated method stub
    List<TreeNode> nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      CompositeProfileStructure compositeProfile = compositeProfileServie.findById(l.getId());
      if (compositeProfile != null) {
        nodes.add(createCompositeProfileNode(compositeProfile, l.getPosition()));
      }
    }
    nodes.sort((h1, h2) -> h1.compareTo(h2));

    return nodes;
  }

  /**
   * @param node
   * @return
   */
  @Override
  public TreeNode createCompositeProfileNode(CompositeProfileStructure compositeProfile,
      int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(compositeProfile.getName());
    data.setDescription(compositeProfile.getDescription());
    data.setDomainInfo(compositeProfile.getDomainInfo());
    data.setId(compositeProfile.getId());
    data.setPosition(position);
    data.setType(Type.COMPOSITEPROFILE);
    node.setData(data);
    node.setId(compositeProfile.getId());
    return node;
  }


  private List<TreeNode> createValueSetsNodes(Set<Link> children, Map<String, Valueset> map) throws ResourceNotFoundException {

    List<TreeNode> nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
    	if(map.containsKey(l.getId())) {
        nodes.add(createValueSetNode(map.get(l.getId()), l.getPosition()));
      
    }else {
    		throw new ResourceNotFoundException(l.getId(), Type.DATATYPE);
    }
    }
    nodes.sort((h1, h2) -> h1.compareTo(h2));

    return nodes;

  }

  /**
   * @param vs
   * @return
   */
  @Override
  public TreeNode createValueSetNode(Valueset vs, int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(vs.getBindingIdentifier());
    data.setDescription(vs.getName());
    data.setPosition(position);
    data.setDomainInfo(vs.getDomainInfo());
    data.setId(vs.getId());
    data.setType(Type.VALUESET);
    node.setData(data);
    node.setId(vs.getId());
    return node;
  }



  private List<TreeNode> createCpsNodes(Set<Link> children, Map<String, ConformanceProfile> map) throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    // TODO Auto-generated method stub
    List<TreeNode> nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
    		if(map.containsKey(l.getId())) {
    			ConformanceProfile confromanceProfile = map.get(l.getId());
    	        nodes.add(createCpNode(confromanceProfile, l.getPosition()));
    		}else {
    			throw new ResourceNotFoundException(l.getId(),Type.CONFORMANCEPROFILE);
    		}
    }

    return nodes;
  }



  /**
   * @param confromanceProfile
   * @return
   */
  @Override
  public TreeNode createCpNode(ConformanceProfile confromanceProfile, int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(confromanceProfile.getName());
    data.setDescription(confromanceProfile.getDescription());
    data.setExt(confromanceProfile.getIdentifier());
    data.setDomainInfo(confromanceProfile.getDomainInfo());
    data.setId(confromanceProfile.getId());
    node.setData(data);
    data.setPosition(position);
    node.setId(confromanceProfile.getId());
    data.setType(Type.CONFORMANCEPROFILE);
    return node;

  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertDomainToModel(gov.nist.hit.hl7
   * .igamt.ig.domain.Ig)
   */
  @Override
  public IGDisplay convertDomainToModel(Ig ig, IGContentMap igData) throws IGConverterException, ResourceNotFoundException {
    // TODO Auto-generated method stub
    IGDisplay igDisplay = new IGDisplay();
    igDisplay.setMetadata(ig.getMetadata());
    igDisplay.setAuthor(ig.getUsername());
    igDisplay.setDateUpdated(ig.getUpdateDate());
    List<TreeNode> firstLevel = new ArrayList<TreeNode>();
    for (TextSection s : ig.getContent()) {
      firstLevel.add(createTextSectionNode(s, ig,igData));
    }
    firstLevel.sort((h1, h2) -> h1.compareTo(h2));
    igDisplay.setToc(firstLevel);
    return igDisplay;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#ConvertModelToDomain(gov.nist.hit.hl7
   * .igamt.ig.model.IGDisplay)
   */
  @Override
  public Ig ConvertModelToDomain(IGDisplay ig) {
    // TODO Auto-generated method stub
    return null;
  }



  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getDatatypesNodes(java.util.Set)
   */
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
   * @see gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getSegmentNodes(java.util.Set)
   */
  @Override
  public List<TreeNode> getSegmentNodes(Set<Segment> segments) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Segment elm : segments) {
      Nodes.add(createSegmentNode(elm, 0));

    }

    return Nodes;
  }



  /**
   * @param elm
   * @return
   */
  @Override
  public TreeNode createSegmentNode(Segment elm, int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(elm.getName());
    data.setExt(elm.getExt());
    data.setPosition(position);
    data.setDescription(elm.getDescription());
    data.setDomainInfo(elm.getDomainInfo());
    data.setId(elm.getId());
    data.setType(Type.SEGMENT);
    node.setId(elm.getId());
    node.setData(data);
    return node;

  }



  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getValueSetNodes(java.util.Set)
   */
  @Override
  public List<TreeNode> getValueSetNodes(Set<Valueset> valuesets) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Valueset elm : valuesets) {

      // addChildrenByType(node, Type.VALUESET);
      Nodes.add(createValueSetNode(elm));
    }

    return Nodes;

  }



  /**
   * @param elm
   * @return
   */
  private TreeNode createValueSetNode(Valueset elm) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(elm.getBindingIdentifier());
    data.setDescription(elm.getName());
    data.setDomainInfo(elm.getDomainInfo());
    data.setId(elm.getId());
    data.setType(Type.VALUESET);
    node.setData(data);
    node.setId(elm.getId());
    return node;
  }




  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getConformaneProfile(java.util.Set)
   */
  @Override
  public List<TreeNode> getConformaneProfile(Set<ConformanceProfile> conformanceProfiles) {
    // TODO Auto-generated method stub

    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (ConformanceProfile elm : conformanceProfiles) {

      Nodes.add(createConformanceProfileNode(elm, 0));

    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));
    return Nodes;

  }



  /**
   * @param elm
   * @return
   */
  @Override
  public TreeNode createConformanceProfileNode(ConformanceProfile elm, int position) {
    // TODO Auto-generated method stub
    TreeNode node = new TreeNode();
    ElementTreeData data = new ElementTreeData();
    data.setLabel(elm.getName());
    data.setPosition(position);
    data.setExt(elm.getIdentifier());
    data.setDescription(elm.getDescription());
    data.setDomainInfo(elm.getDomainInfo());
    data.setId(elm.getId());
    node.setData(data);
    node.setId(elm.getId());
    data.setType(Type.CONFORMANCEPROFILE);
    return node;

  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertMessageAddResponseToDisplay(
   * gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject)
   */
  @Override
  public AddMessageResponseDisplay convertMessageAddResponseToDisplay(
      AddMessageResponseObject addMessageResponse) {
    AddMessageResponseDisplay addedNodes = new AddMessageResponseDisplay();
    // TODO Auto-generated method stub
//
//    List<DisplayElement> segments = this.getSegmentNodes(addMessageResponse.getSegments());
//    List<DisplayElement> datatypes = this.getDatatypesNodes(addMessageResponse.getDatatypes());
//    List<DisplayElement> valueSets = this.getValueSetNodes(addMessageResponse.getValueSets());
//    List<DisplayElement> conformancePrfiles =
//        this.getConformaneProfile(addMessageResponse.getConformanceProfiles());
//    addedNodes.setConformanceProfiles(conformancePrfiles);
//    addedNodes.setDatatypes(datatypes);
//    addedNodes.setSegments(segments);
//    addedNodes.setValueSets(valueSets);

    return addedNodes;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertSegmentResponseToDisplay(gov.
   * nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject)
   */
  @Override
  public AddSegmentResponseDisplay convertSegmentResponseToDisplay(
      AddSegmentResponseObject objects) {
    // TODO Auto-generated method stub
    AddSegmentResponseDisplay addedNodes = new AddSegmentResponseDisplay();
    // TODO Auto-generated method stub

    List<TreeNode> segments = this.getSegmentNodes(objects.getSegments());
    List<TreeNode> datatypes = this.getDatatypesNodes(objects.getDatatypes());

    List<TreeNode> valueSets = this.getValueSetNodes(objects.getValueSets());

    addedNodes.setDatatypes(datatypes);
    addedNodes.setSegments(segments);
    addedNodes.setValueSets(valueSets);

    return addedNodes;
  }



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

    List<TreeNode> valueSets = this.getValueSetNodes(objects.getValueSets());

    addedNodes.setDatatypes(datatypes);
    addedNodes.setValueSets(valueSets);

    return addedNodes;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertDatatypeResponseToDisplay(gov.
   * nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject)
   */
  @Override
  public AddValueSetsResponseDisplay convertDatatypeResponseToDisplay(
      AddValueSetResponseObject objects) {
    // TODO Auto-generated method stub
    // TODO Auto-generated method stub
    AddValueSetsResponseDisplay addedNodes = new AddValueSetsResponseDisplay();
    // TODO Auto-generated method stub


    List<TreeNode> valueSets = this.getValueSetNodes(objects.getValueSets());

    addedNodes.setValueSets(valueSets);

    return addedNodes;
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

    if (t.getData() instanceof TextSectionData) {
      s.setDescription(((TextSectionData) t.getData()).getDescription());
    }
    if (t.getData().getType().equals(Type.TEXT) || t.getData().getType().equals(Type.PROFILE)) {
      if (t.getChildren() != null && !t.getChildren().isEmpty()) {

        for (TreeNode child : t.getChildren()) {
          s.getChildren().add(convertTreeNodeToTextSection(child));
        }
      }
    }
    return s;
  }



}
