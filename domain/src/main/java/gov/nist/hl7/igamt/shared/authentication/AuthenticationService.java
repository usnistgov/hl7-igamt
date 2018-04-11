package gov.nist.hl7.igamt.shared.authentication;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthenticationService {

	public String connect(LoginRequest user) throws AuthenticationException {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-type", "application/json");
			RestTemplate restTemplate = new RestTemplate();
			HttpEntity<LoginRequest> request = new HttpEntity<>(user);
			
			
			ResponseEntity<LoginRequest> response = restTemplate.exchange("http://localhost:8090/api/login",
					HttpMethod.POST, request, LoginRequest.class);
			if (response.getStatusCode() == HttpStatus.OK) {
				if (response.getHeaders().containsKey("Authorization")) {
					return response.getHeaders().get("Authorization").get(0);
				} else {
					throw new AuthenticationException("Token is missing");
				}
			} else {
				throw new AuthenticationException("Unautorized");
			}
		} catch (HttpClientErrorException e) {

			throw new AuthenticationException(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			throw new AuthenticationException(e.getMessage());
		}
	}

	public void register(RegistrationRequest user) throws AuthenticationException {
		
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-type", "application/json");
			RestTemplate restTemplate = new RestTemplate();
			HttpEntity<RegistrationRequest> request = new HttpEntity<>(user);
			
			
			ResponseEntity<RegistrationRequest> response = restTemplate.exchange("http://localhost:8090/register/",
					HttpMethod.POST, request, RegistrationRequest.class);
		} catch (HttpClientErrorException e) {

			throw new AuthenticationException(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			throw new AuthenticationException(e.getMessage());
		}
		// TODO Auto-generated method stub
	}

}
