package gov.nist.hit.hl7.igamt.legacy.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.legacy.igamt.jpa.repository.AccountRepository;
import gov.nist.hit.hl7.auth.service.AccountService;
import gov.nist.hit.hl7.auth.service.impl.AccountServiceImpl;
@Service
public class AccountConversionServiceImpl  implements ConversionService {
	@Autowired
	private AccountRepository  legacyRepo;
	
	 private static AccountServiceImpl accountService =
		      (AccountServiceImpl) userContext.getBean(AccountServiceImpl.class);
	
	@Override
	public void convert() {
		System.out.println(accountService.findAll());
		
		System.out.println(legacyRepo.findAll());
		
	}

}
