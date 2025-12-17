import React from 'react';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <h3>{product.name}</h3>
      <p className="price">${product.price.toLocaleString('es-CL')}</p>
      <p className="description">{product.description}</p>
      <button onClick={() => onAddToCart(product)}>Agregar al Carrito</button>
    </div>
  );
}

export default ProductCard;
