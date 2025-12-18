package com.example.Login_Registro.service;

import com.example.Login_Registro.model.Usuario;
import com.example.Login_Registro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ ERROR 1 SOLUCIONADO: Agregamos el método obtenerTodos
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // ✅ ERROR 2 SOLUCIONADO: Agregamos el método guardarUsuario
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ✅ ERROR 3 SOLUCIONADO: Cambiamos LoginRequest por String, String
    public Usuario login(String correo, String contrasena) {
        // Buscamos por correo
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        
        // Verificamos contraseña
        if (usuario != null && usuario.getContrasena().equals(contrasena)) {
            return usuario;
        }
        return null;
    }
}
