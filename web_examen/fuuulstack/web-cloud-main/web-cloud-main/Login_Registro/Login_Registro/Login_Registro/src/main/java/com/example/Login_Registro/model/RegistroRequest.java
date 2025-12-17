package com.example.Login_Registro.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class RegistroRequest {
    private String nombre;
    private String apellido;
    
    @JsonProperty(value = "correo", access = JsonProperty.Access.WRITE_ONLY)
    private String correo;
    
    @JsonProperty(value = "contrasena", access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;
    
    private String rol;
    
    // Acepta también email y password del frontend
    @JsonProperty("email")
    public void setEmail(String email) {
        this.correo = email;
    }
    
    @JsonProperty("password")
    public void setPassword(String password) {
        this.contrasena = password;
    }
}