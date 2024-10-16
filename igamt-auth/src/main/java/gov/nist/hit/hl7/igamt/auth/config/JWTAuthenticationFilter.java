package gov.nist.hit.hl7.igamt.auth.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private TokenAuthenticationService tokenService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    try {
      UsernamePasswordAuthenticationToken authentication = tokenService.getAuthentication(request);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (Exception e) {
      // Clear cookie
      Cookie authCookie = new Cookie("authCookie", "");
      authCookie.setPath("/api");
      authCookie.setMaxAge(0);
      response.addCookie(authCookie);
      // Clear Security Context
      SecurityContextHolder.clearContext();
    }
    filterChain.doFilter(request, response);
  }
}
