package com.example.Login_Registro.model;

import jakarta.persistence.*; // IMPORTANTE: Importar las anotaciones de persistencia

@Entity // 1. Indica que esto es una Tabla de Base de Datos
@Table(name = "usuarios") // 2. (Opcional) El nombre real de la tabla en Supabase. Si se llama 'usuario', cámbialo aquí.
public class Usuario {
    
    @Id // 3. Indica que este es el ID (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 4. Indica que Supabase genera el ID automáticamente (Auto-increment)
    private Integer id; 

    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String rol;

    // ==========================================
    //    GETTERS Y SETTERS (Manuales)
    // ==========================================

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
