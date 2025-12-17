package com.example.Login_Registro.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String contrasena;

    public String getCorreo() { return correo; }
    public String getContrasena() { return contrasena; }

    // setters alternativos desde frontend en inglés
    public void setEmail(String email) { this.correo = email; }
    public void setPassword(String password) { this.contrasena = password; }

    // setters estándar
    public void setCorreo(String correo) { this.correo = correo; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}
