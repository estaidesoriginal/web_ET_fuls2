import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ productos }) {
  return (
    <div className="grid-container">
      {productos.map(p => <ProductCard key={p.id} producto={p} />)}
    </div>
  );
}
