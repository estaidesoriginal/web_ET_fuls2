package com.example.Login_Registro.dto;

// BORRAMOS import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

// BORRAMOS @Data
public class RegistroRequest {
    
    private String nombre;
    private String apellido;
    
    @JsonProperty(value = "correo", access = JsonProperty.Access.WRITE_ONLY)
    private String correo;
    
    @JsonProperty(value = "contrasena", access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;
    
    private String rol;

    // ==========================================
    //   TUS MÉTODOS PERSONALIZADOS (Se quedan)
    // ==========================================

    // Acepta también email y password del frontend
    @JsonProperty("email")
    public void setEmail(String email) {
        this.correo = email;
    }
    
    @JsonProperty("password")
    public void setPassword(String password) {
        this.contrasena = password;
    }

    // ==========================================
    //   GETTERS Y SETTERS (Manuales para reemplazar Lombok)
    // ==========================================

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
