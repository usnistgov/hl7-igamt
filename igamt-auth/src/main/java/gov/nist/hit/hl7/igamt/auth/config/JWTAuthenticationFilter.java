package gov.nist.hit.hl7.igamt.auth.config;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

  private final TokenAuthenticationService tokenService;
  private final RequestMatcher pathMatcher;

  public JWTAuthenticationFilter(String path, TokenAuthenticationService tokenService) {
    this.pathMatcher = new AntPathRequestMatcher(path);
    this.tokenService = tokenService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    if(!this.pathMatcher.matches(request)) {
      filterChain.doFilter(request, response);
      return;
    }

    UsernamePasswordAuthenticationToken authentication;
    try {
      authentication = tokenService.getAuthentication(request);
      SecurityContextHolder.getContext().setAuthentication(authentication);

      filterChain.doFilter(request, response);
    } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException
        | SignatureException | IllegalArgumentException | NoSuchAlgorithmException
        | InvalidKeySpecException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      Cookie authCookie = new Cookie("authCookie", "");
      authCookie.setPath("/api");
      authCookie.setMaxAge(0);
      response.addCookie(authCookie);
      response.sendError(403);

    }
  }
}
