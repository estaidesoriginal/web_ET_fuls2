package com.example.catalogo.controller;

import com.example.catalogo.model.Producto;
import com.example.catalogo.model.ProductoCreateDTO;
import com.example.catalogo.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*")

@RequiredArgsConstructor
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:5173"},
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.PATCH,
        RequestMethod.DELETE
    }
)
@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    public Flux<Producto> obtenerTodos() {
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Mono<Producto> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    public Mono<Producto> crear(@RequestBody ProductoCreateDTO dto) {
        return service.crearProducto(dto);
    }

    @PutMapping("/{id}")
    public Mono<Producto> actualizarPut(@PathVariable Long id, @RequestBody Producto producto) {
        System.out.println("🔄 Solicitud PUT recibida para producto ID: " + id);
        return service.actualizarProducto(id, producto);
    }

    @PatchMapping("/{id}")
    public Mono<Producto> actualizarPatch(@PathVariable Long id, @RequestBody Producto producto) {
        System.out.println("🔄 Solicitud PATCH recibida para producto ID: " + id);
        return service.actualizarProducto(id, producto);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> eliminar(@PathVariable Long id) {
        return service.eliminarProducto(id);
    }

    @GetMapping("/disponibles")
    public Flux<Producto> obtenerDisponibles() {
        return service.obtenerTodos();
    }

    @GetMapping("/destacados")
    public Flux<Producto> obtenerDestacados() {
        return service.obtenerTodos().take(6);
    }

    @GetMapping("/carrusel")
    public Flux<Producto> obtenerCarrusel() {
        return service.obtenerTodos().take(5);
    }

    @GetMapping("/buscar")
    public Flux<Producto> buscarPorNombre(@RequestParam String nombre) {
        return service.obtenerTodos()
                .filter(p -> p.getName() != null &&
                             p.getName().toLowerCase().contains(nombre.toLowerCase()));
    }
}

