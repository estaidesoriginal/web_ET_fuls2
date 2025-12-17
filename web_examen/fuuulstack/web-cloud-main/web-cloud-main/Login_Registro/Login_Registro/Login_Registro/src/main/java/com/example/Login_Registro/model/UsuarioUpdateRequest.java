package com.example.Login_Registro.model;

// BORRAMOS import lombok.Data;

// BORRAMOS @Data
public class UsuarioUpdateRequest {
    
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    private String contrasena;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
