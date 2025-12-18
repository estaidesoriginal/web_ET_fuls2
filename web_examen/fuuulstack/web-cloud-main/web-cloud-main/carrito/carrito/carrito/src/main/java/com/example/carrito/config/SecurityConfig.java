package com.example.carrito.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Habilitar CORS explícitamente y desactivar CSRF (para APIs REST)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) 
            
            // 2. Configurar rutas públicas (ajusta según tus necesidades)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // ⚠️ IMPORTANTE: Permitir acceso a las APIs
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ⚠️ AQUÍ ESTÁ LA CLAVE: Poner EXACTAMENTE tu URL del Frontend
        // No uses "*", usa la URL de Render y localhost para pruebas
        configuration.setAllowedOrigins(Arrays.asList(
            "https://perfumeria-sahur-web-com.onrender.com", 
            "http://localhost:5173" 
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true); // Permitir cookies/credenciales

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
