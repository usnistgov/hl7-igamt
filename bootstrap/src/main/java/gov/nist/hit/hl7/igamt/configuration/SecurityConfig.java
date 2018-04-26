package gov.nist.hit.hl7.igamt.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{


	@Autowired
	private JWTAuthenticationFilter authFilter;
	
	@Override
	protected void configure (AuthenticationManagerBuilder auth) throws Exception{
	
	
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// TODO Auto-generated method stub
		http.csrf().disable()
//		http.formLogin().disable();
//		sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		.authorizeRequests().antMatchers("/login").permitAll()
		.antMatchers("/register").permitAll()
		.antMatchers("/api/**").fullyAuthenticated()
		.and().addFilterBefore(authFilter,UsernamePasswordAuthenticationFilter.class);  
		
		
	}


	
}
