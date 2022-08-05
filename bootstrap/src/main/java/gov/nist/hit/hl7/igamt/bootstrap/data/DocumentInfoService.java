package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class DocumentInfoService {

	@Autowired
	SegmentService segmentsService;

	@Autowired
	ConformanceProfileService conformanceProfileService;

	@Autowired
	DatatypeService datatypeService;

	@Autowired
	ValuesetService valueSetService;

	@Autowired
	MessageStructureRepository  messageStructureRepository;
	@Autowired
	ConfigService configService;

	@Autowired
	IgService igService;

//	public void checkElementTypes() {
//
//
//		List<Ig> igs =  igService.findAll();
//
//		for(Ig ig: igs ) {
//			this.processIgConformanceProfile(ig);
//		} 
//
//	}


	
	public void processIgConformanceProfile(Ig ig) {
		DocumentInfo documentInfo = new DocumentInfo(ig.getId(),DocumentType.IGDOCUMENT);

			for(Link l: ig.getConformanceProfileRegistry().getChildren()) {
				ConformanceProfile cp = this.conformanceProfileService.findById(l.getId());
				if(cp != null) {
					if(cp.getDocumentInfo() ==null) {
					System.out.println("NULL:" +cp.getId() + "IG "+ ig.getId());
					}else if (!cp.getDocumentInfo().equals(documentInfo)) {
					System.out.println("MISSMATCH:" +cp.getId() + "IG "+ ig.getId());
					}
				}else {
					System.out.println("NULL");
		
				}
			}
	}






}
