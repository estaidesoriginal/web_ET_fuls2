package com.example.carrito.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Data
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
    @JsonProperty("items")
    @JsonAlias({"productos", "products", "compra_items"})
    private List<CompraItemDTO> items;
}