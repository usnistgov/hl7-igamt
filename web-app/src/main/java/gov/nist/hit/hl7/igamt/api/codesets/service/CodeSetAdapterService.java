package gov.nist.hit.hl7.igamt.api.codesets.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import gov.nist.hit.hl7.igamt.api.codesets.model.CodesetResponse;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service
public class CodeSetAdapterService {


	@Autowired
	private RestTemplate restTemplate;
	
	//http://hit-dev-admin.nist.gov:19070/api/v1/phinvads/codesets


	public List<CodesetResponse> getAvailableCodeSets(String url) {
		

		try {
			ResponseEntity<List<CodesetResponse>> response = restTemplate.exchange(
					url,
					HttpMethod.GET,
					null,
					new ParameterizedTypeReference<List<CodesetResponse>>() {}
					);
			return response.getBody();
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			throw new RuntimeException("API call failed", e);
		} catch (RestClientException e) {
			throw new RuntimeException("API connection failed", e);
		} catch (Exception e) {
			throw new RuntimeException("Unexpected error occurred", e);
		}
	}
	
	
	public List<Valueset> getAllAvailablePhinvads(){
		
		String url = "http://hit-dev-admin.nist.gov:19070/api/v1/phinvads/codesets";
		 List<CodesetResponse> response =  this.getAvailableCodeSets(url);
		
		List<Valueset>  ret = new ArrayList<Valueset>();
		for(CodesetResponse codeSet: response) {
			Valueset vs = new Valueset();
			vs.setDomainInfo(null);
			vs.setBindingIdentifier(codeSet.getName());
			vs.setOid(codeSet.getId());
			vs.setId(codeSet.getId());
			vs.setName(codeSet.getName());
			DomainInfo info = new DomainInfo();
			info.setScope(Scope.PHINVADS);
			vs.setDomainInfo(info);
			ret.add(vs);
		
		
		}
		return ret;
		
	}

	



}
