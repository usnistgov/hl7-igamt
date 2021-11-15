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
package gov.nist.hit.hl7.igamt.common.slicing.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class SlicingImpl implements SlicingService {

	public void updateSlicing(Set<Slicing> slicings, HashMap<RealKey, String> newKeys, Type flavorsType ) {
		for(Slicing  slc: slicings) {
			if(slc instanceof ConditionalSlicing) {
				this.updateSlices(((ConditionalSlicing) slc).getSlices(), newKeys, flavorsType);
			} else if (slc instanceof OrderedSlicing) {
				updateSlices(((OrderedSlicing) slc).getSlices(), newKeys, flavorsType);
			}
		}
	}

	/**
	 * @param slices
	 */
	private <T extends Slice> void updateSlices(List<T> slices, HashMap<RealKey, String> newKeys, Type flavorsType) {
		for ( T slice: slices) {
			if(slice.getFlavorId() != null) {
				RealKey key = new RealKey(slice.getFlavorId(), flavorsType); 
				if (newKeys.containsKey(key)) {
					slice.setFlavorId(newKeys.get(key));
				}
			}
		}
	}

	/* (non-Javadoc)
	 * @see gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService#collectDependencies(gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier, java.util.Set)
	 */
	@Override
	public Set<RelationShip> collectDependencies(ReferenceIndentifier referenceIndentifier, Set<Slicing> slicings, Type flavorsType) {
		Set<RelationShip> relations = new HashSet<RelationShip>();
		for(Slicing  slc: slicings) {
			if(slc instanceof ConditionalSlicing) {
				this.addRelations(((ConditionalSlicing) slc).getSlices(), referenceIndentifier, relations, flavorsType, slc.getPath());
			} else if (slc instanceof OrderedSlicing) {
				this.addRelations(((OrderedSlicing) slc).getSlices(), referenceIndentifier, relations, flavorsType, slc.getPath());

			}
		}
		return relations;
	}

	private <T extends Slice> void addRelations(List<T> slices, ReferenceIndentifier parent, Set<RelationShip> relations, Type flavorsType, String path) {
		if(slices != null) {
			for ( T slice: slices) {
				if(slice.getFlavorId() != null) {
					RelationShip rel = new RelationShip(new ReferenceIndentifier(slice.getFlavorId(), flavorsType), parent, new ReferenceLocation(parent.getType(), "SLICING", ""));
					relations.add(rel);
				}
			}
		}
	}

}
