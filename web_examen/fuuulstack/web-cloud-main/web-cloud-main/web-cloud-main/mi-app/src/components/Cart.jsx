





import React, { useState, useEffect } from "react";

export default function Cart({ cart, setCart, user }) {
  const [total, setTotal] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + (item.price || item.precio) * (item.quantity || 1), 0);
    setTotal(sum);
    localStorage.setItem("carrito", JSON.stringify(cart));
  }, [cart]);

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handlePay = async () => {
    if (cart.length === 0) {
      setSuccessMsg("Carrito vacío.");
      setTimeout(() => setSuccessMsg("") , 2500);
      return;
    }
    setLoading(true);
    try {
      if (!user || !user.id) {
        setSuccessMsg("Debes iniciar sesión para comprar.");
        setTimeout(() => setSuccessMsg("") , 2500);
        setLoading(false);
        return;
      }
      let nombreFinal = user.name || user.nombre || "Cliente";
      let apellidoFinal = user.apellido || "";
      if (user.name && !user.apellido) {
        const parts = user.name.split(' ');
        nombreFinal = parts[0];
        apellidoFinal = parts.slice(1).join(' ') || "";
      }
      const compraPayload = {
        usuarioId: user.id,
        nombre: nombreFinal,
        apellido: apellidoFinal,
        email: user.email || user.correo,
        direccion: "Dirección Web",
        indicaciones: "Compra desde Frontend",
        total: total,
        items: cart.map(item => ({
          productoId: item.id,
          productoNombre: item.name || item.nombre,
          consola: item.console || item.category || "General",
          precio: item.price || item.precio,
          cantidad: item.quantity || 1
        }))
      };
      const response = await fetch('http://localhost:8082/api/carrito/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraPayload),
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessMsg(`¡Compra Exitosa! ID de pedido: #${data.compraId || data.id}`);
        clearCart();
        setTimeout(() => setSuccessMsg("") , 4000);
      } else {
        setSuccessMsg("Hubo un problema al procesar la compra.");
        setTimeout(() => setSuccessMsg("") , 4000);
      }
    } catch (err) {
      setSuccessMsg("No se pudo conectar con el servidor de pagos (8082).");
      setTimeout(() => setSuccessMsg("") , 4000);
    }
    setLoading(false);
  };

  return (
    <div className="cart-content">
      <div className="cart-items-list">
        {cart.length === 0 ? (
          <div className="empty-cart-page">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          cart.map((p, i) => (
            <div className="cart-item-card" key={i}>
              <img className="cart-product-image" src={p.image} alt={p.nombre || p.name} />
              <div className="cart-product-info">
                <h3>{p.nombre || p.name}</h3>
                <p className="cart-product-description">{p.description}</p>
                <p className="cart-product-price">Precio unitario: ${(p.precio || p.price).toLocaleString('es-CL')}</p>
              </div>
              <div className="cart-product-actions">
                <div className="quantity-selector">
                  <button onClick={() => setCart(cart.map((item, idx) => idx === i ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) } : item))}>-</button>
                  <input type="number" min={1} value={p.quantity || 1} onChange={e => setCart(cart.map((item, idx) => idx === i ? { ...item, quantity: Math.max(1, parseInt(e.target.value) || 1) } : item))} />
                  <button onClick={() => setCart(cart.map((item, idx) => idx === i ? { ...item, quantity: (item.quantity || 1) + 1 } : item))}>+</button>
                </div>
                <p className="cart-product-price">Subtotal: {((p.precio || p.price) * (p.quantity || 1)).toLocaleString('es-CL')}</p>
                <button className="remove-item-button" onClick={() => removeItem(i)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h3>Resumen</h3>
        <p>Total: <strong>${total.toLocaleString('es-CL')}</strong></p>
        <button className="checkout-btn" onClick={handlePay} disabled={loading || cart.length === 0}>{loading ? 'Procesando...' : 'Pagar Ahora'}</button>
        {successMsg && (
          <div style={{
            background: '#222',
            color: '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '18px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            letterSpacing: '1px',
            boxShadow: '0 2px 12px rgba(255,215,0,0.08)'
          }}>{successMsg}</div>
        )}
      </div>
    </div>
  );
}
