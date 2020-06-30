package gov.nist.hit.hl7.igamt.common.base.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.repository.DocumentStructureRepository;


@Service("documentStructureService")
public class DocumentStructureService {
	
	@Autowired
	DocumentStructureRepository documentStructureRepository;
	
	  public DocumentStructure getDocumentStructure(String id) {
		  return documentStructureRepository.findOneById(id);
	}


}
