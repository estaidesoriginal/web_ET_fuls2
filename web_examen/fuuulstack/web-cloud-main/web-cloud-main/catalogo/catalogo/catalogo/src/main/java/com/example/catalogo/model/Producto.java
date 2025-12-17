package com.example.catalogo.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

// BORRAMOS @Data <--- ¡Adiós Lombok!
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
    @JsonProperty("categoria_id")
    @JsonAlias("categoryId")
    private Long categoriaId;
    
    // Campo opcional por si acaso
    private Integer stock;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
