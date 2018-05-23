package gov.nist.hit.hl7.igamt.shared.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class SharedConstantController {
	 @Autowired 
	 SharedConstantService sharedConstantService;
	public SharedConstantController() {
		// TODO Auto-generated constructor stub
	}
	
	
	@RequestMapping(value = "/api/sharedConstant", method = RequestMethod.GET,produces = {"application/json"})
	private SharedConstant getSharedConstant() {
		return sharedConstantService.findOne();
	}


}
