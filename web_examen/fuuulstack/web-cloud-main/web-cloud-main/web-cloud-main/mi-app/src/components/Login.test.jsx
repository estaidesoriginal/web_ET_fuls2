import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

// Mock de Supabase
vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ 
            data: { id: 1, nombre: 'Test', apellido: 'User', correo: 'test@example.com' }, 
            error: null 
          })
        })
      })
    })
  })
}));

describe('Login Component', () => {
  it('renderiza el formulario de login', () => {
    render(<Login onLogin={() => {}} onSwitchToRegister={() => {}} />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
  });

  it('permite cambiar a registro', () => {
    const mockSwitch = vi.fn();
    render(<Login onLogin={() => {}} onSwitchToRegister={mockSwitch} />);
    
    const registerButton = screen.getByText(/Regístrate aquí/i);
    fireEvent.click(registerButton);
    
    expect(mockSwitch).toHaveBeenCalled();
  });

  it('valida campos obligatorios', async () => {
    render(<Login onLogin={() => {}} onSwitchToRegister={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    fireEvent.click(submitButton);
    
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    expect(emailInput).toBeRequired();
  });
});