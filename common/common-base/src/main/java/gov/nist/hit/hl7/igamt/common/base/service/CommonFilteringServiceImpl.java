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
package gov.nist.hit.hl7.igamt.common.base.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.util.UsageFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class CommonFilteringServiceImpl implements CommonFilteringService {

  @Override
  public boolean allow(UsageFilter usage, StructureElement elm) {
    if(usage != null) {
      if(usage.getValues() == null || usage.getValues().isEmpty()) {
        return usage.isAllow();
      }
      else if(usage.getValues().contains(elm.getUsage())) {
        return usage.isAllow();
      }else {
        return !usage.isAllow();
      }
    }else {
      return true;
    }
  }

}
