import React, { useState } from 'react';

function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      console.log("Enviando datos al servidor..."); // Para depuración

      // Conexión al Backend (Puerto 8081)
      const response = await fetch('https://mi-backend-spring-login.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          email: email,       
          password: password, 
          rol: "ROLE_USER"    // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!
        }),
      });

      if (response.ok) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        onSwitchToLogin();
      } else {
        // Manejo de errores mejorado para leer el JSON del backend
        const data = await response.json();
        
        // Si el backend nos manda una lista de errores (como en tu foto)
        if (data.errors && Array.isArray(data.errors)) {
            const mensajes = data.errors.map(err => `Campo ${err.field}: ${err.defaultMessage}`).join('\n');
            alert("Error de validación:\n" + mensajes);
        } else {
            // Error genérico
            alert("Error al registrar: " + (data.message || "Error desconocido"));
        }
      }

    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor (Puerto 8081).");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Tu nombre"/>
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} required placeholder="Tu apellido"/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="tu@email.com"/>
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres"/>
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required placeholder="Repite tu contraseña"/>
          </div>
          <button type="submit" className="register-btn">Crear Cuenta</button>
        </form>
        <p className="login-link">
          ¿Ya tienes cuenta? <button onClick={onSwitchToLogin} className="btn-link">Inicia sesión aquí</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
