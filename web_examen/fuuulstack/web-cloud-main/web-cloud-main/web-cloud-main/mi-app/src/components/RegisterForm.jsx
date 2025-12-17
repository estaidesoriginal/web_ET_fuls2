// RegisterForm.jsx
import React, { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (users.some(u => u.email === email)) {
      alert("Este correo ya está registrado.");
      return;
    }
    const newUser = { nombre, email, password };
    users.push(newUser);
    localStorage.setItem("usuarios", JSON.stringify(users));
    alert("Registro exitoso!");
    onRegister(newUser);
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrarse</button>
    </form>
  );
}
