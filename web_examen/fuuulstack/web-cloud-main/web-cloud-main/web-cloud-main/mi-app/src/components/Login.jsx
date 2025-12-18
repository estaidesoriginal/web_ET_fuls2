import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://mi-backend-spring-login.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data); // ✅ Llamamos a la función de App
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }

    } catch (err) {
      console.error('Error Login:', err);
      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>

      <p>¿No tienes cuenta? <button onClick={onSwitchToRegister}>Regístrate</button></p>
    </div>
  );
}

export default Login;
