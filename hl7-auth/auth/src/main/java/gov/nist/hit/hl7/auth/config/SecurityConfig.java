package gov.nist.hit.hl7.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import gov.nist.hit.hl7.auth.filter.JWTAuthenticationFilter;
import gov.nist.hit.hl7.auth.filter.JWTAuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	@Autowired
	private AuthenticationManager authManager;
	@Override
	protected void configure (AuthenticationManagerBuilder auth) throws Exception{
		
	}
	
    @Bean
    protected JWTAuthenticationFilter loginFilter() throws Exception{
  	return new JWTAuthenticationFilter("/api/login",authManager );
    }
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// TODO Auto-generated method stub
		http.csrf().disable();
		http.formLogin().disable();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.authorizeRequests().antMatchers("*/login", "/register/").permitAll();
		http.authorizeRequests().antMatchers("/externalLogin/").permitAll();
		http.authorizeRequests().antMatchers("/getRef/").permitAll();

		
//		http.authorizeRequests().antMatchers("/api/**").fullyAuthenticated();
		
		http.addFilterBefore(loginFilter(), UsernamePasswordAuthenticationFilter.class);
		http.addFilterBefore(new JWTAuthorizationFilter() , UsernamePasswordAuthenticationFilter.class);  
		
		
		//super.configure(http);
	}


	
}
