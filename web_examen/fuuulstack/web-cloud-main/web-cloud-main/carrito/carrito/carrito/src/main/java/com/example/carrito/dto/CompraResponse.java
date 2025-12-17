package com.example.carrito.dto;

import lombok.Data;

@Data
public class CompraResponse {
    private int compraId;
    private String fecha;
    private String estado;
}
