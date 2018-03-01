package gov.nist.hit.hl7.auth.filter;
import java.io.IOException;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.auth.domain.LoginRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Collections;
public class JWTAuthenticationFilter extends AbstractAuthenticationProcessingFilter  {
	public JWTAuthenticationFilter(String url , AuthenticationManager authenticationManager) {
		super(new AntPathRequestMatcher(url));
		setAuthenticationManager(authenticationManager);

		// TODO Auto-generated constructor stub
	}
	

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException, JsonParseException, JsonMappingException, IOException {
		
		 ObjectMapper mapper = 
								new ObjectMapper()
	        .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		LoginRequest creds = new LoginRequest();
		
		creds=  mapper.readValue(request.getInputStream(), LoginRequest.class);
		System.out.println(creds);
		System.out.println(creds.getPassword());
		System.out.println(creds.getUsername());


		return getAuthenticationManager().authenticate(new UsernamePasswordAuthenticationToken(creds.getUsername(),creds.getPassword(), Collections.emptyList()));
	}
	@Override
	protected void successfulAuthentication(HttpServletRequest request,  HttpServletResponse response,
			 FilterChain chain,	Authentication authResult) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		User springUser=(User) authResult.getPrincipal();
		String jwt =Jwts.builder().setSubject(springUser.getUsername()).setExpiration(new Date(System.currentTimeMillis()+SecurityConstants.EXPIRATION_DATE)).
				signWith(SignatureAlgorithm.HS256, SecurityConstants.SECRET).claim("roles", springUser.getAuthorities()).compact();
		
		response.addHeader(SecurityConstants.HEADER_STRING,jwt);
//		super.successfulAuthentication(request, response, authResult);
	}
}