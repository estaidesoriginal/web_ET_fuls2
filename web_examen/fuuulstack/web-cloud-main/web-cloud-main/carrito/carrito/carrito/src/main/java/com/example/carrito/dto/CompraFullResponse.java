package com.example.carrito.dto;

// BORRAMOS import lombok.Data;
import java.util.List;

// BORRAMOS @Data
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
    
    // Esta lista usa la clase que arreglamos justo antes, ¡así que todo encajará bien!
    private List<CompraDetalleResponse> detalles;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public List<CompraDetalleResponse> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<CompraDetalleResponse> detalles) {
        this.detalles = detalles;
    }
}
