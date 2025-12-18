// src/components/Login.jsx
import React, { useState } from "react";

export default function Login({ setUser }) {
  // Estado para los campos
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Estado para mostrar errores
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // limpiar errores previos

    try {
      const res = await fetch("https://mi-backend-spring-login.onrender.com/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Credenciales incorrectas");
        } else {
          setError("Error en el servidor, intente más tarde");
        }
        return;
      }

      const data = await res.json();
      setUser(data); // guardar usuario en el contexto o estado global
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
