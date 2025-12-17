package com.example.catalogo.service;

import com.example.catalogo.model.Producto;
import com.example.catalogo.model.ProductoCreateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final WebClient webClient;

    // Se inyecta pero NO se usa en uri() porque WebClient ya tiene la baseUrl configurada
    @Value("${supabase.url}")
    private String supabaseUrl;

    public Flux<Producto> obtenerTodos() {
        return webClient.get()
                .uri("/productos?select=*")
                .retrieve()
                .bodyToFlux(Producto.class);
    }

    public Mono<Producto> obtenerPorId(Long id) {
        return webClient.get()
                .uri("/productos?select=*&id=eq." + id)
                .retrieve()
                .bodyToFlux(Producto.class)
                .next();
    }

    public Mono<Producto> crearProducto(ProductoCreateDTO dto) {
        Map<String, Object> body = new HashMap<>();

        body.put("name", dto.getName());
        body.put("price", dto.getPrice());
        body.put("description", dto.getDescription());
        body.put("image", dto.getImage());
        body.put("categoria_id", dto.getCategoriaId() != null ? dto.getCategoriaId() : 1);

        return webClient.post()
                .uri("/productos")
                .header("Prefer", "return=representation")
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(Producto.class)
                .next();
    }

    public Mono<Producto> actualizarProducto(Long id, Producto producto) {
        Map<String, Object> updates = new HashMap<>();

        if (producto.getName() != null) updates.put("name", producto.getName());
        if (producto.getDescription() != null) updates.put("description", producto.getDescription());
        if (producto.getImage() != null) updates.put("image", producto.getImage());
        if (producto.getVideo() != null) updates.put("video", producto.getVideo());
        if (producto.getPrice() != null) updates.put("price", producto.getPrice());
        if (producto.getCategoriaId() != null) updates.put("categoria_id", producto.getCategoriaId());
        if (producto.getStock() != null) updates.put("stock", producto.getStock());

        return webClient.patch()
                .uri("/productos?id=eq." + id)
                .header("Prefer", "return=representation")
                .bodyValue(updates)
                .retrieve()
                .bodyToFlux(Producto.class)
                .next();
    }

    public Mono<Void> eliminarProducto(Long id) {

        System.out.println("🗑️ Eliminando producto ID: " + id);

        return webClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/productos")
                        .queryParam("id", "eq." + id)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(
                                        new RuntimeException("Error DELETE Supabase: " + body)
                                ))
                )
                .bodyToMono(Void.class);
    }
}




