package com.example.carrito.dto;

// BORRAMOS import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

// BORRAMOS @Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompraRequest {

    // 🛡️ BLINDAJE: Aceptamos todas las variantes posibles
    @JsonProperty("usuarioId")
    @JsonAlias({"usuario_id", "userId", "user_id"})
    private Integer usuarioId;

    @JsonProperty("nombre")
    @JsonAlias("name")
    private String nombre;

    @JsonProperty("apellido")
    @JsonAlias("lastname")
    private String apellido;
    
    // Aceptamos email o correo
    @JsonProperty("correo")
    @JsonAlias({"email", "mail"})
    private String correo;
    
    @JsonProperty("direccion")
    @JsonAlias("address")
    private String direccion;
    
    @JsonProperty("indicaciones")
    @JsonAlias("notes")
    private String indicaciones; // Aunque no lo uses en la DB, lo dejamos para que no rompa el JSON
    
    @JsonProperty("total")
    private Integer total;
    
    // Importante: Asegura que la lista de items se mapee bien
    // (Esta usa el DTO que arreglamos en el paso anterior, así que funcionará perfecto)
    @JsonProperty("items")
    @JsonAlias({"productos", "products", "compra_items"})
    private List<CompraItemDTO> items;

    // ==========================================
    //   GETTERS Y SETTERS (Manuales)
    // ==========================================

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

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public List<CompraItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CompraItemDTO> items) {
        this.items = items;
    }
}
