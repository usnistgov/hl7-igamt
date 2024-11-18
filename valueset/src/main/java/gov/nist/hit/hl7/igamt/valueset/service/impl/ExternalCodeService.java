package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import gov.nist.hit.hl7.igamt.api.codesets.model.ExternalCode;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodesetResponse;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;

@Service
public class ExternalCodeService {


	@Autowired
	private RestTemplate restTemplate;
	
	//http://hit-dev-admin.nist.gov:19070/api/v1/phinvads/codesets


	public List<CodesetResponse> getAllByURL(String url) {
		

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
	
	
	public CodesetResponse getOneByURL(String url) {
		

		try {
			ResponseEntity<CodesetResponse> response = restTemplate.exchange(
					url,
					HttpMethod.GET,
					null,
					CodesetResponse.class
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
	
	
	
	
	public Set<Code> getCodesByURL(String url) {
		
		CodesetResponse response = this.getOneByURL(url);
		Set<Code> codes = new HashSet<Code>();
		
		if(response.getCodes() != null) {
			for (ExternalCode ext: response.getCodes() ) {
				Code internalCode = new Code();
				internalCode.setCodeSystem(ext.getCodeSystem());
				internalCode.setDescription(ext.getDisplayText());
				internalCode.setUsage(ext.getUsage());
				internalCode.setValue(ext.getValue());
				codes.add(internalCode);
			}
			
		}
		return codes;
		
	}
	
	

	



}
