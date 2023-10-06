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
package gov.nist.hit.hl7.resource.dependency;

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.util.UsageFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class DependencyFilter {
	
	Map<RealKey, Boolean> excluded = new HashMap<RealKey,Boolean>();
	UsageFilter usageFilter;

	public DependencyFilter() {
	}

	/**
	 * @param excluded2
	 */
	public DependencyFilter(HashMap<RealKey, Boolean> excluded) {
		this.excluded = excluded;
	}

	/**
	 * @param usageFilter2
	 */
	public DependencyFilter(UsageFilter usageFilter2) {
		this.usageFilter = usageFilter2;
		excluded = new HashMap<RealKey,Boolean>();
	}

	public Map<RealKey, Boolean> getExcluded() {
		return excluded;
	}

	public void setExcluded(Map<RealKey, Boolean> excluded) {
		this.excluded = excluded;
	}

	public UsageFilter getUsageFilter() {
		return usageFilter;
	}

	public void setUsageFilter(UsageFilter usageFilter) {
		this.usageFilter = usageFilter;
	}


}
