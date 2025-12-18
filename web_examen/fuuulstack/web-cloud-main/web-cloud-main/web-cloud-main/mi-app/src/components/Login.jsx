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
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://mi-backend-spring-login.onrender.com/api/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena: password }),
        }
      );

      const data = await response.json();
      console.log("Respuesta completa del backend:", data);

      // Validación estricta
      if (response.ok && data && data.correo) {
        // Login correcto
        onLogin(data); // Enviamos todo el objeto usuario al componente padre

        // Opcional: guardar token o rol si es necesario
        if (data.rol) localStorage.setItem("rol", data.rol);
      } else {
        // Solo mostrar error si realmente falló
        setErrorMsg("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMsg("No se pudo conectar con el servidor de Login");
    } finally {
      // Esto asegura que loading se desactive siempre
      setLoading(false);
    }
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
          <div
            style={{
              background: '#222',
              color: '#ff4444',
              border: '2px solid #ff4444',
              borderRadius: '8px',
              padding: '10px',
              marginTop: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            {errorMsg}
          </div>
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

