package gov.nist.hit.hl7.igamt.web.app.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.domain.UserConfig;
import gov.nist.hit.hl7.igamt.common.config.service.UserConfigService;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;

@RestController
public class UserConfigController {

	@Autowired
	UserConfigService userConfigService;

	@RequestMapping(value = "/api/user-config", method = RequestMethod.POST, produces = {"application/json" })
	// @PreAuthorize("AccessResource(#type, #id, READ)")
	public @ResponseBody ResponseMessage<UserConfig> saveConfig(@RequestBody UserConfig config,  Authentication authentication) {

		String username = authentication.getPrincipal().toString();
		if(config.getUsername() == null) {
			config.setUsername(username);
		}
		
		return new ResponseMessage<UserConfig>(Status.SUCCESS, null, null, null, false, null, this.userConfigService.save(config));

	}

	@RequestMapping(value = "/api/user-config", method = RequestMethod.GET, produces = {"application/json" })
	// @PreAuthorize("AccessResource(#type, #id, READ)")
	public @ResponseBody ResponseMessage<UserConfig> getUserConfig( Authentication authentication) {

		String username = authentication.getPrincipal().toString();
		UserConfig config;
		List<UserConfig> configs = this.userConfigService.findByUsername(username);
		if(configs == null || configs.isEmpty()) {
			config = UserConfig.GenerateDefault();
		}else {
			config = configs.get(0);
		}
	    return new ResponseMessage<UserConfig>(Status.SUCCESS, null, null, null, false, null, config);
	}



}
