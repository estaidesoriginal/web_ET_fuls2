import React, { useState } from "react";



function Login({ onLogin, onSwitchToRegister }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!correo || !password) {
      setErrorMsg("Debes completar todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mi-backend-spring-catalogo.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();
      console.log("Respuesta del backend 8081:", data);

      // Si el backend envía mensaje de error

      if (!response.ok || data.message !== "Login exitoso") {
        setErrorMsg("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // Notificar al App.jsx con todos los datos del usuario
      onLogin(data);


    } catch (error) {
      console.error("Error en login:", error);
      setErrorMsg("No se pudo conectar con el servidor de Login (8081)");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2 style={{ color: '#FFD700', marginBottom: 18 }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Validando..." : "Ingresar"}
        </button>
        {errorMsg && (
          <div style={{
            background: '#222',
            color: '#ff4444',
            border: '2px solid #ff4444',
            borderRadius: '8px',
            padding: '10px',
            marginTop: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            width: '100%'
          }}>{errorMsg}</div>
        )}
      </form>

      <p className="switch-auth">
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitchToRegister} className="link-btn">
          Registrarse
        </button>
      </p>
    </div>
  );
}

export default Login;


