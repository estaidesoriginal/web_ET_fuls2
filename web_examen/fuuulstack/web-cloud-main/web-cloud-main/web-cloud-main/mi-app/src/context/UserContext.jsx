import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const UserContext = createContext();

// 2. Creamos el proveedor (el componente que envolverá a toda tu app)
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Al cargar la página, buscamos si hay un usuario guardado en el navegador
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario_sesion');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('usuario_sesion', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario_sesion');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};