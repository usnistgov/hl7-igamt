package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
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
		HttpHeaders headers = new HttpHeaders();
		headers.set("User-Agent", "IGAMT");
		headers.set("Accept", "application/json");
		headers.set("Accept-Language", "en-US,en;q=0.9");

		HttpEntity<Void> entity = new HttpEntity<>(headers);

		try {
			ResponseEntity<List<CodesetResponse>> response = restTemplate.exchange(
					url,
					HttpMethod.GET,
					entity,
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
	
	
//	public CodesetResponse getOneByURL(String url) {
//
//
//		try {
//			ResponseEntity<CodesetResponse> response = restTemplate.exchange(
//					url,
//					HttpMethod.GET,
//					null,
//					CodesetResponse.class
//					);
//			return response.getBody();
//		} catch (HttpClientErrorException | HttpServerErrorException e) {
//			System.out.println("Status code: " + e.getStatusCode());
//			System.out.println("Response body: " + e.getResponseBodyAsString());
//			System.out.println("Response body: " + e.getResponseBodyAsString());
//			throw new RuntimeException("API call failed", e);
//		} catch (RestClientException e) {
//			throw new RuntimeException("API connection failed", e);
//		} catch (Exception e) {
//			throw new RuntimeException("Unexpected error occurred", e);
//		}
//	}

	public CodesetResponse getOneByURL(String url) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.set("User-Agent", "Mozilla/5.0"); // Mimic a browser
			headers.set("Accept", "application/json");

			HttpEntity<Void> entity = new HttpEntity<>(headers);

			ResponseEntity<CodesetResponse> response = restTemplate.exchange(
					url,
					HttpMethod.GET,
					entity,
					CodesetResponse.class
			);
			return response.getBody();
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			System.out.println("Status code: " + e.getStatusCode());
			System.out.println("Response body: " + e.getResponseBodyAsString());
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
