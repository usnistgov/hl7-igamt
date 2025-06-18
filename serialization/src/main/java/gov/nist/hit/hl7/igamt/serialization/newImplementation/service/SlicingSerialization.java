package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.SlicingMethod;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import nu.xom.Attribute;
import nu.xom.Element;



@Service
public class SlicingSerialization {

	@Autowired
	private DatatypeService datatypeService;
	@Autowired
	private SegmentService segmentService;	   

	public Element serializeSlicing(Set<Slicing> slicings, ResourceSkeleton root, Type type, Map<String, Boolean> bindedPaths) throws ResourceNotFoundException {

		Element slicingsElement = new Element("Slicings");
		for(Slicing slicing : slicings) {
			if(slicing != null) {
				ResourceSkeletonBone target = root.get(slicing.getPath());
				if(bindedPaths.containsKey(target.getElementId())) {
				Element slicingElement = new Element("Slicing");
				slicingElement.addAttribute(
						new Attribute("type", slicing.getType() != null ? slicing.getType().name() : ""));
				slicingElement.addAttribute(
						new Attribute("path", slicing.getPath() != null ? slicing.getPath() : ""));
				slicingElement.addAttribute(
						new Attribute("name", target != null ? target.getLocationInfo().getName() : ""));
				slicingElement.addAttribute(
						new Attribute("element", target != null ? target.getResource().getFixedName() : ""));

				if(slicing.getType().equals(SlicingMethod.OCCURRENCE)) {
					for(OrderedSlice orderedSlice: ((OrderedSlicing) slicing).getSlices()) {
						if(orderedSlice !=null) {
							Element orderSlice = new Element("Slice");
							slicingElement.appendChild(orderSlice);
							orderSlice.addAttribute(
									new Attribute("occurence", orderedSlice != null ? String.valueOf(orderedSlice.getPosition()): ""));
							if(type.equals(Type.SEGMENT)) {
								if(orderedSlice.getFlavorId() != null) {
									Datatype datatype = datatypeService.findById(orderedSlice.getFlavorId());
									orderSlice.addAttribute(
											new Attribute("flavor", orderedSlice.getFlavorId() != null ? datatype.getLabel(): ""));
								} else {
									orderSlice.addAttribute(
											new Attribute("flavor", ""));
								}}
								else if(type.equals(Type.CONFORMANCEPROFILE)) {
									if(orderedSlice.getFlavorId() != null) {
									Segment segment = segmentService.findById(orderedSlice.getFlavorId());
									orderSlice.addAttribute(
											new Attribute("flavor", orderedSlice.getFlavorId() != null ? segment.getLabel() : ""));
								} else {
									orderSlice.addAttribute(
											new Attribute("flavor",""));
								}
							}
							orderSlice.addAttribute(
									new Attribute("comment", orderedSlice.getComments() != null ? orderedSlice.getComments() : ""));
						}
					}

				}
				if(slicing.getType().equals(SlicingMethod.ASSERTION)) {
					for(ConditionalSlice conditionalSlicing : ((ConditionalSlicing) slicing).getSlices()) {
						if(conditionalSlicing != null) {
							Element conditionalSlice = new Element("Slice");
							slicingElement.appendChild(conditionalSlice);
							conditionalSlice.addAttribute(
									new Attribute("assertion", conditionalSlicing.getAssertion() != null ? conditionalSlicing.getAssertion().getDescription(): ""));
							if(type.equals(Type.SEGMENT)) {
								if(conditionalSlicing.getFlavorId() != null) {
									Datatype datatype = datatypeService.findById(conditionalSlicing.getFlavorId());
									conditionalSlice.addAttribute(
											new Attribute("flavor", datatype!= null ? datatype.getLabel(): ""));
								} else{
									conditionalSlice.addAttribute(
											new Attribute("flavor",""));
								}
							}
							else if(type.equals(Type.CONFORMANCEPROFILE)) {
								if(conditionalSlicing.getFlavorId() != null) {
									Segment segment = segmentService.findById(conditionalSlicing.getFlavorId());
									conditionalSlice.addAttribute(
											new Attribute("flavor", segment != null ? segment.getLabel() : ""));

								} else {
									conditionalSlice.addAttribute(
											new Attribute("flavor",""));
								}
							}
							conditionalSlice.addAttribute(
									new Attribute("comment", conditionalSlicing.getComments() != null ? conditionalSlicing.getComments() : ""));
						}
					}

				}
				if (slicingElement != null) {
					slicingsElement.appendChild(slicingElement);
				}
			}
		}
		}
		return slicingsElement;
	}


}
