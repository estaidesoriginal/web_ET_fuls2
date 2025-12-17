import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

describe('Register Component', () => {
  it('renderiza el formulario de registro', () => {
    render(<Register onRegister={() => {}} onSwitchToLogin={() => {}} />);
    
    expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  it('valida que las contraseñas coincidan', () => {
    const onRegister = vi.fn();
    render(<Register onRegister={onRegister} onSwitchToLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(/Tu nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/Tu apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText(/tu@email\.com/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu contraseña/i), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    expect(onRegister).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalled();
  });

  it('permite cambiar a login', () => {
    const onSwitch = vi.fn();
    render(<Register onRegister={() => {}} onSwitchToLogin={onSwitch} />);

    fireEvent.click(screen.getByText(/Inicia sesión aquí/i));
    expect(onSwitch).toHaveBeenCalled();
  });
});