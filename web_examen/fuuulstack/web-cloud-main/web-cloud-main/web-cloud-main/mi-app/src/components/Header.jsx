import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

export default function Header() {
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <img src="/logo_1.png" alt="Logo" />
        </div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Productos</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </nav>
        <div className="login-carrito">
          {user ? <span>Hola, {user.nombre}</span> : <a href="/login">Iniciar Sesión</a>}
          <div className="carrito">
            <span className="carrito-icon">🛒</span>
            <span className="carrito-count">{cart.length}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
