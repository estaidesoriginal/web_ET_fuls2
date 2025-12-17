package com.example.carrito.dto;

// BORRAMOS import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

// BORRAMOS @Data
public class CompraItemDTO {
    
    @JsonProperty("productoId")
    private Integer productoId;
    
    private String productoNombre;
    private String consola;
    private int cantidad;
    
    private int precio;
    
    // ==========================================
    //   TU MÉTODO PERSONALIZADO (Se queda)
    // ==========================================
    // Acepta también precioUnitario del frontend
    @JsonProperty("precioUnitario")
    public void setPrecioUnitario(int precioUnitario) {
        this.precio = precioUnitario;
    }

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
    }

    public String getConsola() {
        return consola;
    }

    public void setConsola(String consola) {
        this.consola = consola;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public int getPrecio() {
        return precio;
    }

    public void setPrecio(int precio) {
        this.precio = precio;
    }
}
