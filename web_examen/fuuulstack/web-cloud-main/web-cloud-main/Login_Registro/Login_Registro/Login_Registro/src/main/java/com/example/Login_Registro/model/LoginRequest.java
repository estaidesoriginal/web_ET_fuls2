package com.example.Login_Registro.model;

// BORRAMOS import lombok.Data;

// BORRAMOS @Data
public class LoginRequest {
    
    private String correo;
    private String contrasena;

    // ==========================================
    //   GETTERS (Ya los tenías)
    // ==========================================
    public String getCorreo() { return correo; }
    public String getContrasena() { return contrasena; }

    // ==========================================
    //   SETTERS (Ya los tenías con lógica extra)
    // ==========================================

    // Setters alternativos desde frontend en inglés (email/password)
    public void setEmail(String email) { this.correo = email; }
    public void setPassword(String password) { this.contrasena = password; }

    // Setters estándar en español
    public void setCorreo(String correo) { this.correo = correo; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}
