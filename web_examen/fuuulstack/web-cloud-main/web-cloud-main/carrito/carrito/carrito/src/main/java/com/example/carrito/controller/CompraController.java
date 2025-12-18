package com.example.carrito.controller;

import com.example.carrito.dto.CompraRequest;
import com.example.carrito.dto.CompraResponse;
import com.example.carrito.service.CompraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")

@RestController
@RequestMapping("/api/carrito/compras")

public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @PostMapping
    public ResponseEntity<?> crearCompra(@RequestBody CompraRequest request) {
        try {
            System.out.println("📥 LLEGÓ UNA COMPRA AL BACKEND");
            Map<String, Object> createdCompra = compraService.crearCompra(request);

            CompraResponse resp = new CompraResponse();
            Number idNum = (Number) createdCompra.get("id");
            resp.setCompraId(idNum == null ? 0 : idNum.intValue());

            Object fechaObj = createdCompra.get("fecha");
            resp.setFecha(fechaObj == null ? java.time.OffsetDateTime.now().toString() : fechaObj.toString());
            resp.setEstado((String) createdCompra.getOrDefault("estado", "pendiente"));

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al crear la compra", "error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listarCompras() {
        try {
            List<Map<String, Object>> lista = compraService.listarCompras();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCompra(@PathVariable Integer id) {
        try {
            Map<String, Object> compra = compraService.obtenerCompraPorId(id);
            if (compra == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Compra no encontrada"));
            }
            return ResponseEntity.ok(compra);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    // 👇 MÉTODO NUEVO: Para el cambio de estado (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            System.out.println("🔄 PATCH Recibido para Compra ID: " + id);
            System.out.println("📦 Datos: " + updates);
            
            Map<String, Object> updated = compraService.actualizarCompra(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al actualizar estado", "error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCompra(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            Map<String, Object> updated = compraService.actualizarCompra(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCompra(@PathVariable Integer id) {
        try {
            compraService.eliminarCompra(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }
}
