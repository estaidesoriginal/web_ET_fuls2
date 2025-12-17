package com.example.catalogo.model;

import lombok.Data;

public class ProductoDestacadoDTO {
    
    private Integer id;
    private String nombre;
    private String imagen;
    private Integer precio;
    private String consola;

    // Tu constructor original (Lo dejamos tal cual)
    public ProductoDestacadoDTO(Integer id, String nombre, String imagen, Integer precio, String consola) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.consola = consola;
    }

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
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

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Integer getPrecio() {
        return precio;
    }

    public void setPrecio(Integer precio) {
        this.precio = precio;
    }

    public String getConsola() {
        return consola;
    }

    public void setConsola(String consola) {
        this.consola = consola;
    }
}
