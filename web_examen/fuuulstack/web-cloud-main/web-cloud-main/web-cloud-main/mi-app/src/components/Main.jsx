import React, { useState, useEffect } from "react"; // Agregamos useEffect
import Popup from "./Popup";
import ProductCard from "./ProductCard";
// ELIMINAMOS la importación de datos falsos
// import { productos } from "../data/productos"; 

export default function Main() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  
  // Nuevo estado para guardar los productos que vienen de la API
  const [productos, setProductos] = useState([]); 

  // Este efecto se ejecuta al cargar la página
  useEffect(() => {
    fetch('https://mi-backend-spring-catalogo.onrender.com/productos') // Puerto del Catálogo
      .then(res => res.json())
      .then(data => {
        setProductos(data); // Guardamos los datos de la API
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const handleAddToCart = (producto) => {
    setPopupContent(`${producto.nombre} agregado al carrito`); // Asegúrate que tu API devuelve 'nombre' y no 'name'
    setShowPopup(true);
    // Aquí deberías llamar también a la función global de agregar al carrito si existe
  };

  const handleClosePopup = () => setShowPopup(false);

  return (
    <div>
      <h1>Productos Destacados</h1>
      <div className="grid-container">
        {/* Renderizamos la lista que vino de la API */}
        {productos.length > 0 ? (
          productos.map((p) => (
            <ProductCard key={p.id} producto={p} onAddToCart={() => handleAddToCart(p)} />
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>

      <Popup show={showPopup} onClose={handleClosePopup} title="Notificación">
        <p>{popupContent}</p>
        <button onClick={handleClosePopup}>Cerrar</button>
      </Popup>
    </div>
  );
}