package com.example.Login_Registro.service;

import com.example.Login_Registro.model.Usuario;
import com.example.Login_Registro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // PARA ADMIN
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // LOGIN
    public Usuario login(String correo, String contrasena) {
        return usuarioRepository
                .findByCorreoAndContrasena(correo, contrasena)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // REGISTRO
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}

