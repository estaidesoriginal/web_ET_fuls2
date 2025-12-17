import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  const mockProducts = [
    { id: 1, name: 'Producto Test', price: 50000, image: 'test.jpg', description: 'Test' }
  ];

  it('renderiza el título principal', () => {
    render(<Home products={mockProducts} onAddToCart={() => {}} />);
    expect(screen.getByText(/Bienvenido a Perfumería Sahur/i)).toBeInTheDocument();
  });

  it('muestra la sección de más vendidos', () => {
    render(<Home products={mockProducts} onAddToCart={() => {}} />);
    expect(screen.getByText(/Los Más Vendidos/i)).toBeInTheDocument();
  });

  it('permite agregar producto al carrito', () => {
    const onAddToCart = vi.fn();
    render(<Home products={mockProducts} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByText(/Agregar al Carrito/i));
    expect(onAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});