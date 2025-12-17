package com.example.Login_Registro.model;

import lombok.Data;

@Data
public class UsuarioUpdateRequest {
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    private String contrasena;
}
