import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de Supabase
vi.mock('./lib/supabase', () => ({
  getSupabase: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
        })
      })
    })
  })
}));

describe('App Component', () => {
  it('renderiza el header con logo', () => {
    render(<App />);
    const logo = screen.getByAlt(/Perfumería Sahur/i);
    expect(logo).toBeInTheDocument();
  });

  it('muestra navegación para usuarios no autenticados', () => {
    render(<App />);
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it('renderiza el footer', () => {
    render(<App />);
    expect(screen.getByText(/Fragancias que cuentan tu historia/i)).toBeInTheDocument();
  });
});

{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}