package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoConstraintVerificationService extends VerificationUtils {

//    void checkCoConstraintBinding(ResourceSkeleton resource, CoConstraintBinding coConstraintBinding) {
//        try {
//            ResourceSkeletonBone context = resource.get(coConstraintBinding.getContext().getPath());
//            if(context != null && coConstraintBinding.getBindings() != null) {
//                for(CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings()) {
//                    checkCoConstraintBindingSegment(context, coConstraintBindingSegment);
//                }
//            } else {
//                // Context does not exist
//            }
//        } catch (ResourceNotFoundException e) {
//            // Resource does not exist
//        }
//    }
//
//    void checkCoConstraintBindingSegment(ResourceSkeletonBone context, CoConstraintBindingSegment coConstraintBindingSegment) {
//        try {
//            ResourceSkeletonBone segment = context.get(coConstraintBindingSegment.getSegment().getPath());
//            if(segment != null) {
//                if(segment.getResource() != null && segment.getResource().getType().equals(Type.SEGMENT)) {
//                    for(CoConstraintTableConditionalBinding binding : coConstraintBindingSegment.getTables()) {
//                        checkCoConstraintTableConditionalBinding(context, binding);
//                    }
//                }
//                else {
//                    // target is not a segment
//                }
//            } else {
//                // Segment does not exist
//            }
//        } catch (ResourceNotFoundException e) {
//            // Resource does not exist
//        }
//    }
//
//    void checkCoConstraintTableConditionalBinding(ResourceSkeletonBone segment, CoConstraintTableConditionalBinding binding) {
//        if(binding.getCondition() != null) {
//            this.checkAssertion(segment, binding.getCondition());
//        }
//
//
//    }
//
//    void checkCoConstraintTable(ResourceSkeletonBone segment, CoConstraintTable table) {
//        CoConstraintTable coConstraintTable = this.coConstraintService.resolveRefAndMerge(table);
//        coConstraintTable.getHeaders();
//    }
//
//    void checkCoConstraintHeaders(ResourceSkeletonBone segment, List<CoConstraintHeader> headers) {
//        for(CoConstraintHeader header: headers) {
//            switch (header.getType()) {
//                case DATAELEMENT:
//                    DataElementHeader dataElementHeader = (DataElementHeader) header;
//
//                    break;
//            }
//        }
//    }
//
//    void checkCoConstraintDataElementHeader(ResourceSkeletonBone segment, DataElementHeader dataElementHeader) {
//        try {
//            ResourceSkeletonBone target = segment.get(dataElementHeader.getKey());
//            if(target != null) {
//                BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
//                switch (dataElementHeader.getColumnType()) {
//                    case CODE:
//                        if(bindingInfo == null || !bindingInfo.isCoded()) {
//                            // Code is not allowed at location
//                        }
//                        break;
//                    case VALUESET:
//                        if(bindingInfo == null || !isAllowedLocation(
//                                bindingInfo,
//                                target.getParent().getDomainInfo().getVersion(),
//                                target.getPosition(),
//                                target.getLocationInfo().getType(),
//                                target.getParent().getFixedName())
//                        ) {
//                            // Value Set is not allowed at location
//                        }
//                        break;
//                    case DATATYPE:
//                    case VALUE:
//                        if(!target.getResource().isLeaf()) {
//                            // Column path should be primitive
//                        }
//                        break;
//                    case VARIES:
//                        if(!target.getResource().getFixedName().equalsIgnoreCase("varies")) {
//                            // Column path should be varies
//                        }
//                        break;
//                }
//            } else {
//                // Column target does not exist
//            }
//        } catch (ResourceNotFoundException e) {
//            // Resource does not exist
//        }
//    }
}
