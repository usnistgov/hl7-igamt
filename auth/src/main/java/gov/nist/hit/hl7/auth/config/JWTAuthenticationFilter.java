package gov.nist.hit.hl7.auth.config;
import java.io.IOException;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.auth.domain.Account;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter  {
	private AuthenticationManager authenticationManager;
	public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
		super();
		this.authenticationManager = authenticationManager;
		// TODO Auto-generated constructor stub
	}
	

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		
		Account a = null;
		
		try {
			 a= new ObjectMapper().readValue(request.getInputStream(), Account.class);
			
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		// TODO Auto-generated method stub
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(a.getUsername(), a.getPassword()));
	}
	@SuppressWarnings("deprecation")
	@Override
	protected void successfulAuthentication(HttpServletRequest request,  HttpServletResponse response,
			 FilterChain chain,	Authentication authResult) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		User springUser=(User) authResult.getPrincipal();
		String jwt =Jwts.builder().setSubject(springUser.getUsername()).setExpiration(new Date(System.currentTimeMillis()+SecurityConstants.EXPIRATION_DATE)).
				signWith(SignatureAlgorithm.HS256, SecurityConstants.SECRET).claim("roles", springUser.getAuthorities()).compact();
		
		response.addHeader(SecurityConstants.HEADER_STRING,jwt);
		super.successfulAuthentication(request, response, authResult);
	}
}