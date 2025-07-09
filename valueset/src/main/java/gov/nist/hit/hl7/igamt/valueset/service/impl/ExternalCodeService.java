package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
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

	public List<CodesetResponse> getAllByURL(String url) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("User-Agent", "NIST IGAMT");
			HttpEntity<Void> entity = new HttpEntity<>(headers);
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

	public CodesetResponse getOneByURL(String url) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("User-Agent", "NIST IGAMT");
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
				internalCode.setHasPattern(ext.isPattern());
				if(ext.isPattern()) {
					internalCode.setPattern(ext.getRegularExpression());
				}
				codes.add(internalCode);
			}
		}
		return codes;
	}
}