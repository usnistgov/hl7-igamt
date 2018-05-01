package gov.nist.hit.hl7.igamt.shared.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SharedConstantServiceImpl implements SharedConstantService{
	@Autowired
	SharedConstantRepository  sharedConstantRepository;
	
	public SharedConstantServiceImpl() {
	}

	@Override
	public SharedConstant findOne() {
		// TODO Auto-generated method stub
		List<SharedConstant> constants= sharedConstantRepository.findAll();
		if(constants !=null && !constants.isEmpty()) {
		return constants.get(0);}
		else { return null;}
	}

	@Override
	public SharedConstant save(SharedConstant shared) {
		// TODO Auto-generated method stub
		return sharedConstantRepository.save(shared);
	}

}
