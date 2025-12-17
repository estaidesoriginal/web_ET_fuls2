package com.example.catalogo.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ProductoCreateDTO {

    // Aceptamos "name" (Nuevo Frontend) o "nombre" (Viejo Frontend)
    @JsonAlias("nombre")
    private String name;

    @JsonAlias("precio")
    private Integer price; // Tu DB dice integer, así que usamos Integer

    @JsonAlias("descripcion")
    private String description;

    @JsonAlias("imagen")
    private String image;

    // ⚠️ CAMBIO IMPORTANTE:
    // Ahora recibimos un ID numérico, no un texto.
    // El frontend envía "categoryId", aquí lo capturamos.
    @JsonProperty("categoryId")
    @JsonAlias("categoria_id") 
    private Long categoriaId;
    

}