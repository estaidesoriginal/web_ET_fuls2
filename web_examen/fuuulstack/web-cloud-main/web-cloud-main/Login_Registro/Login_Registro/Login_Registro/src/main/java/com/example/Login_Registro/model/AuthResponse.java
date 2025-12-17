package com.example.Login_Registro.model;

// BORRAMOS imports de Lombok
// import lombok.Data; 
// import lombok.AllArgsConstructor;
// import lombok.NoArgsConstructor;

public class AuthResponse {
    private String message;
    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;

    // ==========================================
    //   CONSTRUCTORES (Manuales)
    // ==========================================

    // Constructor Vacío (@NoArgsConstructor)
    public AuthResponse() {
    }

    // Constructor Lleno (@AllArgsConstructor)
    public AuthResponse(String message, Integer id, String nombre, String apellido, String correo, String rol) {
        this.message = message;
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
    }

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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
}
