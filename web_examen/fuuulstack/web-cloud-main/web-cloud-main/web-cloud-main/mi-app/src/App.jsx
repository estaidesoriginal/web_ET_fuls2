import React, { useState, useEffect, useContext } from 'react';
import './App.css';

import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import Home from './components/Home';
import { productosAPI, checkAPIsAvailable } from './lib/apiClient';
import { UserContext } from './context/UserContext';

function App() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [allProducts, setAllProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, text: '' });
  const [apisAvailable, setApisAvailable] = useState({ usuario: false, catalogo: false, carrito: false });

  // 🌟 Usamos UserContext
  const { user, login, logout } = useContext(UserContext);

  // ==============================================
  // CARGA INICIAL DE DATOS
  // ==============================================
  useEffect(() => {
    const loadInitialData = async () => {
      const apiStatus = await checkAPIsAvailable();
      setApisAvailable(apiStatus);
      
      try {
        const productsData = await productosAPI.obtenerTodos();
        console.log('Productos cargados desde API:', productsData);
        if (productsData && productsData.length > 0) {
          setAllProducts(productsData);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        showToast('⚠️ No se pudo conectar con el Catálogo (8080)');
      }
    };
    loadInitialData();
  }, []);

  // ==============================================
  // LÓGICA DE AUTENTICACIÓN
  // ==============================================
  const handleLogin = (userData) => {
    console.log("🔐 Respuesta login backend:", userData);

    if (!userData || !userData.id) {
      showToast("❌ Usuario o contraseña incorrectos");
      return;
    }

    const usuarioNormalizado = {
      id: userData.id,
      nombre: userData.nombre,
      apellido: userData.apellido || "",
      name: `${userData.nombre} ${userData.apellido || ""}`,
      correo: userData.correo,
      rol: userData.rol
    };

    login(usuarioNormalizado);

    if (usuarioNormalizado.rol === "ROLE_ADMIN") {
      setCurrentPage("admin");
      showToast(`👋 Bienvenido Administrador ${usuarioNormalizado.nombre}`);
    } else {
      setCurrentPage("home");
      showToast(`👋 Hola ${usuarioNormalizado.nombre}`);
    }
  };

  const handleRegister = () => {
    setAuthMode('login');
    showToast('Cuenta creada. Por favor inicia sesión.');
  };

  const handleLogout = () => {
    logout();
    setCart([]);
    setCurrentPage('home');
    showToast('Has cerrado sesión correctamente');
  };

  // ==============================================
  // LÓGICA DEL CARRITO
  // ==============================================
  const addToCart = (product) => {
    if (!user) {
      showToast('Debes iniciar sesión para comprar');
      setAuthMode('login');
      setCurrentPage('login');
      return;
    }
    if (user.rol === 'ROLE_ADMIN') {
      showToast('Los administradores no pueden comprar productos');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} agregado al carrito`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return showToast('El carrito está vacío');
    if (!user || !user.id) {
      showToast('Error de sesión. Por favor ingresa nuevamente.');
      handleLogout();
      return;
    }

    try {
      const nombreFinal = user.nombre || user.name?.split(' ')[0] || "Cliente";
      const apellidoFinal = user.apellido || (user.name?.split(' ').slice(1).join(' ') || "");

      const compraPayload = {
        usuarioId: user.id,
        nombre: nombreFinal,
        apellido: apellidoFinal,
        email: user.email || user.correo,
        direccion: "Dirección Web", 
        indicaciones: "Compra desde Frontend",
        total: getTotalPrice(),
        items: cart.map(item => ({
          productoId: item.id,
          productoNombre: item.name,
          consola: item.console || item.category || "General",
          precio: item.price,
          cantidad: item.quantity
        }))
      };

      console.log("📦 Enviando compra:", compraPayload);

      const response = await fetch('https://mi-backend-spring-carrito.onrender.com/api/carrito/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraPayload),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`¡Compra Exitosa! ID de pedido: #${data.compraId || data.id}`);
        setCart([]);
        setCurrentPage('home');
      } else {
        const errorText = await response.text();
        console.error("Error Servidor:", errorText);
        showToast("Hubo un problema al procesar la compra.");
      }

    } catch (err) {
      console.error("Error Red:", err);
      showToast("No se pudo conectar con el servidor de pagos (8082).");
    }
  };

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 3000);
  };

  // ==============================================
  // RENDERIZADO DE PÁGINAS
  // ==============================================
  const renderPage = () => {
    if (currentPage === 'admin') {
      if (user && user.rol === 'ROLE_ADMIN') {
        return <Admin onLogout={handleLogout} onProductsChange={setAllProducts} />;
      } else {
        return (
          <div className="access-denied">
            <h2>⛔ Acceso Denegado</h2>
            <p>No tienes permisos de administrador.</p>
            <button onClick={() => setCurrentPage('home')}>Volver al Inicio</button>
          </div>
        );
      }
    }

    if (!user && (currentPage === 'login' || currentPage === 'register')) {
      return authMode === 'login' 
        ? <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthMode('register')} />
        : <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthMode('login')} />;
    }

    switch(currentPage) {
      case 'home':
        return <Home products={allProducts} onAddToCart={addToCart} />;
      case 'products':
        return (
          <div className="grid-container">
            {allProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
          </div>
        );
      case 'cart':
        if (!user) return (
          <div className="empty-cart-page">
            <h2>Inicia sesión para ver tu carrito</h2>
            <button onClick={() => { setAuthMode('login'); setCurrentPage('login'); }}>Ir al Login</button>
          </div>
        );
        return <Cart cart={cart} setCart={setCart} user={user} />;
      case 'contact':
        return <div>Sección de contacto...</div>;
      default:
        return <Home products={allProducts} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <div className="logo-container" onClick={() => setCurrentPage('home')}>
            <img src="/longa.png" alt="Logo" className="logo-img" />
          </div>
          <nav>
            <ul>
              <li><button onClick={() => setCurrentPage('home')}>Inicio</button></li>
              <li><button onClick={() => setCurrentPage('products')}>Productos</button></li>
              <li><button onClick={() => setCurrentPage('contact')}>Contacto</button></li>
              {user && user.rol === 'ROLE_ADMIN' && (
                <li><button onClick={() => setCurrentPage('admin')} style={{color: '#FFD700'}}>🛠️ Admin</button></li>
              )}
              {user ? (
                <>
                  {currentPage !== 'admin' && <li><button onClick={() => setCurrentPage('cart')}>🛒 ({getTotalItems()})</button></li>}
                  <li><button onClick={handleLogout}>Salir ({user.name?.split(' ')[0]})</button></li>
                </>
              ) : (
                <li><button onClick={() => { setAuthMode('login'); setCurrentPage('login'); }}>🔐 Ingresar</button></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>{renderPage()}</main>

      {toast.show && <div className="toast">{toast.text}</div>}

      <footer className="site-footer">
        <p>© 2025 Perfumería Sahur - Sistema de Microservicios Integrado</p>
      </footer>
    </div>
  );
}

export default App;
