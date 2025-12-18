// Login.jsx
import React, { useState } from "react";
import "./Login.css"; // Asegúrate de crear este archivo

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://mi-backend-spring-login.onrender.com/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        correo: correo,
        contrasena: contrasena
      }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          setError("Credenciales incorrectas. Por favor revisa tu usuario o contraseña.");
        } else {
          setError(`Error del servidor. Código: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      onLogin(data);
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
