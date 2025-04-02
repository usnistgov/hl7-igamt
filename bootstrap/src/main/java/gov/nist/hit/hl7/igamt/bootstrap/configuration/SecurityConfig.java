package gov.nist.hit.hl7.igamt.bootstrap.configuration;

import gov.nist.hit.hl7.igamt.auth.config.TokenAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import gov.nist.hit.hl7.igamt.auth.config.JWTAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private TokenAuthenticationService tokenAuthenticationService;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {}

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // TODO Auto-generated method stub
    http.csrf().disable()
        // http.formLogin().disable();
        // sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        .authorizeRequests().antMatchers("/api/login").permitAll().antMatchers("/api/register")
        .permitAll().antMatchers("/api/password/**").permitAll().antMatchers("/api/config/**")
        .permitAll().antMatchers("/api/documentations/getAll")
        .permitAll().antMatchers("/api/storage/file")
        .permitAll().antMatchers("/api/users")
        .permitAll().antMatchers("/api/user/**")
        .permitAll().antMatchers("/api/**")
        .fullyAuthenticated().and()
        .addFilterBefore(getUserAuthenticationFilter("/api/**"), UsernamePasswordAuthenticationFilter.class);
  }

  public JWTAuthenticationFilter getUserAuthenticationFilter(String path) {
    return new JWTAuthenticationFilter(path, this.tokenAuthenticationService);
  }

}
