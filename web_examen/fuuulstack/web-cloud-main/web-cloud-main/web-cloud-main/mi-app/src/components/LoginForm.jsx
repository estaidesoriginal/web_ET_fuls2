// LoginForm.jsx
import React, { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("usuarioActual", JSON.stringify(user));
      alert(`Bienvenido ${user.nombre}`);
      onLogin(user);
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
