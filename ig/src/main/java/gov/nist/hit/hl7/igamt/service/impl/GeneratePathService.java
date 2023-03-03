package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Service
public class GeneratePathService {

    @Autowired
    DatatypeService datatypeService;

    @Autowired
    SegmentService segmentService;

    @Autowired
    ValuesetService valuesetService;

    @Autowired
    InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

    @Autowired
    ConformanceProfileService conformanceProfileService;

    public InstancePath getInstancePath(String pathId, String instance) {
        if(Strings.isNullOrEmpty(pathId)) {
            return null;
        }

        InstancePath instancePath = new InstancePath();
        instancePath.setInstanceParameter(instance);
        if(pathId.contains("-")) {
            instancePath.setElementId(pathId.substring(0, pathId.indexOf('-')));
            instancePath.setChild(getInstancePath(pathId.substring(pathId.indexOf('-') + 1), instance));
        } else {
            instancePath.setElementId(pathId);
        }

        return instancePath;
    }


    public String generatePath(InstancePath path, String targetId, Level level, InstancePath context) {
        List<String> result = new ArrayList<String>();
        if (level.equals(Level.DATATYPE)) {
            Datatype target = this.datatypeService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, ComplexDatatype.class);
            }

            if (target != null) {
                if (path != null)
                    this.visitComponent(target, path, result);
            }
        } else if (level.equals(Level.SEGMENT)) {
            Segment target = this.segmentService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, Segment.class);
            }
            if (target != null) {
                if (path != null)
                    this.visitField(target, path, result);
            }
        } else if (level.equals(Level.GROUP)) {
            ConformanceProfile cp = this.conformanceProfileService.findById(targetId);
            if(cp == null) {
                cp = this.inMemoryDomainExtensionService.findById(targetId, ConformanceProfile.class);
            }
            Group target = this.findGroupByContext(context, cp.getChildren());
            if (target != null) {
                if (path != null)
                    this.visitSegOrGroup(target.getChildren(), path, result);
            }
        } else if (level.equals(Level.CONFORMANCEPROFILE)) {
            ConformanceProfile target = this.conformanceProfileService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, ConformanceProfile.class);
            }
            if (target != null) {
                if (path != null)
                    this.visitSegOrGroup(target.getChildren(), path, result);
            }
        }
        return String.join(".", result);
    }

    private void visitSegOrGroup(Set<SegmentRefOrGroup> segOrGroups, InstancePath child,
                                 List<String> result) {
        for (SegmentRefOrGroup segOrGroup : segOrGroups) {
            if (child.getElementId().equals(segOrGroup.getId())) {
                if (!segOrGroup.getMax().equals("0") && !segOrGroup.getMax().equals("1"))
                    result.add(segOrGroup.getPosition() + "[*]");
                else
                    result.add(segOrGroup.getPosition() + "[1]");
                if (segOrGroup instanceof SegmentRef) {
                    Segment childSeg =
                            this.segmentService.findById(((SegmentRef) segOrGroup).getRef().getId());
                    if (child.getChild() != null)
                        this.visitField(childSeg, child.getChild(), result);
                } else if (segOrGroup instanceof Group) {
                    if (child.getChild() != null)
                        this.visitSegOrGroup(((Group) segOrGroup).getChildren(), child.getChild(), result);
                }
            }
        }
    }


    private Group findGroupByContext(InstancePath context, Set<SegmentRefOrGroup> set) {
        for (SegmentRefOrGroup srog : set) {
            if (srog.getId().equals(context.getElementId())) {
                if (context.getChild() == null)
                    return (Group) srog;
                else
                    return findGroupByContext(context.getChild(), ((Group) srog).getChildren());
            }
        }
        return null;
    }


    private void visitField(Segment seg, InstancePath child, List<String> result) {
        for (Field f : seg.getChildren()) {
            if (child.getElementId().equals(f.getId())) {
                if (!f.getMax().equals("0") && !f.getMax().equals("1"))
                    result.add(f.getPosition() + "[*]");
                else
                    result.add(f.getPosition() + "[1]");
                Datatype childDT = this.datatypeService.findById(f.getRef().getId());
                if (child.getChild() != null)
                    this.visitComponent(childDT, child.getChild(), result);
            }
        }
    }


    private void visitComponent(Datatype dt, InstancePath child, List<String> result) {
        if (dt instanceof ComplexDatatype) {
            ComplexDatatype complexDatatype = (ComplexDatatype) dt;
            for (Component c : complexDatatype.getComponents()) {
                if (child.getElementId().equals(c.getId())) {
                    result.add(c.getPosition() + "[1]");
                    Datatype childDT = this.datatypeService.findById(c.getRef().getId());
                    if (child.getChild() != null)
                        this.visitComponent(childDT, child.getChild(), result);
                }
            }
        }
    }

    public String replaceLast(String text, String regex, String replacement) {
        return text.replaceFirst("(?s)"+regex+"(?!.*?"+regex+")", replacement);
    }


	public Subcon generateSubCon(InstancePath path, String targetId, Level level, InstancePath context) {
		if (level.equals(Level.DATATYPE)) {
            Datatype target = this.datatypeService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, ComplexDatatype.class);
            }

            if (target != null) {
                if (path != null)
                    return this.visitComponentSubCon(target, path);
            }
        } else if (level.equals(Level.SEGMENT)) {
            Segment target = this.segmentService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, Segment.class);
            }
            if (target != null) {
                if (path != null)
                    return this.visitFieldSubCon(target, path);
            }
        } else if (level.equals(Level.GROUP)) {
            ConformanceProfile cp = this.conformanceProfileService.findById(targetId);
            if(cp == null) {
                cp = this.inMemoryDomainExtensionService.findById(targetId, ConformanceProfile.class);
            }
            Group target = this.findGroupByContext(context, cp.getChildren());
            if (target != null) {
                if (path != null)
                    return this.visitSegOrGroupSubCon(target.getChildren(), path, context);
            }
        } else if (level.equals(Level.CONFORMANCEPROFILE)) {
            ConformanceProfile target = this.conformanceProfileService.findById(targetId);
            if(target == null) {
                target = this.inMemoryDomainExtensionService.findById(targetId, ConformanceProfile.class);
            }
            if (target != null) {
                if (path != null)
                    return this.visitSegOrGroupSubCon(target.getChildren(), path, context);
            }
        }
		return null;
	}


	private Subcon visitComponentSubCon(Datatype dt, InstancePath child) {
		if (dt instanceof ComplexDatatype) {
            ComplexDatatype complexDatatype = (ComplexDatatype) dt;
            for (Component c : complexDatatype.getComponents()) {
                if (child.getElementId().equals(c.getId())) {
                    Datatype childDT = this.datatypeService.findById(c.getRef().getId());
                    if (child.getChild() != null)
                        return this.visitComponentSubCon(childDT, child.getChild());
                    else {
                    	Subcon result = new Subcon();
                    	result.setLevel(Level.DATATYPE);
                    	result.setTargetId(c.getRef().getId());
                    	return result;
                    }
                }
            }
        }
		
		return null;
	}
	
	private Subcon visitFieldSubCon(Segment seg, InstancePath child) {
        for (Field f : seg.getChildren()) {
            if (child.getElementId().equals(f.getId())) {
                Datatype childDT = this.datatypeService.findById(f.getRef().getId());
                if (child.getChild() != null)
                    this.visitComponentSubCon(childDT, child.getChild());
                else {
                	Subcon result = new Subcon();
                	result.setLevel(Level.DATATYPE);
                	result.setTargetId(f.getRef().getId());
                	return result;
                }
            }
        }
        return null;
    }
	
	
    private Subcon visitSegOrGroupSubCon(Set<SegmentRefOrGroup> segOrGroups, InstancePath child, InstancePath context) {
    	for (SegmentRefOrGroup segOrGroup : segOrGroups) {
    		if (child.getElementId().equals(segOrGroup.getId())) {
    			if (child.getChild() != null) {
    				if (segOrGroup instanceof SegmentRef) {
    					Segment childSeg = this.segmentService.findById(((SegmentRef) segOrGroup).getRef().getId());
    					return this.visitFieldSubCon(childSeg, child.getChild());
    				}else {
    					if(context == null) context = child;
    					context.setChild(child.getChild());
    					return this.visitSegOrGroupSubCon(((Group) segOrGroup).getChildren(), child.getChild(), context);
    				}
    				
    			} else {
    				if (segOrGroup instanceof SegmentRef) {
    					Subcon result = new Subcon();
                    	result.setLevel(Level.SEGMENT);
                    	result.setTargetId(((SegmentRef) segOrGroup).getRef().getId());
                    	return result;
    				}else {
    					Subcon result = new Subcon();
                    	result.setLevel(Level.GROUP);
                    	result.setTargetId(segOrGroup.getId());
                    	result.setContext(context);
                    	return result;
    				}
    			}
    		}
    	}
        return null;
    }
}
