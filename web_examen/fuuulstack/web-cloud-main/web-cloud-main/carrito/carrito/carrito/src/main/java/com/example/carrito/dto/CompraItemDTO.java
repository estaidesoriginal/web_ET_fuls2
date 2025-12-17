package com.example.carrito.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class CompraItemDTO {
    
    @JsonProperty("productoId")
    private Integer productoId;
    
    private String productoNombre;
    private String consola;
    private int cantidad;
    
    private int precio;
    
    // Acepta también precioUnitario del frontend
    @JsonProperty("precioUnitario")
    public void setPrecioUnitario(int precioUnitario) {
        this.precio = precioUnitario;
    }
}