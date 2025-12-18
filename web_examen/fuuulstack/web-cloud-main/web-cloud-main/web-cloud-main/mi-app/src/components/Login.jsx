import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { authAPI } from '../lib/apiClient'; // Asegúrate de tener tu función de login API

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada a la API de autenticación
      const usuario = await authAPI.login({ email, password });

      // Verifica si el usuario es admin
      if (usuario.rol !== 'ADMIN') {
        setError('❌ Solo administradores pueden acceder.');
        return;
      }

      // Guardamos usuario en el contexto
      login(usuario);
    } catch (err) {
      setError('❌ Email o contraseña incorrectos');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Login Admin</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: '10px', background: '#FFD700', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
