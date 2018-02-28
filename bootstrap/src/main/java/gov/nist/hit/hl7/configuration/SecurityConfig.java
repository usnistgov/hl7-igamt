package gov.nist.hit.hl7.configuration;

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


	@Override
	protected void configure (AuthenticationManagerBuilder auth) throws Exception{
	
	
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// TODO Auto-generated method stub
		http.csrf().disable();
		http.formLogin().disable();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.authorizeRequests().antMatchers("**/login/**", "**/register/**").permitAll();
		http.authorizeRequests().antMatchers("api/accounts/login/**", "**/register/**").permitAll();

		
		http.authorizeRequests().antMatchers("/api/**").fullyAuthenticated();
		
		http.addFilter(new JWTAuthenticationFilter(authenticationManager()));
		http.addFilterBefore(new JWTAuthorizationFilter() , UsernamePasswordAuthenticationFilter.class);  
		
		
		//super.configure(http);
	}


	
}
