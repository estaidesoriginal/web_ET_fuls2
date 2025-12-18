// src/components/Login.jsx
import React, { useState } from "react";
import "./Login.css"; // Asegúrate de crear este archivo

export default function Login({ setUser }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // limpiar errores anteriores

    try {
      const response = await fetch(
        "https://mi-backend-spring-login.onrender.com/api/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Credenciales incorrectas.");
        } else {
          setError("Error en el servidor. Intenta más tarde.");
        }
        return;
      }

      const data = await response.json();
      setUser(data); // Actualiza el estado del usuario en App.jsx
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Iniciar Sesión</h2>

        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tu correo"
          required
        />

        <label htmlFor="contrasena">Contraseña:</label>
        <input
          type="password"
          id="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="tu contraseña"
          required
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
