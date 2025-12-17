package com.example.carrito.dto;

// BORRAMOS import lombok.Data;

// BORRAMOS @Data
public class CompraResponse {
    
    private int compraId;
    private String fecha;
    private String estado;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public int getCompraId() {
        return compraId;
    }

    public void setCompraId(int compraId) {
        this.compraId = compraId;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
