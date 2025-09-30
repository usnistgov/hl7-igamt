package gov.nist.hit.hl7.igamt.bootstrap.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import gov.nist.hit.hl7.igamt.auth.config.JWTAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Autowired
  private JWTAuthenticationFilter authFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorizeRequests ->
            authorizeRequests
                    .requestMatchers("/api/login").not().authenticated()
                    .requestMatchers("/api/register").not().authenticated()
                    .requestMatchers("/api/password/**").not().authenticated()
                    .requestMatchers("/api/config/**").permitAll()
                    .requestMatchers("/api/documentations/getAll").permitAll()
                    .requestMatchers("/api/storage/file").permitAll()
                    .requestMatchers("/api/users").permitAll()
                    .requestMatchers("/api/user/**").permitAll()
                    .requestMatchers("/api/**").fullyAuthenticated()
                    .anyRequest().permitAll()
    );
    http.csrf(AbstractHttpConfigurer::disable);
    http.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}
