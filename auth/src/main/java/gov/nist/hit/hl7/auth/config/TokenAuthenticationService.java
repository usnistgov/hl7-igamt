package gov.nist.hit.hl7.auth.config;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.domain.LoginResponse;
import gov.nist.hit.hl7.auth.domain.User;
import gov.nist.hit.hl7.auth.service.AccountService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class TokenAuthenticationService {
	final int EXPIRATIONTIME = 3600; // 1 hour
	static final String SECRET = "B2(<Bx@2!(Da@~g@:)y9J]xfukGf=,bFs:Mfrgwz";
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private AccountService accountService;

	public void addAuthentication(HttpServletResponse res, String username) throws IOException {
		Account account = accountService.getAccountByUsername(username);

		Claims claims = Jwts.claims();
		claims.put("roles", account
							.getPrivileges()
							.stream()
							.map((x)->{
								return x.getAuthority();
							})
							.collect(Collectors.toList()));
		
		String JWT = Jwts.builder()
					.setClaims(claims).setSubject(username)
					.setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME * 1000))
					.signWith(SignatureAlgorithm.HS256, SECRET).compact();

		//-- Create Cookie
		Cookie authCookie = new Cookie("authCookie", JWT);
		authCookie.setPath("/api");
		authCookie.setMaxAge(EXPIRATIONTIME);
		authCookie.setHttpOnly(true);

		
		//-- Create Payload
		LoginResponse loginResponse = new LoginResponse(true, "welcome", new User(account.getId(), account.getUsername(), new ArrayList<>(account.getPrivileges())));
		
				
		//-- Create response
		res.setContentType("application/json");
		res.addCookie(authCookie);
		objectMapper.writeValue(res.getWriter(), loginResponse);

	}

	public UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
		Cookie token = WebUtils.getCookie(request,"authCookie");
		if (token != null && token.getValue() != null && !token.getValue().isEmpty()) {
			String user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token.getValue()).getBody().getSubject();
			Account userDetails = accountService.getAccountByUsername(user);
			return userDetails != null ? new UsernamePasswordAuthenticationToken(userDetails, token.getValue(), userDetails.getPrivileges()) : null;
		}
		return null;
	}
}