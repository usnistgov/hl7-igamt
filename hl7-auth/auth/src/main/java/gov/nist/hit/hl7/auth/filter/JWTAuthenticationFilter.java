package gov.nist.hit.hl7.auth.filter;

import java.io.IOException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Collections;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.auth.util.crypto.CryptoUtil;
import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JWTAuthenticationFilter extends AbstractAuthenticationProcessingFilter {


  @Autowired
  private ShaPasswordEncoder encoder;
  @Autowired
  private CryptoUtil crypto;
  @Autowired
  Environment env;

  public JWTAuthenticationFilter(String url, AuthenticationManager authenticationManager) {
    super(new AntPathRequestMatcher(url));
    setAuthenticationManager(authenticationManager);

  }


  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
      HttpServletResponse response)
      throws AuthenticationException, JsonParseException, JsonMappingException, IOException {

    ObjectMapper mapper = new ObjectMapper().configure(
        com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    LoginRequest creds = new LoginRequest();

    creds = mapper.readValue(request.getInputStream(), LoginRequest.class);

    creds.setPassword(encoder.encodePassword(creds.getPassword(), creds.getUsername()));
    Authentication ret =
        getAuthenticationManager().authenticate(new UsernamePasswordAuthenticationToken(
            creds.getUsername(), creds.getPassword(), Collections.emptyList()));
    return ret;
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain, Authentication authResult) throws IOException, ServletException {
    User springUser = (User) authResult.getPrincipal();

    String jwt;
    try {
      Key privateKey = crypto.priv(env.getProperty("key.private"));
      jwt = Jwts.builder().setSubject(springUser.getUsername())
          .setExpiration(new Date(System.currentTimeMillis()
              + gov.nist.hit.hl7.auth.util.crypto.SecurityConstants.EXPIRATION_DATE))
          .signWith(SignatureAlgorithm.RS256, privateKey)
          .claim("roles", springUser.getAuthorities()).compact();
      response.addHeader("Authorization", jwt);

    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      e.printStackTrace();
    }
  }
}
