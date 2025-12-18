package com.example.Login_Registro.controller; // ⚠️ AJUSTA A TU PAQUETE REAL

import com.example.Login_Registro.model.Usuario; // ⚠️ AJUSTA A TU PAQUETE REAL
import com.example.Login_Registro.service.UsuarioService; // ⚠️ AJUSTA A TU PAQUETE REAL
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // ✅ Esto coincide con tu Frontend
@CrossOrigin(origins = "*")      // ✅ Permite acceso desde cualquier lado (para probar)
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET: Para la tabla de Admin
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    // POST: Para Login (Tu frontend llama a /api/usuarios/login)
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        return usuarioService.login(usuario.getCorreo(), usuario.getContrasena());
    }
    
    // POST: Para Registro
    @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioService.guardarUsuario(usuario);
    }
}
