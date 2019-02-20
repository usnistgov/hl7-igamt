package gov.nist.hit.hl7.igamt.common.binding.service.impl;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;

public class BindingServiceImpl implements BindingService {

	@Override
	public Set<RelationShip> collectDependencies(ReferenceIndentifier parent, ResourceBinding binding) {
		// TODO Auto-generated method stub
		
		Set<RelationShip> used = new HashSet<RelationShip>();
		
		if(binding.getConformanceStatementIds()!=null) {
			for(String id :binding.getConformanceStatementIds()) {
				used.add(new RelationShip(new ReferenceIndentifier(id,Type.CONFORMANCESTATEMENT), parent, ""));
			}
		}
		processBindingStructure(parent,binding, used);
		return used;
		
	}
	
	
	
	  private void processBindingStructure(ReferenceIndentifier parent, ResourceBinding binding, Set<RelationShip> used) {
		    // TODO Auto-generated method stub
		  
	       if(binding.getChildren() !=null) {
       		for(StructureElementBinding child: binding.getChildren() ) {
       			processChildStructureBinding( parent, child,  used, null);
       			}
      
	       }
		 
		  	
	  }
	  
	  
	  private void processChildStructureBinding(ReferenceIndentifier parent, StructureElementBinding binding, Set<RelationShip> used, String path){
		  
			  String location = processLocation(path, binding.getLocationInfo());
		        if (binding.getValuesetBindings() != null) {
		          for (ValuesetBinding vs : binding.getValuesetBindings()) {
		            if (vs.getValuesetId() != null) {
						used.add(new RelationShip(new ReferenceIndentifier(vs.getValuesetId(),Type.VALUESET), parent, location));
		            }
		          }
		        }
		        if(binding.getPredicateId()!=null) {
					used.add(new RelationShip(new ReferenceIndentifier(binding.getPredicateId(),Type.PREDICATE), parent, location));

		       }
		        if(binding.getChildren() !=null) {
		        		for(StructureElementBinding child: binding.getChildren() ) {
		        			processChildStructureBinding( parent, child,  used, location);
		        		}
		       
		       }
		  
	}



	private String processLocation(String path ,LocationInfo locationInfo) {
		// TODO Auto-generated method stub
		String location="";
		if(locationInfo!=null) {
			if(path==null) {
				location += locationInfo.getPosition();
			}else {
				 location=path+"."+locationInfo.getPosition();
			}

		}
		return location;

		}
	

}
