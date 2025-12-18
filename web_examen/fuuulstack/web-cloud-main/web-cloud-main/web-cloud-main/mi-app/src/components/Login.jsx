// src/components/Login.jsx
import React, { useState } from "react";
import './Login.css'; // tu CSS de estilo flexible

export default function Login({ onLogin, onSwitchToRegister }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("https://mi-backend-spring-login.onrender.com/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Usuario o contraseña incorrectos");
        } else {
          setErrorMsg("Error del servidor, intenta más tarde");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      onLogin(data); // ⚡ aquí se llama correctamente al prop de App.jsx
      setLoading(false);
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setErrorMsg("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Iniciar Sesión</h2>
        {errorMsg && <div className="login-error">{errorMsg}</div>}
        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <p className="switch-auth">
          ¿No tienes cuenta? <span onClick={onSwitchToRegister}>Regístrate</span>
        </p>
      </form>
    </div>
  );
}
