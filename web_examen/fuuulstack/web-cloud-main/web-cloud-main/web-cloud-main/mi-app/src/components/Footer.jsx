import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section productos-footer">
          <h3>Premiados en 2024</h3>
          <ul>
            <li><a href="/product/2">Perfume Dulce</a></li>
            <li><a href="/product/6">Perfume Amaderado</a></li>
            <li><a href="/product/1">Perfume Cítrico</a></li>
          </ul>
        </div>
        <div className="footer-section info-footer">
          <h3>Sobre Nosotros</h3>
          <p>Perfumes Sahur ofrece las mejores fragancias importadas y nacionales, con envío a todo el país y atención personalizada.</p>
        </div>
        <div className="footer-section contacto-footer">
          <h3>Contacto</h3>
          <p>Email: contacto@perfumesahur.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Perfumes Sahur. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
