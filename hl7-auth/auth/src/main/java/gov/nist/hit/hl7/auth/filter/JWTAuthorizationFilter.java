package gov.nist.hit.hl7.auth.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import gov.nist.hit.hl7.auth.util.crypto.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JWTAuthorizationFilter extends  OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
				String jwt = request.getHeader(SecurityConstants.HEADER_STRING);
				if(jwt == null ||!jwt.startsWith(SecurityConstants.TOKEN_PREFIX)) {
						chain.doFilter(request,response); return;
				}
				Claims claims = Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJws(jwt.replace(SecurityConstants.TOKEN_PREFIX, "")).getBody();
				String username= claims.getSubject();
				ArrayList<Map<String,String>> roles = (ArrayList<Map<String, String>>) claims.get("roles");
				
				Collection<GrantedAuthority> authorities = new ArrayList<>();
				roles.forEach(r ->{
					authorities.add(new SimpleGrantedAuthority(r.get("authority")));
				});
//				UsernamePasswordAuthenticationToken authenticatedUser= new UsernamePasswordAuthenticationToken(username, null,authorities);
//				SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
				chain.doFilter(request, response);
				
				
				}
}