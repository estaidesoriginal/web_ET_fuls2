package com.example.Login_Registro.service;

import com.example.Login_Registro.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final WebClient webClient;
    private static final String TABLA = "/rest/v1/usuarios";

    // ===========================================================
    // REGISTRO
    // ===========================================================
    public Mono<AuthResponse> registrar(RegistroRequest request) {

        // 1. Construimos el mapa manual para asegurarnos de NO enviar ID
        Map<String, Object> body = new HashMap<>();
        body.put("nombre", request.getNombre());
        body.put("apellido", request.getApellido());
        body.put("correo", request.getCorreo());
        body.put("contrasena", request.getContrasena());
        // Aseguramos que el rol tenga valor por defecto
        body.put("rol", request.getRol() != null ? request.getRol() : "ROLE_USER");

        return webClient.post()
                .uri(TABLA)
                // IMPORTANTE: Este header le dice a Supabase "Devuélveme el dato creado"
                .header("Prefer", "return=representation") 
                .bodyValue(body) // Enviamos el mapa limpio
                .retrieve()
                .bodyToFlux(Usuario.class)
                .next()
                .map(u -> new AuthResponse(
                        "Usuario registrado correctamente",
                        u.getId(),
                        u.getNombre(),
                        u.getApellido(),
                        u.getCorreo(),
                        u.getRol()
                ));
    }

    // ===========================================================
    // LOGIN
    // ===========================================================
    public Mono<AuthResponse> login(LoginRequest request) {

    return webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path(TABLA)
                    .queryParam("correo", "eq." + request.getCorreo())
                    .queryParam("select", "*")
                    .build())
            .retrieve()
            .bodyToFlux(Usuario.class)
            .next()
            .flatMap(usuario -> {
                // Contraseña incorrecta
                if (!usuario.getContrasena().equals(request.getContrasena())) {
                    return Mono.error(new RuntimeException("Contraseña incorrecta"));
                }

                // Login exitoso
                return Mono.just(new AuthResponse(
                        "Login exitoso",
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getApellido(),
                        usuario.getCorreo(),
                        usuario.getRol()
                ));
            })
            .switchIfEmpty(Mono.error(new RuntimeException("Correo no registrado")));
}



    // ===========================================================
    // LISTAR USUARIOS
    // ===========================================================
    public Flux<Usuario> listarUsuarios() {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(TABLA)
                        .queryParam("select", "*")
                        .build())
                .retrieve()
                .bodyToFlux(Usuario.class);
    }

    public Flux<Usuario> listarUsuariosPorRol(String rol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(TABLA)
                        .queryParam("rol", "eq." + rol)
                        .queryParam("select", "*")
                        .build())
                .retrieve()
                .bodyToFlux(Usuario.class);
    }

    // ===========================================================
    // OBTENER POR ID
    // ===========================================================
    public Mono<Usuario> obtenerUsuarioPorId(Integer id) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(TABLA)
                        .queryParam("id", "eq." + id)
                        .queryParam("select", "*")
                        .build())
                .retrieve()
                .bodyToFlux(Usuario.class)
                .next();
    }

    // ===========================================================
    // ACTUALIZAR USUARIO
    // ===========================================================
    public Mono<AuthResponse> actualizarUsuario(Integer id, UsuarioUpdateRequest request) {
        Map<String, Object> body = new HashMap<>();
        
        // Validación para solo enviar lo que no es nulo
        if (request.getNombre() != null && !request.getNombre().isBlank()) body.put("nombre", request.getNombre());
        if (request.getApellido() != null && !request.getApellido().isBlank()) body.put("apellido", request.getApellido());
        if (request.getCorreo() != null && !request.getCorreo().isBlank()) body.put("correo", request.getCorreo().toLowerCase());
        if (request.getRol() != null && !request.getRol().isBlank()) body.put("rol", request.getRol().toUpperCase());
        if (request.getContrasena() != null && !request.getContrasena().isBlank()) body.put("contrasena", request.getContrasena());

        return webClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path(TABLA)
                        .queryParam("id", "eq." + id)
                        .build())
                .header("Prefer", "return=representation") // Header necesario también al actualizar
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(Usuario.class)
                .next()
                .map(u -> new AuthResponse(
                        "Usuario actualizado correctamente",
                        u.getId(), u.getNombre(), u.getApellido(), u.getCorreo(), u.getRol()
                ))
                .onErrorResume(err -> Mono.just(new AuthResponse("Error actualizando usuario", null, null, null, null, null)));
    }

    // ===========================================================
    // ELIMINAR USUARIO
    // ===========================================================
    public Mono<AuthResponse> eliminarUsuario(Integer id) {
        return webClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path(TABLA)
                        .queryParam("id", "eq." + id)
                        .build())
                .retrieve()
                .bodyToMono(Void.class)
                .then(Mono.just(new AuthResponse(
                        "Usuario eliminado correctamente",
                        null, null, null, null, null
                )));
    }
}