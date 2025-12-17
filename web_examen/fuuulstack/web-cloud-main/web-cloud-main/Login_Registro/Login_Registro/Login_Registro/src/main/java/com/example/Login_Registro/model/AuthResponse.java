package com.example.Login_Registro.model;

import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
}
