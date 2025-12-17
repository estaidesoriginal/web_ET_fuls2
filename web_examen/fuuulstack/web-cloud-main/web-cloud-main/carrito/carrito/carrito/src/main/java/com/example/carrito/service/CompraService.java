package com.example.carrito.service;

import com.example.carrito.dto.CompraRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompraService {

    private final WebClient supabaseClient;

    @Value("${supabase.key}")
    private String supabaseKey;

    public CompraService(WebClient supabaseClient) {
        this.supabaseClient = supabaseClient;
    }

    // ==========================================
    // CREAR COMPRA (MÉTODO CORREGIDO)
    // ==========================================
    // REEMPLAZA TU MÉTODO crearCompra CON ESTE:
    public Map<String, Object> crearCompra(CompraRequest request) {
        try {
            // 1. Payload de la Compra (Tabla 'compras')
            Map<String, Object> compraPayload = new HashMap<>();
            compraPayload.put("usuario_id", request.getUsuarioId());
            compraPayload.put("nombre", request.getNombre());
            compraPayload.put("apellido", request.getApellido());
            compraPayload.put("correo", request.getCorreo());
            compraPayload.put("total", request.getTotal());
            
            // Usamos LocalDateTime o string ISO simple
            compraPayload.put("fecha", OffsetDateTime.now().toString());
            
            // ⚠️ CORRECCIÓN CLAVE: Enviamos "pendiente" en minúsculas para evitar conflictos
            compraPayload.put("estado", "pendiente"); 
            
            compraPayload.put("direccion", request.getDireccion());
            
            // Nota: NO enviamos "indicaciones" porque borraste esa columna de la DB.

            // Insertar cabecera
            @SuppressWarnings("unchecked")
            Map<String, Object>[] createdCompraArr = supabaseClient.post()
                    .uri("/compras")
                    .header("apikey", supabaseKey)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("Prefer", "return=representation") // Esto es vital
                    .bodyValue(compraPayload)
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();

            if (createdCompraArr == null || createdCompraArr.length == 0) {
                throw new RuntimeException("No se pudo crear la compra (Supabase no devolvió datos)");
            }

            Map<String, Object> createdCompra = createdCompraArr[0];
            Number idNum = (Number) createdCompra.get("id");
            Integer compraId = idNum.intValue();

            // 2. Payload de Detalles (Tabla 'compra_detalle')
            List<Map<String, Object>> detallesPayload = request.getItems().stream().map(item -> {
                Map<String, Object> d = new HashMap<>();
                d.put("compra_id", compraId);
                d.put("producto_id", item.getProductoId());
                d.put("producto_nombre", item.getProductoNombre());
                d.put("cantidad", item.getCantidad());
                d.put("precio", item.getPrecio());
                // Sin consola/categoría
                return d;
            }).collect(Collectors.toList());

            // Insertar detalles
            if (!detallesPayload.isEmpty()) {
                try {
                    supabaseClient.post()
                            .uri("/compra_detalle")
                            .header("apikey", supabaseKey)
                            .header("Authorization", "Bearer " + supabaseKey)
                            .header("Prefer", "return=representation") // Importante para no romper
                            .bodyValue(detallesPayload)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .block();
                } catch (Exception e) {
                    // Rollback manual
                    supabaseClient.delete()
                            .uri("/compras?id=eq." + compraId)
                            .header("apikey", supabaseKey)
                            .header("Authorization", "Bearer " + supabaseKey)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .block();
                    throw new RuntimeException("Error al insertar items. Se hizo rollback.", e);
                }
            }

            return createdCompra;

        } catch (Exception finalError) {
            // Imprimir error real en consola para debug
            System.err.println("🔥 Error creando compra: " + finalError.getMessage());
            throw new RuntimeException("Error al crear la compra: " + finalError.getMessage(), finalError);
        }
    }

    // ==========================================
    // OTROS MÉTODOS (MANTENIDOS IGUAL)
    // ==========================================

    public List<Map<String, Object>> listarCompras() {
        @SuppressWarnings("unchecked")
        Map<String, Object>[] comprasArr = supabaseClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/compras")
                        .queryParam("select", "*")
                        .build())
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .retrieve()
                .bodyToMono(Map[].class)
                .block();

        if (comprasArr == null) return Collections.emptyList();

        List<Map<String, Object>> compras = Arrays.asList(comprasArr);

        for (Map<String, Object> compra : compras) {
            Number idNum = (Number) compra.get("id");
            Integer compraId = idNum.intValue();

            @SuppressWarnings("unchecked")
            Map<String, Object>[] detallesArr = supabaseClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/compra_detalle")
                            .queryParam("compra_id", "eq." + compraId)
                            .queryParam("select", "*")
                            .build())
                    .header("apikey", supabaseKey)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();

            List<Map<String, Object>> detalles = detallesArr == null
                    ? Collections.emptyList()
                    : Arrays.asList(detallesArr);

            compra.put("items", detalles); // Usamos 'items' para estandarizar con el frontend
        }

        return compras;
    }

    public Map<String, Object> obtenerCompraPorId(Integer id) {
        @SuppressWarnings("unchecked")
        Map<String, Object>[] compras = supabaseClient.get()
                .uri(uriBuilder -> uriBuilder.path("/compras").queryParam("id", "eq." + id).queryParam("select", "*").build())
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .retrieve()
                .bodyToMono(Map[].class)
                .block();

        if (compras == null || compras.length == 0) return null;

        Map<String, Object> compra = compras[0];

        @SuppressWarnings("unchecked")
        Map<String, Object>[] detalles = supabaseClient.get()
                .uri(uriBuilder -> uriBuilder.path("/compra_detalle").queryParam("compra_id", "eq." + id).queryParam("select", "*").build())
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .retrieve()
                .bodyToMono(Map[].class)
                .block();

        compra.put("items", detalles == null ? Collections.emptyList() : Arrays.asList(detalles));
        return compra;
    }

    public Map<String, Object> actualizarCompra(Integer id, Map<String, Object> updates) {
        try {
            // 1. Filtramos: Solo permitimos actualizar ciertos campos por seguridad
            Map<String, Object> safeUpdates = new HashMap<>();
            
            if (updates.containsKey("estado")) {
                // Aseguramos que el estado vaya en minúsculas si tu DB lo prefiere
                safeUpdates.put("estado", updates.get("estado").toString().toLowerCase());
            }
            // Si quieres permitir actualizar otras cosas, agrégalas aquí:
            if (updates.containsKey("direccion")) safeUpdates.put("direccion", updates.get("direccion"));

            if (safeUpdates.isEmpty()) {
                throw new RuntimeException("No hay datos válidos para actualizar");
            }

            // 2. Enviamos el PATCH a Supabase
            @SuppressWarnings("unchecked")
            Map<String, Object>[] resp = supabaseClient.patch()
                    .uri("/compras?id=eq." + id)
                    .header("apikey", supabaseKey)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("Prefer", "return=representation") // <--- ¡LA CLAVE! Obliga a Supabase a responder
                    .bodyValue(safeUpdates)
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();

            if (resp == null || resp.length == 0) {
                throw new RuntimeException("No se pudo actualizar la compra (ID no encontrado o error Supabase)");
            }
            
            return resp[0];
            
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar compra: " + e.getMessage());
        }
    }

    public void eliminarCompra(Integer id) {
        // Primero detalles
        supabaseClient.delete()
                .uri(uriBuilder -> uriBuilder.path("/compra_detalle").queryParam("compra_id", "eq." + id).build())
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        // Luego cabecera
        supabaseClient.delete()
                .uri(uriBuilder -> uriBuilder.path("/compras").queryParam("id", "eq." + id).build())
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}