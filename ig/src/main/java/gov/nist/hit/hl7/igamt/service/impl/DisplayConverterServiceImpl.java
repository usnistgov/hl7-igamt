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
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
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
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
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



  private TreeNode createTextSectionNode(TextSection s, Ig ig) {
    TreeNode t = new TreeNode();
    TextSectionData sectionTree = new TextSectionData();
    sectionTree.setLabel(s.getLabel());
    sectionTree.setPosition(s.getPosition());
    sectionTree.setType(s.getType());
    t.setId(s.getId());

    sectionTree.setDescription(s.getDescription());
    t.setData(sectionTree);
    if (s.getType().equals(Type.TEXT) || s.getType().equals(Type.PROFILE)) {

      if (s.getChildren() != null && !s.getChildren().isEmpty()) {

        List<TreeNode> children = new ArrayList<TreeNode>();

        for (TextSection section : s.getChildren()) {
          if (s instanceof TextSection) {
            TextSection sect = section;
            children.add(createTextSectionNode(sect, ig));
          }

        }
        children.sort((h1, h2) -> h1.compareTo(h2));

        t.setChildren(children);
      }
    } else {
      t.setChildren(generateChildrenByType(s, s.getType(), ig));
    }

    return t;
  }



  /**
   * @param s
   * @param type
   * @return
   */
  private List<TreeNode> generateChildrenByType(TextSection s, Type type, Ig ig) {
    // TODO Auto-generated method stub
    List<TreeNode> sectionChildren = new ArrayList<TreeNode>();

    if (type.equals(Type.PROFILECOMPONENTREGISTRY)) {
      sectionChildren = createPcsNodes(ig.getCompositeProfileRegistry().getChildren());

    } else if (type.equals(Type.CONFORMANCEPROFILEREGISTRY)) {
      sectionChildren = createCpsNodes(ig.getConformanceProfileRegistry().getChildren());

    } else if (type.equals(Type.COMPOSITEPROFILEREGISTRY)) {
      sectionChildren = createCompositePrfileNodes(ig.getCompositeProfileRegistry().getChildren());

    } else if (type.equals(Type.SEGMENTREGISTRY)) {
      sectionChildren = createSegmentsNodes(ig.getSegmentRegistry().getChildren());

    } else if (type.equals(Type.DATATYPEREGISTRY)) {
      sectionChildren = createDatatypesNodes(ig.getDatatypeRegistry().getChildren());

    } else if (type.equals(Type.VALUESETREGISTRY)) {
      sectionChildren = createValueSetsNodes(ig.getValueSetRegistry().getChildren());

    }
    return sectionChildren;

  }



  private List<TreeNode> createDatatypesNodes(Set<Link> children) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      Datatype dt = datatypeService.findByKey(l.getId());
      if (dt != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        if (!(dt instanceof ComplexDatatype)) {
          data.lazyLoading = false;
        }
        data.setLabel(dt.getName());
        data.setDescription(dt.getDescription());
        data.setPosition(l.getPosition());
        data.setKey(l.getId());
        data.setDomainInfo(dt.getDomainInfo());
        data.setType(Type.DATATYPE);
        node.setData(data);
        node.setId(l.getId().getId());

        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;
  }

  private List<TreeNode> createSegmentsNodes(Set<Link> children) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      Segment segment = segmentService.findByKey(l.getId());
      if (segment != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        data.setLabel(segment.getName());
        data.setExt(segment.getExt());
        data.setDescription(segment.getDescription());
        data.setPosition(l.getPosition());
        data.setDomainInfo(segment.getDomainInfo());

        data.setKey(l.getId());
        data.setType(Type.SEGMENT);
        node.setId(l.getId().getId());

        node.setData(data);

        // addChildrenByType(node, Type.SEGMENT);
        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;
  }

  private List<TreeNode> createCompositePrfileNodes(Set<Link> children) {

    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      CompositeProfileStructure compositeProfile = compositeProfileServie.findByKey(l.getId());
      if (compositeProfile != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        data.setLabel(compositeProfile.getName());
        data.setDescription(compositeProfile.getDescription());
        data.setDomainInfo(compositeProfile.getDomainInfo());
        data.setPosition(l.getPosition());
        data.setKey(l.getId());
        data.setType(Type.COMPOSITEPROFILE);
        node.setData(data);
        node.setId(l.getId().getId());


        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;
  }

  private List<TreeNode> createPcsNodes(Set<Link> children) {
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      ProfileComponent profileComponent = profileComponentService.findByCompositeKey(l.getId());
      if (profileComponent != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        data.setLabel(profileComponent.getName());
        data.setDescription(profileComponent.getName());
        data.setDomainInfo(profileComponent.getDomainInfo());
        data.setPosition(l.getPosition());
        data.setKey(l.getId());
        data.setType(Type.COMPOSITEPROFILE);
        node.setData(data);
        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;
  }

  private List<TreeNode> createValueSetsNodes(Set<Link> children) {

    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      Valueset vs = valueSetService.findById(l.getId());
      if (vs != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        data.setLabel(vs.getBindingIdentifier());
        data.setDescription(vs.getName());
        data.setPosition(l.getPosition());
        data.setDomainInfo(vs.getDomainInfo());
        data.setKey(l.getId());
        data.setType(Type.VALUESET);
        node.setData(data);
        node.setId(l.getId().getId());
        // addChildrenByType(node, Type.VALUESET);
        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;


  }

  private List<TreeNode> createCpsNodes(Set<Link> children) {
    // TODO Auto-generated method stub
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (Link l : children) {
      ConformanceProfile confromanceProfile = conformanceProfileService.findByKey(l.getId());
      if (confromanceProfile != null) {
        TreeNode node = new TreeNode();
        ElementTreeData data = new ElementTreeData();
        data.setLabel(confromanceProfile.getName());
        data.setDescription(confromanceProfile.getDescription());
        data.setDomainInfo(confromanceProfile.getDomainInfo());
        data.setPosition(l.getPosition());
        data.setKey(l.getId());
        node.setData(data);
        node.setId(l.getId().getId());
        data.setType(Type.CONFORMANCEPROFILE);
        Nodes.add(node);
      }
    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));

    return Nodes;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#convertDomainToModel(gov.nist.hit.hl7
   * .igamt.ig.domain.Ig)
   */
  @Override
  public IGDisplay convertDomainToModel(Ig ig) {
    // TODO Auto-generated method stub
    IGDisplay igDisplay = new IGDisplay();
    igDisplay.setMetadata(ig.getMetaData());
    igDisplay.setAuthor(ig.getUsername());
    igDisplay.setDateUpdated(ig.getUpdateDate());
    List<TreeNode> firstLevel = new ArrayList<TreeNode>();
    for (TextSection s : ig.getContent()) {
      firstLevel.add(createTextSectionNode(s, ig));
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
      TreeNode node = new TreeNode();
      ElementTreeData data = new ElementTreeData();
      if (!(elm instanceof ComplexDatatype)) {
        data.lazyLoading = false;
      }
      data.setLabel(elm.getName());
      data.setDescription(elm.getDescription());
      data.setKey(elm.getId());
      data.setDomainInfo(elm.getDomainInfo());
      data.setType(Type.DATATYPE);
      node.setData(data);
      node.setId(elm.getId().getId());

      Nodes.add(node);

    }

    return Nodes;
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
      TreeNode node = new TreeNode();
      ElementTreeData data = new ElementTreeData();
      data.setLabel(elm.getName());
      data.setExt(elm.getExt());
      data.setDescription(elm.getDescription());
      data.setDomainInfo(elm.getDomainInfo());

      data.setKey(elm.getId());
      data.setType(Type.SEGMENT);
      node.setId(elm.getId().getId());

      node.setData(data);

      // addChildrenByType(node, Type.SEGMENT);
      Nodes.add(node);

    }

    return Nodes;
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
      TreeNode node = new TreeNode();
      ElementTreeData data = new ElementTreeData();
      data.setLabel(elm.getBindingIdentifier());
      data.setDescription(elm.getName());
      data.setDomainInfo(elm.getDomainInfo());
      data.setKey(elm.getId());
      data.setType(Type.VALUESET);
      node.setData(data);
      node.setId(elm.getId().getId());
      // addChildrenByType(node, Type.VALUESET);
      Nodes.add(node);
    }

    return Nodes;

  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getCompositeProfileNodes(java.util.
   * Set)
   */
  @Override
  public List<TreeNode> getCompositeProfileNodes(Set<CompositeProfile> compositeProfiles) {
    // TODO Auto-generated method stub
    return null;
  }



  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService#getProfileCompoenents(java.util.Set)
   */
  @Override
  public List<TreeNode> getProfileCompoenents(Set<ProfileComponent> profileComponents) {
    // TODO Auto-generated method stub
    // TODO Auto-generated method stub
    List<TreeNode> Nodes = new ArrayList<TreeNode>();
    // TODO Auto-generated method stub
    for (ProfileComponent elm : profileComponents) {
      TreeNode node = new TreeNode();
      ElementTreeData data = new ElementTreeData();
      data.setLabel(elm.getName());
      data.setDescription(elm.getName());
      data.setDomainInfo(elm.getDomainInfo());
      data.setKey(elm.getId());
      data.setType(Type.COMPOSITEPROFILE);
      node.setData(data);
      Nodes.add(node);
    }


    return Nodes;
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
      TreeNode node = new TreeNode();
      ElementTreeData data = new ElementTreeData();
      data.setLabel(elm.getName());
      data.setDescription(elm.getDescription());
      data.setDomainInfo(elm.getDomainInfo());
      data.setKey(elm.getId());
      node.setData(data);
      node.setId(elm.getId().getId());
      data.setType(Type.CONFORMANCEPROFILE);
      Nodes.add(node);

    }
    Nodes.sort((h1, h2) -> h1.compareTo(h2));
    return Nodes;

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

    List<TreeNode> segments = this.getSegmentNodes(addMessageResponse.getSegments());
    List<TreeNode> datatypes = this.getDatatypesNodes(addMessageResponse.getDatatypesMap());

    List<TreeNode> valueSets = this.getValueSetNodes(addMessageResponse.getValueSets());
    List<TreeNode> conformancePrfiles =
        this.getConformaneProfile(addMessageResponse.getConformanceProfiles());
    addedNodes.setConformanceProfiles(conformancePrfiles);
    addedNodes.setDatatypes(datatypes);
    addedNodes.setSegments(segments);
    addedNodes.setValueSets(valueSets);

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
    List<TreeNode> datatypes = this.getDatatypesNodes(objects.getDatatypesMap());

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



}
