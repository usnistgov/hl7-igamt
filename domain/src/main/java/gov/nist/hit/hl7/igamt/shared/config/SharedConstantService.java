package gov.nist.hit.hl7.igamt.shared.config;

import org.springframework.stereotype.Service;

@Service
public interface SharedConstantService {
	
	public SharedConstant findOne();
	public SharedConstant save(SharedConstant shared);

}
