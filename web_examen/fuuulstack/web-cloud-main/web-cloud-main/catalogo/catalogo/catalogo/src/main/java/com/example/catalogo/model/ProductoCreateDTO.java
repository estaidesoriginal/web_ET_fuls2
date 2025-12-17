package com.example.catalogo.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

// BORRAMOS @Data
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

    // ⚠️ Agregado porque ProductoService lo pedía en el error anterior
    private String video;

    // ⚠️ CAMBIO IMPORTANTE:
    // Ahora recibimos un ID numérico, no un texto.
    // El frontend envía "categoryId", aquí lo capturamos.
    @JsonProperty("categoryId")
    @JsonAlias("categoria_id") 
    private Long categoriaId;
    
    // ⚠️ Agregado porque ProductoService lo pedía en el error anterior
    private Integer stock;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
