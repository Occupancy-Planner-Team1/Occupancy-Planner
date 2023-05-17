package it.designers.OCCUPANCY.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    public static final String TEAMLEITER    = "temleiter";
    public static final String PROJEKTLEITER = "projektleiter";
    public static final String MITARBEITER   = "mitarbeiter";
    private final JwtAuthConverter jwtAuthConverter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests()
                .requestMatchers(HttpMethod.GET, "/auth/anonymous", "/test/anonymous/**").permitAll()
    //            .requestMatchers(HttpMethod.GET, "/test/admin", "/test/admin/**").hasRole(TEAMLEITER)
                .requestMatchers(HttpMethod.GET, "/auth/*").hasAnyRole(TEAMLEITER, PROJEKTLEITER, MITARBEITER)

    //            .requestMatchers(HttpMethod.POST, "/test/anonymous", "/test/anonymous/**").permitAll()
    //            .requestMatchers(HttpMethod.POST, "/test/admin", "/test/admin/**").hasRole(TEAMLEITER)
    //            .requestMatchers(HttpMethod.POST, "/test/user").hasAnyRole(TEAMLEITER, PROJEKTLEITER)
                .anyRequest().authenticated();
        http.oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(jwtAuthConverter);
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        return http.build();
    }

}
