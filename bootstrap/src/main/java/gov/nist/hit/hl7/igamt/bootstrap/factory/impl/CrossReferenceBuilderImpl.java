//package gov.nist.hit.hl7.igamt.bootstrap.factory.impl;
//
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import gov.nist.hit.hl7.igamt.bootstrap.factory.CrossReferenceBuilder;
//import gov.nist.hit.hl7.igamt.bootstrap.factory.exceptions.ReferenceNotFoundException;
//import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
//import gov.nist.hit.hl7.igamt.common.base.domain.Link;
//import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
//import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
//import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
//import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
//import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
//import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
//import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
//import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
//import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
//import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
//import gov.nist.hit.hl7.igamt.datatype.domain.Component;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.ig.domain.Ig;
//import gov.nist.hit.hl7.igamt.ig.service.IgService;
//import gov.nist.hit.hl7.igamt.segment.domain.Field;
//import gov.nist.hit.hl7.igamt.segment.domain.Segment;
//import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
//import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
//import gov.nist.hit.hl7.igamt.xreference.model.DocumentInfo;
//import gov.nist.hit.hl7.igamt.xreference.model.ReferenceType;
//import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;
//import gov.nist.hit.hl7.igamt.xreference.model.ResourceInfo;
//@Service
//public class CrossReferenceBuilderImpl implements CrossReferenceBuilder{
//
//  
//  @Autowired
//  IgService igService;
//  @Autowired
//  ConformanceProfileService conformanceProfileService;
//
//  @Autowired
//  SegmentService segmentService;
//
//  @Autowired
//  DatatypeService datatypeService;
//
//  
//  private HashMap<String, Link> messagesMap;
//  
//  private HashMap<String, Link> segmentsMap;
//
//  private HashMap<String, Link> datatypesMap; 
//
//  private HashMap<String, Link> valueSetsMap; 
//
//
//  @Override
//  public void buildReferences() {
//    List<Ig> all=  igService.findAll();
//    
//    for(Ig ig : all) {
//      
//      ResourceInfo documentInfo = createResouceInfo(ig);
//      
//      fillMaps(ig);
//      processRegistries(ig,documentInfo);
//      
//    }
//    
//  }
//
//  private void processRegistries(Ig ig, ResourceInfo documentInfo) {
//    // TODO Auto-generated method stub
//    messagesMap=new HashMap<String, Link>();
//    
//    segmentsMap=new HashMap<String, Link>();
//
//    datatypesMap=new HashMap<String, Link>();
//
//    valueSetsMap=new HashMap<String, Link>();
//    fillMaps(ig);
//    processConformanceProfileRegistry(ig.getConformanceProfileRegistry(),documentInfo);
//    processSegmentRegistry(ig.getSegmentRegistry(),documentInfo);
//    processDatatypeRegistry(ig.getDatatypeRegistry(),documentInfo);
//    
//  }
//
//  private void processDatatypeRegistry(DatatypeRegistry datatypeRegistry,ResourceInfo documentInfo) {
//    
//    
//    
//  }
//
//  private void processSegmentRegistry(SegmentRegistry segmentRegistry,ResourceInfo documentInfo) {
//    // TODO Auto-generated method stub
//    
//    
//  }
//  
//  private void processConformanceProfileRegistry(
//      ConformanceProfileRegistry conformanceProfileRegistry, ResourceInfo documentInfo) {
//    // TODO Auto-generated method stub
//   
//  }
//
//  private void fillMaps(Ig ig) {
//    // TODO Auto-generated method stub
//    for(Link l : ig.getConformanceProfileRegistry().getChildren()) {
//      this.messagesMap.put(l.getId(), l);
//      
//    }
//    for(Link l : ig.getSegmentRegistry().getChildren()) {
//      this.segmentsMap.put(l.getId(), l);
//      
//    }
//    for(Link l : ig.getDatatypeRegistry().getChildren()) {
//      this.datatypesMap.put(l.getId(), l);
//      
//    }
//    for(Link l : ig.getValueSetRegistry().getChildren()) {
//      this.valueSetsMap.put(l.getId(), l);
//      
//    }
//        
//  }
//
//  private ResourceInfo createResouceInfo(AbstractDomain ig) {
//    // TODO Auto-generated method stub
//    ResourceInfo documentInfo= new ResourceInfo();
//    documentInfo.setDomainInfo(ig.getDomainInfo());
//    documentInfo.setUsername(ig.getUsername());
//    documentInfo.setType(ig.getType());
//    return documentInfo;    
//  }
//  
//  
//  private Set<ResourceInfo> processBinding(ResourceBinding binding) throws ReferenceNotFoundException {
//    // TODO Auto-generated method stub
//    Set<ResourceInfo> usedVs=new HashSet<ResourceInfo>();
//    if (binding.getChildren() != null) {
//      for (StructureElementBinding child : binding.getChildren()) {
//        if (child.getValuesetBindings() != null) {
//          for (ValuesetBinding vs : child.getValuesetBindings()) {
//            if (vs.getValuesetId() != null) {
//              if(this.valueSetsMap.containsKey(this.valueSetsMap.get(vs.getValuesetId()))) {
//              usedVs.add(createResourceInfoFromLink(this.valueSetsMap.get(vs.getValuesetId())));
//              }else {
//                throw new ReferenceNotFoundException("Value Set with ID "+vs.getValuesetId() +"is missing form the VS library");
//              }
//            }
//          }
//        }
//      }
//    }
//    return usedVs;
//  }
//
//  private ResourceInfo createResourceInfoFromLink(Link l) {
//    // TODO Auto-generated method stub
//
//    ResourceInfo info = new ResourceInfo();
//    info.setDomainInfo(l.getDomainInfo());
//    info.setType(l.getType());
//    info.setUsername(l.getUsername());
//    info.setId(l.getId());
//
//    return info;
//    
//  }
//  
//  
//  private void processMessage(ConformanceProfile cp, DocumentInfo document) throws ReferenceNotFoundException {
//    // TODO Auto-generated method stub
//    ResourceInfo uses = createResouceInfo(cp);
//    for (MsgStructElement segOrgroup : cp.getChildren()) {
//      if (segOrgroup instanceof SegmentRef) {
//        SegmentRef ref = (SegmentRef) segOrgroup;
//        if (ref.getRef() != null && ref.getRef().getId() != null) {
//          if(this.segmentsMap.containsKey(ref.getRef().getId())) {
//            
//            ResourceInfo usedBy= createResourceInfoFromLink(segmentsMap.get(ref.getRef().getId()));
//            RelationShip relation = new RelationShip(uses, usedBy, ReferenceType.STRUCTURE, document, ref.getPosition()+"");
//            
//            
//          }else {
//           throw new ReferenceNotFoundException("Segment with ID "+ref.getRef().getId() +"is missing form the library");
//          }
//        }
//      } else {
//        processSegmentOrGroup(segOrgroup,document,uses,"");
//      }
//    }
//  }
//  
//  
//
//  private void processSegmentOrGroup(MsgStructElement segOrgroup, DocumentInfo document,ResourceInfo uses, String path) throws ReferenceNotFoundException {
//    // TODO Auto-generated method stub
//    if (segOrgroup instanceof SegmentRef) {
//      SegmentRef ref = (SegmentRef) segOrgroup;
//      if (ref.getRef() != null && ref.getRef().getId() != null) {
//        if(this.segmentsMap.containsKey(ref.getRef().getId())) {
//
//          ResourceInfo usedBy= createResourceInfoFromLink(segmentsMap.get(ref.getRef().getId()));
//          RelationShip relation = new RelationShip(uses, usedBy, ReferenceType.STRUCTURE, document, path+"."+ref.getPosition());
//        }else {
//         throw new ReferenceNotFoundException("Segment with ID "+ref.getRef().getId() +"is missing form the library");
//        }
//      }
//    } else if (segOrgroup instanceof Group) {
//      Group g = (Group) segOrgroup;
//      for (MsgStructElement child : g.getChildren()) {
//        processSegmentOrGroup(child,document,uses,path);
//      }
//    }
//  }
//  
//  private Set<ResourceInfo> processDatatype(Datatype d) throws ReferenceNotFoundException {
//    Set<ResourceInfo> used = new HashSet<ResourceInfo>();
//    if(d instanceof ComplexDatatype) {
//      ComplexDatatype complex= (ComplexDatatype)d;
//      for(Component c : complex.getComponents()) {
//        if(c.getRef() !=null && c.getRef().getId() !=null) {
//          if(this.datatypesMap.containsKey(c.getRef().getId())) {
//            used.add(createResourceInfoFromLink(datatypesMap.get(c.getRef().getId())));
//            }
//          throw new ReferenceNotFoundException("Datatype with ID "+c.getRef().getId() +"is missing form the library");
//          }
//      }
//    }
//    return used;
//  }
//  
//  private Set<ResourceInfo> processSegment(Segment s) throws ReferenceNotFoundException {
//    Set<ResourceInfo> used = new HashSet<ResourceInfo>();
//      for(Field f : s.getChildren()) {
//        if(f.getRef() !=null && f.getRef().getId() !=null) {
//          if(this.datatypesMap.containsKey(f.getRef().getId())) {
//            used.add(createResourceInfoFromLink(datatypesMap.get(f.getRef().getId())));
//             }
//          throw new ReferenceNotFoundException("Datatype with ID "+f.getRef().getId() +"is missing form the library");
//          }
//      }
//      return used;
//  }
//}
