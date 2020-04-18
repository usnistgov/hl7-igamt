package gov.nist.hit.hl7.igamt.common.binding.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;

@Service
public class BindingServiceImpl implements BindingService {

  @Override
  public Set<RelationShip> collectDependencies(ReferenceIndentifier parent, ResourceBinding binding,
      HashMap<String, Usage> usageMap) {
    // TODO Auto-generated method stub

    Set<RelationShip> used = new HashSet<RelationShip>();
    processBindingStructure(parent, binding, used, usageMap);
    return used;

  }

  private void processBindingStructure(ReferenceIndentifier parent, ResourceBinding binding, Set<RelationShip> used,
      HashMap<String, Usage> usageMap) {
    // TODO Auto-generated method stub

    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        processChildStructureBinding(parent, child, used, null, usageMap.get(child.getElementId()));
      }
    }
  }

  private void processChildStructureBinding(ReferenceIndentifier parent, StructureElementBinding binding,
      Set<RelationShip> used, String path, Usage usage) {

    String location = processLocation(path, binding.getLocationInfo());

    if (binding.getValuesetBindings() != null) {
      for (ValuesetBinding vs : binding.getValuesetBindings()) {
        if(vs.getValueSets() !=null) {
          for(String s: vs.getValueSets()) {
            RelationShip rel = new RelationShip(new ReferenceIndentifier(s, Type.VALUESET),
                parent,new ReferenceLocation(getSubtypeTypeFromParent(parent.getType()), location, binding.getLocationInfo().getName()));
            rel.setUsage(usage);
            used.add(rel);
          }
        }
      }
    }

    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        processChildStructureBinding(parent, child, used, location, usage);
      }
    }

  }

  private Type getSubtypeTypeFromParent(Type type) {
    // TODO Auto-generated method stub
    switch(type) {
      case CONFORMANCEPROFILE:
        return Type.SEGMENTREF;
      case DATATYPE:
        return Type.COMPONENT;
      case PROFILECOMPONENT:
        break;
      case SEGMENT:
        return Type.FIELD;
      default:
        break;
    }
    return null;
  }

  private String processLocation(String path, LocationInfo locationInfo) {
    // TODO Auto-generated method stub
    String location = "";
    if (locationInfo != null) {
      if (path == null) {
        location += locationInfo.getPosition();
      } else {
        location = path + "." + locationInfo.getPosition();
      }
    }
    return location;
  }

  @Override
  public Set<String> processBinding(ResourceBinding binding) {
    // TODO Auto-generated method stub
    Set<String> vauleSetIds = new HashSet<String>();
    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {

        if (child.getValuesetBindings() != null) {
          for (ValuesetBinding vs : child.getValuesetBindings()) {
            if(vs.getValueSets() !=null) {
              for(String s: vs.getValueSets()) {
                vauleSetIds.add(s);
              }
            }
          }
        }
        if (child.getChildren() != null && !child.getChildren().isEmpty()) {
          processStructureElementBinding(child, vauleSetIds);
        }
      }
    }
    return vauleSetIds;
  }

  private void processStructureElementBinding(StructureElementBinding structureElementBinding,
      Set<String> vauleSetIds) {
    // TODO Auto-generated method stub

    for (StructureElementBinding child : structureElementBinding.getChildren()) {

      if (child.getValuesetBindings() != null) {
        for (ValuesetBinding vs : child.getValuesetBindings()) {
          if(vs.getValueSets() != null) {
            for(String s: vs.getValueSets()) {
              vauleSetIds.add(s);
            }
          }
        }
      }
      if (child.getChildren() != null && !child.getChildren().isEmpty()) {
        processStructureElementBinding(child, vauleSetIds);
      }
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.common.binding.service.BindingService#substitute(gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding, java.util.HashMap)
   */
  @Override
  public void substitute(ResourceBinding binding, HashMap<RealKey, String> newKeys) {
	  if (binding.getConformanceStatementIds() != null) {
		  Set<String> newIds = new HashSet<String>();
		  
		  for(String oldId:binding.getConformanceStatementIds()) {
			  String newId = newKeys.get(new RealKey(oldId,Type.CONFORMANCESTATEMENT));
			  if(newId != null) newIds.add(newId);
		  }
		  
		  binding.setConformanceStatementIds(newIds);
	  }
	  if(binding.getChildren() !=null ) {
		  for (StructureElementBinding child : binding.getChildren() ) {
			  processAndSubstitute(child, newKeys);
		  }
	  }
  }

  /**
   * @param child
   * @param valuesetsMap
   */
  private void processAndSubstitute(StructureElementBinding elm, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub
    if(elm.getValuesetBindings() !=null) {
      for(ValuesetBinding vs: elm.getValuesetBindings()) {
        if(vs.getValueSets() !=null) {
          List<String> newVs = new ArrayList<String>();
          for (String s : vs.getValueSets() ) {
            RealKey realKey= new RealKey(s, Type.VALUESET);
            if( newKeys.containsKey(realKey)) {
              newVs.add(newKeys.get(realKey));
            }
          }
          vs.setValueSets(newVs);

        }
      }     
    }
    if(elm.getInternalSingleCode() !=null) {
      if(elm.getInternalSingleCode().getValueSetId() !=null) {
        RealKey realKey= new RealKey(elm.getInternalSingleCode().getValueSetId(), Type.VALUESET);
        if(newKeys.containsKey(realKey)) {
          elm.getInternalSingleCode().setValueSetId(newKeys.get(realKey));
        }
      }
    }
    if(elm.getPredicateId() != null) {
    	if(newKeys.containsKey(new RealKey(elm.getPredicateId(), Type.PREDICATE))) {
    		elm.setPredicateId(newKeys.get(new RealKey(elm.getPredicateId(), Type.PREDICATE)));
    	}
    }
    if(elm.getChildren() !=null) { 
      for (StructureElementBinding child: elm.getChildren()) {
        processAndSubstitute(child, newKeys);
      }
    }
  }
}
