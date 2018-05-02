/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.segment.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.CommentDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.ComponentDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.ComponentDisplayData;
import gov.nist.hit.hl7.igamt.segment.domain.display.DatatypeDisplayLink;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplayData;
import gov.nist.hit.hl7.igamt.segment.domain.display.Level;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentMetadata;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPostDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPreDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.domain.display.SubComponentDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.SubComponentDisplayData;
import gov.nist.hit.hl7.igamt.segment.domain.display.ValueSetDisplayLink;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Field;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.binding.Comment;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */

@Service("segmentService")
public class SegmentServiceImpl implements SegmentService {

  @Autowired
  private SegmentRepository segmentRepository;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valueSetService;

  @Override
  public Segment findByKey(CompositeKey key) {
    return segmentRepository.findOne(key);
  }

  @Override
  public Segment create(Segment segment) {
    segment.setId(new CompositeKey());
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public Segment save(Segment segment) {
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public List<Segment> findAll() {
    return segmentRepository.findAll();
  }

  @Override
  public void delete(Segment segment) {
    segmentRepository.delete(segment);
  }

  @Override
  public void delete(CompositeKey key) {
    segmentRepository.delete(key);
  }

  @Override
  public void removeCollection() {
    segmentRepository.deleteAll();
  }

  @Override
  public List<Segment> findByDomainInfoVersion(String version) {
    return segmentRepository.findByDomainInfoVersion(version);
  }

  @Override
  public List<Segment> findByDomainInfoScope(String scope) {
    return findByDomainInfoScope(scope);
  }

  @Override
  public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String version) {
    return segmentRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, version);
  }

  @Override
  public List<Segment> findByName(String name) {
    return segmentRepository.findByName(name);
  }

  @Override
  public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name) {
    return segmentRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope, version, name);
  }

  @Override
  public List<Segment> findByDomainInfoVersionAndName(String version, String name) {
    return segmentRepository.findByDomainInfoVersionAndName(version, name);
  }

  @Override
  public List<Segment> findByDomainInfoScopeAndName(String scope, String name) {
    return segmentRepository.findByDomainInfoScopeAndName(scope, name);
  }

  @Override
  public SegmentStructure convertDomainToStructure(Segment segment) {
    if (segment != null) {
      SegmentStructure result = new SegmentStructure();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }
      HashMap<String, StructureElementBinding> segmentBindingMap =
          new HashMap<String, StructureElementBinding>();
      if (segment.getBinding() != null && segment.getBinding().getChildren() != null) {
        this.travelBinding(segment.getBinding().getChildren(), segmentBindingMap, null);
      }

      if (segment.getChildren() != null && segment.getChildren().size() > 0) {
        for (Field f : segment.getChildren()) {
          FieldDisplayData fieldDisplayData = new FieldDisplayData();
          fieldDisplayData.setConfLength(f.getConfLength());
          fieldDisplayData.setCustom(f.isCustom());
          fieldDisplayData.setId(f.getId());
          fieldDisplayData.setName(f.getName());
          fieldDisplayData.setMax(f.getMax());
          fieldDisplayData.setMaxLength(f.getMaxLength());
          fieldDisplayData.setMin(f.getMin());
          fieldDisplayData.setMinLength(f.getMinLength());
          fieldDisplayData.setPosition(f.getPosition());
          fieldDisplayData.setType(Type.FIELD);
          fieldDisplayData.setUsage(f.getUsage());
          
          this.setBindingInfo(segmentBindingMap, null, null, fieldDisplayData, null, null);

          Datatype childDT = datatypeService.findLatestById(f.getRef().getId());

          if (Arrays.asList(new String[] {"CE", "CF", "CWE", "CNE", "CSU"})
              .contains(childDT.getName())) {
            fieldDisplayData.setCodedElementDT(true);
            fieldDisplayData.setPossibleMultipleValueSets(true);
          } else {
            fieldDisplayData.setCodedElementDT(false);
            fieldDisplayData.setPossibleMultipleValueSets(false);
          }

          if (Arrays.asList(new String[] {"ID", "IS", "CE", "CF", "CWE", "CNE", "CSU", "HD"})
              .contains(childDT.getName()))
            fieldDisplayData.setPossibleSingleCodeValueSet(true);
          else if (segment.getName().equals("PID") && f.getPosition() == 23)
            fieldDisplayData.setPossibleSingleCodeValueSet(true);
          else
            fieldDisplayData.setPossibleSingleCodeValueSet(false);

          if (!fieldDisplayData.isPossibleSingleCodeValueSet()) {
            if (childDT instanceof ComplexDatatype) {
              fieldDisplayData.setPossibleConstantValue(false);
            } else {
              fieldDisplayData.setPossibleConstantValue(true);
            }
          } else {
            fieldDisplayData.setPossibleConstantValue(false);
          }

          DatatypeDisplayLink fieldDTLink = new DatatypeDisplayLink();
          fieldDTLink.setId(childDT.getId().getId());
          fieldDTLink.setName(childDT.getName());
          if (childDT.getExt() != null) {
            fieldDTLink.setLabel(childDT.getName() + childDT.getExt());
          } else {
            fieldDTLink.setLabel(childDT.getName());
          }
          fieldDTLink.setScope(childDT.getDomainInfo().getScope());
          fieldDTLink.setVersion(childDT.getDomainInfo().getVersion());
          fieldDisplayData.setDatatype(fieldDTLink);
          
          FieldDisplay fieldDisplay = new FieldDisplay();
          fieldDisplay.setData(fieldDisplayData);
          result.addChild(fieldDisplay);

          HashMap<String, StructureElementBinding> fieldDTBindingMap = new HashMap<String, StructureElementBinding>();
          if (childDT.getBinding() != null && childDT.getBinding().getChildren() != null) {
            this.travelBinding(childDT.getBinding().getChildren(), fieldDTBindingMap, null);
          }

          if (childDT instanceof ComplexDatatype) {
            ComplexDatatype componentDT = (ComplexDatatype) childDT;
            if (componentDT.getComponents() != null && componentDT.getComponents().size() > 0) {
              for (Component c : componentDT.getComponents()) {
                ComponentDisplayData componentDisplayData = new ComponentDisplayData();
                componentDisplayData.setConfLength(c.getConfLength());
                componentDisplayData.setCustom(c.isCustom());
                componentDisplayData.setId(c.getId());
                componentDisplayData.setName(c.getName());
                componentDisplayData.setMaxLength(c.getMaxLength());
                componentDisplayData.setMinLength(c.getMinLength());
                componentDisplayData.setPosition(c.getPosition());
                componentDisplayData.setType(Type.COMPONENT);
                componentDisplayData.setUsage(c.getUsage());
                
                this.setBindingInfo(segmentBindingMap, fieldDTBindingMap, null, fieldDisplayData, componentDisplayData, null);
                
                Datatype childchildDT = datatypeService.findLatestById(c.getRef().getId());
                DatatypeDisplayLink componentDTLink = new DatatypeDisplayLink();
                componentDTLink.setId(childchildDT.getId().getId());
                componentDTLink.setName(childchildDT.getName());
                if (childchildDT.getExt() != null) {
                  componentDTLink.setLabel(childchildDT.getName() + childchildDT.getExt());
                } else {
                  componentDTLink.setLabel(childchildDT.getName());
                }
                componentDTLink.setScope(childchildDT.getDomainInfo().getScope());
                componentDTLink.setVersion(childchildDT.getDomainInfo().getVersion());
                componentDisplayData.setDatatype(componentDTLink);
                ComponentDisplay componentDisplay = new ComponentDisplay();
                componentDisplay.setData(componentDisplayData);
                fieldDisplay.addChild(componentDisplay);

                HashMap<String, StructureElementBinding> componentDTBindingMap =
                    new HashMap<String, StructureElementBinding>();
                if (childchildDT.getBinding() != null && childchildDT.getBinding().getChildren() != null) {
                  this.travelBinding(childchildDT.getBinding().getChildren(), componentDTBindingMap, null);
                }

                if (childchildDT instanceof ComplexDatatype) {
                  ComplexDatatype subComponentDT = (ComplexDatatype) childchildDT;
                  if (subComponentDT.getComponents() != null
                      && subComponentDT.getComponents().size() > 0) {
                    for (Component sc : subComponentDT.getComponents()) {
                      SubComponentDisplayData subComponentDisplayData = new SubComponentDisplayData();
                      subComponentDisplayData.setConfLength(sc.getConfLength());
                      subComponentDisplayData.setCustom(sc.isCustom());
                      subComponentDisplayData.setId(sc.getId());
                      subComponentDisplayData.setName(sc.getName());
                      subComponentDisplayData.setMaxLength(sc.getMaxLength());
                      subComponentDisplayData.setMinLength(sc.getMinLength());
                      subComponentDisplayData.setPosition(sc.getPosition());
                      subComponentDisplayData.setType(Type.SUBCOMPONENT);
                      subComponentDisplayData.setUsage(sc.getUsage());
                      
                      this.setBindingInfo(segmentBindingMap, fieldDTBindingMap, componentDTBindingMap, fieldDisplayData, componentDisplayData, subComponentDisplayData);
                      
                      Datatype childchildchildDT =
                          datatypeService.findLatestById(sc.getRef().getId());
                      DatatypeDisplayLink subComponentDTLink = new DatatypeDisplayLink();
                      subComponentDTLink.setId(childchildchildDT.getId().getId());
                      subComponentDTLink.setName(childchildchildDT.getName());
                      if (childchildchildDT.getExt() != null) {
                        subComponentDTLink
                            .setLabel(childchildchildDT.getName() + childchildchildDT.getExt());
                      } else {
                        subComponentDTLink.setLabel(childchildchildDT.getName());
                      }
                      subComponentDTLink.setScope(childchildchildDT.getDomainInfo().getScope());
                      subComponentDTLink.setVersion(childchildchildDT.getDomainInfo().getVersion());
                      subComponentDisplayData.setDatatype(subComponentDTLink);
                      SubComponentDisplay subComponentDisplay = new SubComponentDisplay();
                      subComponentDisplay.setData(subComponentDisplayData);
                      componentDisplay.addChild(subComponentDisplay);
                    }
                  }
                }
              }
            }
          }
        }
      }
      return result;
    }
    return null;
  }

  private void setBindingInfo(HashMap<String, StructureElementBinding> segmentBindingMap, HashMap<String, StructureElementBinding> fieldDTBindingMap, HashMap<String, StructureElementBinding> componentDTBindingMap, 
                              FieldDisplayData fieldDisplay, ComponentDisplayData componentDisplay, SubComponentDisplayData subComponentDisplay) {
    String fieldIDPath = null;
    String componentIDPath = null;
    String subComponentIDPath = null;
    if(fieldDisplay != null) {
      fieldIDPath = fieldDisplay.getId();
    }
    if(componentDisplay != null) {
      fieldIDPath = fieldIDPath + "-" + componentDisplay.getId();
      componentIDPath = componentDisplay.getId();
    }
    if(subComponentDisplay != null) {
      fieldIDPath = fieldIDPath + "-" +subComponentDisplay.getId();
      componentIDPath = componentIDPath + subComponentDisplay.getId();
      subComponentIDPath = subComponentDisplay.getId();
    }
    
    if(componentDTBindingMap != null && subComponentIDPath != null) {
      if (componentDTBindingMap.get(subComponentIDPath) != null) {
        if(componentDTBindingMap.get(subComponentIDPath).getComments() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) {
            for(Comment c: componentDTBindingMap.get(subComponentIDPath).getComments() ) {
              subComponentDisplay.addComment(new CommentDisplay(c, Level.COMPONENTDATATYPE));
            }
          }
        }
        
        if(componentDTBindingMap.get(subComponentIDPath).getConstantValue() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setConstantValue(componentDTBindingMap.get(subComponentIDPath).getConstantValue());
        }
        
        if(componentDTBindingMap.get(subComponentIDPath).getExternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setExternalSingleCode(componentDTBindingMap.get(subComponentIDPath).getExternalSingleCode());
        }
        
        if(componentDTBindingMap.get(subComponentIDPath).getInternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setInternalSingleCode(componentDTBindingMap.get(subComponentIDPath).getInternalSingleCode());
        }
        
        if(componentDTBindingMap.get(subComponentIDPath).getValuesetBindings() != null) {
          for(ValuesetBinding b : componentDTBindingMap.get(subComponentIDPath).getValuesetBindings()){
            Valueset vs = valueSetService.findLatestById(b.getValuesetId());
            if(vs != null) {
              ValueSetDisplayLink valueSetDisplayLink = new ValueSetDisplayLink();
              valueSetDisplayLink.setBindingIdentifier(vs.getBindingIdentifier());
              valueSetDisplayLink.setId(vs.getId().getId());
              valueSetDisplayLink.setScope(vs.getDomainInfo().getScope());
              valueSetDisplayLink.setVersion(vs.getDomainInfo().getVersion());
              valueSetDisplayLink.setLevel(Level.COMPONENTDATATYPE);
              if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.addValueSet(valueSetDisplayLink);
            }
          }
        }
        
        if(componentDTBindingMap.get(subComponentIDPath).getPredicate() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setPredicate(componentDTBindingMap.get(subComponentIDPath).getPredicate());
        }
      }
    }
    
    if(fieldDTBindingMap != null && componentIDPath != null) {
      if (fieldDTBindingMap.get(componentIDPath) != null) {
        if(fieldDTBindingMap.get(componentIDPath).getComments() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) {
            for(Comment c: fieldDTBindingMap.get(componentIDPath).getComments() ) {
              componentDisplay.addComment(new CommentDisplay(c, Level.FIELDDATATYPE));
            }
          }
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) {
            for(Comment c: fieldDTBindingMap.get(componentIDPath).getComments() ) {
              subComponentDisplay.addComment(new CommentDisplay(c, Level.FIELDDATATYPE));
            }
          }
        }
        
        if(fieldDTBindingMap.get(componentIDPath).getConstantValue() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setConstantValue(fieldDTBindingMap.get(componentIDPath).getConstantValue());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setConstantValue(fieldDTBindingMap.get(componentIDPath).getConstantValue());
        }
        
        if(fieldDTBindingMap.get(componentIDPath).getExternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setExternalSingleCode(fieldDTBindingMap.get(componentIDPath).getExternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setExternalSingleCode(fieldDTBindingMap.get(componentIDPath).getExternalSingleCode());
        }
        
        if(fieldDTBindingMap.get(componentIDPath).getInternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setInternalSingleCode(fieldDTBindingMap.get(componentIDPath).getInternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setInternalSingleCode(fieldDTBindingMap.get(componentIDPath).getInternalSingleCode());
        }
        
        if(fieldDTBindingMap.get(componentIDPath).getValuesetBindings() != null) {
          for(ValuesetBinding b : fieldDTBindingMap.get(componentIDPath).getValuesetBindings()){
            Valueset vs = valueSetService.findLatestById(b.getValuesetId());
            if(vs != null) {
              ValueSetDisplayLink valueSetDisplayLink = new ValueSetDisplayLink();
              valueSetDisplayLink.setBindingIdentifier(vs.getBindingIdentifier());
              valueSetDisplayLink.setId(vs.getId().getId());
              valueSetDisplayLink.setScope(vs.getDomainInfo().getScope());
              valueSetDisplayLink.setVersion(vs.getDomainInfo().getVersion()); 
              valueSetDisplayLink.setLevel(Level.FIELDDATATYPE);
              if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.addValueSet(valueSetDisplayLink);
              if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.addValueSet(valueSetDisplayLink);
            }
          }
        }
        
        if(fieldDTBindingMap.get(componentIDPath).getPredicate() != null) {
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setPredicate(fieldDTBindingMap.get(componentIDPath).getPredicate());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setPredicate(fieldDTBindingMap.get(componentIDPath).getPredicate());
        }
      }
    }
    
    if(segmentBindingMap != null && fieldIDPath != null) {
      if (segmentBindingMap.get(fieldIDPath) != null) {
        if(segmentBindingMap.get(fieldIDPath).getComments() != null) {
          if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) {
            for(Comment c: segmentBindingMap.get(fieldIDPath).getComments() ) {
              fieldDisplay.addComment(new CommentDisplay(c, Level.SEGMENT));
            }
          }
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) {
            for(Comment c: segmentBindingMap.get(fieldIDPath).getComments() ) {
              componentDisplay.addComment(new CommentDisplay(c, Level.SEGMENT));
            }
          }
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) {
            for(Comment c: segmentBindingMap.get(fieldIDPath).getComments() ) {
              subComponentDisplay.addComment(new CommentDisplay(c, Level.SEGMENT));
            }
          }
        }
        
        if(segmentBindingMap.get(fieldIDPath).getConstantValue() != null) {
          if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) fieldDisplay.setConstantValue(segmentBindingMap.get(fieldIDPath).getConstantValue());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setConstantValue(segmentBindingMap.get(fieldIDPath).getConstantValue());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setConstantValue(segmentBindingMap.get(fieldIDPath).getConstantValue());
        }
        
        if(segmentBindingMap.get(fieldIDPath).getExternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) fieldDisplay.setExternalSingleCode(segmentBindingMap.get(fieldIDPath).getExternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setExternalSingleCode(segmentBindingMap.get(fieldIDPath).getExternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setExternalSingleCode(segmentBindingMap.get(fieldIDPath).getExternalSingleCode());
        }
        
        if(segmentBindingMap.get(fieldIDPath).getInternalSingleCode() != null) {
          if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) fieldDisplay.setInternalSingleCode(segmentBindingMap.get(fieldIDPath).getInternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setInternalSingleCode(segmentBindingMap.get(fieldIDPath).getInternalSingleCode());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setInternalSingleCode(segmentBindingMap.get(fieldIDPath).getInternalSingleCode());
        }
        
        if(segmentBindingMap.get(fieldIDPath).getValuesetBindings() != null) {
          for(ValuesetBinding b : segmentBindingMap.get(fieldIDPath).getValuesetBindings()){
            Valueset vs = valueSetService.findLatestById(b.getValuesetId());
            if(vs != null) {
              ValueSetDisplayLink valueSetDisplayLink = new ValueSetDisplayLink();
              valueSetDisplayLink.setBindingIdentifier(vs.getBindingIdentifier());
              valueSetDisplayLink.setId(vs.getId().getId());
              valueSetDisplayLink.setScope(vs.getDomainInfo().getScope());
              valueSetDisplayLink.setVersion(vs.getDomainInfo().getVersion()); 
              valueSetDisplayLink.setLevel(Level.SEGMENT);
              if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) fieldDisplay.addValueSet(valueSetDisplayLink);
              if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.addValueSet(valueSetDisplayLink);
              if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.addValueSet(valueSetDisplayLink);
            }
          }
        }
        
        if(segmentBindingMap.get(fieldIDPath).getPredicate() != null) {
          if(fieldDisplay != null && componentDisplay == null && subComponentDisplay == null) fieldDisplay.setPredicate(segmentBindingMap.get(fieldIDPath).getPredicate());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay == null) componentDisplay.setPredicate(segmentBindingMap.get(fieldIDPath).getPredicate());
          if(fieldDisplay != null && componentDisplay != null && subComponentDisplay != null) subComponentDisplay.setPredicate(segmentBindingMap.get(fieldIDPath).getPredicate());
        }
      }
    }
  }

  private void travelBinding(Set<StructureElementBinding> bindings, HashMap<String, StructureElementBinding> bindingMap, String parentIdPath) {
    if(bindings != null) {
      for (StructureElementBinding b : bindings) {
        if(parentIdPath == null) {
          bindingMap.put(b.getElementId(), b);
          this.travelBinding(b.getChildren(), bindingMap, b.getElementId());
        }else {
          bindingMap.put(parentIdPath + "-" + b.getElementId(), b);
          this.travelBinding(b.getChildren(), bindingMap, parentIdPath + "-" + b.getElementId());
        }        
      }  
    }
  }

  @Override
  public Segment findLatestById(String id) {
    Segment segment = segmentRepository
        .findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version")).get(0);
    return segment;
  }

  @Override
  public SegmentMetadata convertDomainToMetadata(Segment segment) {
    if (segment != null) {
      SegmentMetadata result = new SegmentMetadata();
      result.setAuthorNote(segment.getComment());
      result.setDescription(segment.getDescription());
      result.setExt(segment.getExt());
      result.setId(segment.getId());
      result.setName(segment.getName());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      return result;
    }
    return null;
  }

  @Override
  public SegmentPreDef convertDomainToPredef(Segment segment) {
    if (segment != null) {
      SegmentPreDef result = new SegmentPreDef();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }
      result.setPreDef(segment.getPreDef());
      return result;
    }
    return null;
  }

  @Override
  public SegmentPostDef convertDomainToPostdef(Segment segment) {
    if (segment != null) {
      SegmentPostDef result = new SegmentPostDef();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }
      result.setPostDef(segment.getPreDef());
      return result;
    }
    return null;
  }

}
