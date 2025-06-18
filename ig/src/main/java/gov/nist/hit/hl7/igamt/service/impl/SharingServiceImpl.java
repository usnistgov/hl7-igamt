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
package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.SharingService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/**
 * @author Abdelghani El Ouakili
 */
@Service
public class SharingServiceImpl implements SharingService {

	@Autowired
	IgService igService;


	@Override
	public void updateIgViewers(String id, List<String> viewers, String username) throws Exception {
		Ig ig = this.igService.findById(id);

		if (ig == null) {
			throw new ResourceNotFoundException(id, Type.IGDOCUMENT);
		} else {

			if(ig.getUsername().equals(username)) {

				// The owner can't be in the viewers list
				if(viewers != null) {
					viewers.remove(username);
				}

				Audience audience = ig.getAudience();

				if(audience instanceof PrivateAudience) {
					((PrivateAudience) audience).setViewers(new HashSet<>(viewers != null ? viewers : new ArrayList<>()));
				} else {
					throw new Exception("Invalid operation");
				}

			} else {
				throw new ForbiddenOperationException();
			}

		}
		this.igService.save(ig);
	}

}
