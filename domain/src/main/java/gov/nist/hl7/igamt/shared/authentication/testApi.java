package gov.nist.hl7.igamt.shared.authentication;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testApi {
	
	@RequestMapping(value = "/api/testSecurity", method = RequestMethod.POST)
	public String tests() {
		return "ok";
	}

}
