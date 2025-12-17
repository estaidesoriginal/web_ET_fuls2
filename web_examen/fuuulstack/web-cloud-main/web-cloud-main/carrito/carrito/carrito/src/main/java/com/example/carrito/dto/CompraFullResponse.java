package com.example.carrito.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompraFullResponse {
    private Integer id;
    private Integer usuarioId;
    private String nombre;
    private String apellido;
    private String correo;
    private Integer total;
    private String fecha;
    private String estado;
    private String direccion;
    private String indicaciones;
    private List<CompraDetalleResponse> detalles;
}
