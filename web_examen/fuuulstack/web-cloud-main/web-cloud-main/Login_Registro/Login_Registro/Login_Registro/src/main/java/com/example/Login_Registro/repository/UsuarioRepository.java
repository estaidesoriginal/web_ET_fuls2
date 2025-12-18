package com.example.Login_Registro.repository;

import com.example.Login_Registro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreoAndContrasena(String correo, String contrasena);
}

