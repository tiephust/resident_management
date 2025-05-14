package management.resident_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins
        config.addAllowedOrigin("http://localhost:3000");
        
        // Allow specific methods
        config.addAllowedMethod("*");
        
        // Allow specific headers
        config.addAllowedHeader("*");

        // Allow credentials (cookies, authorization headers, etc)
        config.setAllowCredentials(true);

        // Expose headers that the frontend needs to read
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Set-Cookie");

        config.setMaxAge(3600L); // Cache preflight requests for 1 hour
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 