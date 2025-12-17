package com.example.catalogo.model;

import lombok.Data;

@Data
public class ProductoDestacadoDTO {
    private Integer id;
    private String nombre;
    private String imagen;
    private Integer precio;
    private String consola;

    public ProductoDestacadoDTO(Integer id, String nombre, String imagen, Integer precio, String consola) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.consola = consola;
    }
}
