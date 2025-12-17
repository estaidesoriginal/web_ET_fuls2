package com.example.catalogo.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class Producto {
    private Long id;
    
    // Aceptamos "name" (DB/Frontend Nuevo) o "nombre" (Frontend Viejo)
    @JsonAlias("nombre")
    private String name;
    
    @JsonAlias("descripcion")
    private String description;
    
    // Aceptamos "precio" (Español) y "price" (Inglés)
    @JsonAlias("precio")
    private Integer price;
    
    @JsonAlias("imagen")
    private String image;
    
    private String video;
    
    // ⚠️ AQUÍ ESTÁ LA MAGIA PARA QUE FUNCIONE LA CATEGORÍA
    // Supabase nos manda "categoria_id".
    // Frontend nos manda "categoryId".
    // Java guardará cualquiera de los dos en esta variable.
    @JsonProperty("categoria_id")
    @JsonAlias("categoryId")
    private Long categoriaId;
    
    // Campo opcional por si acaso
    private Integer stock;
}