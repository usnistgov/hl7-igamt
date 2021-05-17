package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.security.core.parameters.P;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class DataElementNamingService {
    private final Map<String, Datatype> datatypeMap;
    private final Map<String, Segment> segmentMap;
    private final DatatypeService datatypeService;
    private final SegmentService segmentService;
    private final ConformanceProfileService conformanceProfileService;

    public DataElementNamingService(DatatypeService datatypeService, SegmentService segmentService, ConformanceProfileService conformanceProfileService) {
        this.datatypeService = datatypeService;
        this.segmentService = segmentService;
        this.conformanceProfileService = conformanceProfileService;
        this.datatypeMap = new HashMap<>();
        this.segmentMap = new HashMap<>();
    }

    private Datatype getDatatypeById(String id) {
        if(datatypeMap.containsKey(id)) {
            return datatypeMap.get(id);
        } else {
            Datatype datatype = this.datatypeService.findById(id);
            this.datatypeMap.put(id, datatype);
            return datatype;
        }
    }

    private Segment getSegmentById(String id) {
        if(segmentMap.containsKey(id)) {
            return segmentMap.get(id);
        } else {
            Segment segment = this.segmentService.findById(id);
            this.segmentMap.put(id, segment);
            return segment;
        }
    }

    private LocationInfo processSegRefOrGroup(SegmentRefOrGroup segmentRefOrGroup, Stack<String> route, LocationInfo info) {
        if(segmentRefOrGroup instanceof SegmentRef) {
            return this.processSegRef((SegmentRef) segmentRefOrGroup, route, info);
        } else if(segmentRefOrGroup instanceof Group) {
            return this.processGroup((Group) segmentRefOrGroup, route, info);
        }
        return null;
    }

    private LocationInfo processSegRef(SegmentRef segmentRef, Stack<String> route, LocationInfo info) {
        info.setPositionalPath(this.append(info.getPositionalPath(), ".", segmentRef.getPosition() + ""));
        info.setType(Type.SEGMENTREF);
        if(route.empty()) {
            return info;
        }
        Segment segment = this.getSegmentById(segmentRef.getRef().getId());
        if(segment != null) {
            return this.processSegment(segment, route, info);
        }
        return null;
    }

    private LocationInfo processGroup(Group group, Stack<String> route, LocationInfo info) {
        info.setPositionalPath(this.append(info.getPositionalPath(), ".", group.getPosition() + ""));
        info.setHl7Path(this.append(info.getHl7Path(), ".", group.getName() + ""));
        info.setType(Type.GROUP);
        if(route.empty()) {
            return info;
        }
        String step = route.pop();
        for(SegmentRefOrGroup segmentRefOrGroup: group.getChildren()) {
            if(segmentRefOrGroup.getId().equals(step)) {
                return this.processSegRefOrGroup(segmentRefOrGroup, route, info);
            }
        }
        return null;
    }

    private LocationInfo processSegment(Segment segment, Stack<String> route, LocationInfo info) {
        info.setHl7Path(this.append(info.getHl7Path(), ".", segment.getName() + ""));
        info.setType(Type.SEGMENT);
        if(route.empty()) {
            return info;
        }
        String step = route.pop();
        for(Field field: segment.getChildren()) {
            if(field.getId().equals(step)) {
                return this.processField(field, route, info);
            }
        }
        return null;
    }

    private LocationInfo processField(Field field, Stack<String> route, LocationInfo info) {
        info.setPositionalPath(this.append(info.getPositionalPath(), ".", field.getPosition() + ""));
        info.setHl7Path(this.append(info.getHl7Path(), "-", field.getPosition() + ""));
        info.setType(Type.FIELD);
        info.setName(field.getName());
        if(route.empty()) {
           return info;
        }
        Datatype datatype = this.getDatatypeById(field.getRef().getId());
        if(datatype != null) {
            return this.processDatatype(datatype, route, info, false, false);
        }
        return null;
    }

    private LocationInfo processDatatype(Datatype datatype, Stack<String> route, LocationInfo info, boolean root, boolean fromComponent) {
        if(root) {
            info.setHl7Path(this.append(info.getHl7Path(), ".", datatype.getName() + ""));
        }
        info.setType(Type.DATATYPE);
        if(route.empty()) {
            return info;
        }
        if(datatype instanceof ComplexDatatype) {
            ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
            String step = route.pop();
            for(Component component: complexDatatype.getComponents()) {
                if(component.getId().equals(step)) {
                    return this.processComponent(component, route, info, fromComponent ? Type.SUBCOMPONENT : Type.COMPONENT);
                }
            }
            return null;
        } else {
            return null;
        }
    }

    private LocationInfo processComponent(Component component, Stack<String> route, LocationInfo info, Type type) {
        info.setPositionalPath(this.append(info.getPositionalPath(), ".", component.getPosition() + ""));
        info.setHl7Path(this.append(info.getHl7Path(), ".", component.getPosition() + ""));
        info.setType(type);
        info.setName(component.getName());

        if(route.empty()) {
            return info;
        }
        Datatype datatype = this.getDatatypeById(component.getRef().getId());
        if(datatype != null) {
            return this.processDatatype(datatype, route, info, false, true);
        }
        return null;
    }

    public LocationInfo computeLocationInfo(ConformanceProfile conformanceProfile, String path) {
        LocationInfo locationInfo = new LocationInfo();
        Stack<String> route = this.getStackFromPath(path);
        String step = route.pop();
        for(SegmentRefOrGroup segmentRefOrGroup: conformanceProfile.getChildren()) {
            if(segmentRefOrGroup.getId().equals(step)) {
                return this.processSegRefOrGroup(segmentRefOrGroup, route, locationInfo);
            }
        }
        return null;
    }


    public LocationInfo computeLocationInfo(Segment segment, String path) {
        LocationInfo locationInfo = new LocationInfo();
        Stack<String> route = this.getStackFromPath(path);
        return this.processSegment(segment, route, locationInfo);
    }

    public LocationInfo computeLocationInfo(Datatype datatype, String path) {
        LocationInfo locationInfo = new LocationInfo();
        Stack<String> route = this.getStackFromPath(path);
        return this.processDatatype(datatype, route, locationInfo, true, false);
    }

    public LocationInfo computeLocationInfo(Type type, String id, String path) {
        switch (type) {
            case CONFORMANCEPROFILE:
                ConformanceProfile conformanceProfile = this.conformanceProfileService.findById(id);
                if(conformanceProfile != null) {
                    return this.computeLocationInfo(conformanceProfile, path);
                } else {
                    return null;
                }
            case SEGMENT:
                Segment segment = this.segmentService.findById(id);
                if(segment != null) {
                    return this.computeLocationInfo(segment, path);
                } else {
                    return null;
                }
            default:
                return null;
        }
    }

    private String append(String source, String sep, String value) {
        if(Strings.isNullOrEmpty(source)) {
            return value;
        } else {
            return source + sep + value;
        }
    }

    private Stack<String> getStackFromPath(String path) {
        String[] nodes = path.split("-");
        Stack<String> stack = new Stack<>();
        for(int i = nodes.length - 1; i >= 0; i--) {
            stack.push(nodes[i]);
        }
        return stack;
    }
}
