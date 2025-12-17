package com.example.carrito.dto;

import lombok.Data;

@Data
public class CompraDetalleResponse {
    private Integer id;
    private Integer compraId;
    private String productoNombre;
    private String consola;
    private Integer cantidad;
    private Integer precio;
}