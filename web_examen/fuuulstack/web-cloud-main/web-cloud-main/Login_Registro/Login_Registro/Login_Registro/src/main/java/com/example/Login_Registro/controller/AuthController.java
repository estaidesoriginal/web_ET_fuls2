package com.example.Login_Registro.controller;

import com.example.Login_Registro.model.*;
import com.example.Login_Registro.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/auth")
// 👇 ESTO ES LA SOLUCIÓN: Permitimos ambas direcciones comunes de React
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Mono<AuthResponse> registrar(@RequestBody RegistroRequest request) {
        return authService.registrar(request);
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody LoginRequest request) {
        return authService.login(request)
                .map(ResponseEntity::ok)
                .onErrorResume(err ->
                        Mono.just(ResponseEntity.status(401)
                                .body(new AuthResponse(err.getMessage(), null, null, null, null, null)))
                );
    }


    // ... (Mantén el resto de tus métodos igual: listarUsuarios, etc.)
    @GetMapping("/usuarios")
    public Flux<Usuario> listarUsuarios(@RequestParam(required = false) String rol) {
        if (rol != null) return authService.listarUsuariosPorRol(rol);
        return authService.listarUsuarios();
    }
    
    @GetMapping("/usuarios/{id}")
    public Mono<Usuario> obtenerUsuarioPorId(@PathVariable Integer id) {
        return authService.obtenerUsuarioPorId(id);
    }
}
