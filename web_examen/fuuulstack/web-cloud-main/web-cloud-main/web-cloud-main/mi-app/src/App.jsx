import React, { useState, useEffect } from 'react';
import './App.css';

import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import Home from './components/Home';
import { productosAPI, checkAPIsAvailable } from './lib/apiClient';

function App() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [allProducts, setAllProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, text: '' });
  const [apisAvailable, setApisAvailable] = useState({ usuario: false, catalogo: false, carrito: false });

  // ==============================================
  // CARGA INICIAL DE DATOS
  // ==============================================
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Verificar disponibilidad de APIs
      const apiStatus = await checkAPIsAvailable();
      setApisAvailable(apiStatus);
      
      // 2. Cargar productos desde la API (Puerto 8080)
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

      // 3. Recuperar sesión si existe
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (err) {
          localStorage.removeItem('currentUser');
        }
      }
    };

    loadInitialData();
  }, []);

  // ==============================================
  // LÓGICA DE AUTENTICACIÓN (CORREGIDA)
  // ==============================================
  
  // Esta función ahora solo recibe el usuario, porque Login.jsx ya hizo la validación con Java
  const handleLogin = (userData) => {
  console.log("🔐 Respuesta login backend:", userData);

  // Validamos si el login fue realmente exitoso
  if (!userData || userData.message !== "Login exitoso" || !userData.id) {
    showToast("❌ Usuario o contraseña incorrectos");
    return;
  }

  // Transformamos posibles diferencias entre 'correo' y 'email'
  const usuarioNormalizado = {
    id: userData.id,
    nombre: userData.nombre,
    apellido: userData.apellido,
    name: `${userData.nombre} ${userData.apellido}`,
    email: userData.correo || userData.email,
    correo: userData.correo || userData.email,
    rol: userData.rol
  };

  console.log("✅ Usuario autenticado y normalizado:", usuarioNormalizado);

  // Guardamos sesión
  setUser(usuarioNormalizado);
  localStorage.setItem("currentUser", JSON.stringify(usuarioNormalizado));

  // Redirección según rol
  if (usuarioNormalizado.rol === "ROLE_ADMIN") {
    setCurrentPage("admin");
    showToast(`👋 Bienvenido Administrador ${usuarioNormalizado.nombre}`);
  } else {
    setCurrentPage("home");
    showToast(`👋 Hola ${usuarioNormalizado.nombre}`);
  }
};

  // Esta función solo cambia la vista, porque Register.jsx maneja la API internamente
  const handleRegister = () => {
    setAuthMode('login');
    showToast('Cuenta creada. Por favor inicia sesión.');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCart([]);
    setCurrentPage('home');
    showToast('Has cerrado sesión correctamente');
  };

  // ==============================================
  // LÓGICA DEL CARRITO (CORREGIDA)
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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // --- AQUÍ ESTÁ LA CORRECCIÓN CLAVE PARA LA COMPRA ---
  const handleCheckout = async () => {
    if (cart.length === 0) return showToast('El carrito está vacío');
    
    if (!user || !user.id) {
      showToast('Error de sesión. Por favor ingresa nuevamente.');
      handleLogout();
      return;
    }

    try {
      // 1. Preparamos el nombre completo
      let nombreFinal = user.name || user.nombre || "Cliente";
      let apellidoFinal = user.apellido || "";
      
      // Si el nombre viene junto, lo separamos para Java
      if (user.name && !user.apellido) {
        const parts = user.name.split(' ');
        nombreFinal = parts[0];
        apellidoFinal = parts.slice(1).join(' ') || "";
      }

      // 2. Construimos el paquete EXACTO para tu API Java (Puerto 8082)
      const compraPayload = {
        usuarioId: user.id,
        nombre: nombreFinal,
        apellido: apellidoFinal,
        email: user.email || user.correo,
        direccion: "Dirección Web", 
        indicaciones: "Compra desde Frontend",
        total: getTotalPrice(),
        // Enviamos la lista de items correctamente mapeada
        items: cart.map(item => ({
          productoId: item.id,
          productoNombre: item.name,
          consola: item.console || item.category || "General",
          precio: item.price,
          cantidad: item.quantity
        }))
      };

      console.log("📦 Enviando compra:", compraPayload);

      // 3. Petición al servidor
      const response = await fetch('http://localhost:8082/api/carrito/compras', {
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
  // NAVEGACIÓN Y RENDERIZADO
  // ==============================================

  const renderPage = () => {
    // 🛡️ PROTECCIÓN DE RUTA ADMIN
    if (currentPage === 'admin') {
      if (user && user.rol === 'ROLE_ADMIN') {
        return (
          <Admin 
            onLogout={handleLogout} 
            // Pasamos funciones para que el Admin pueda actualizar la lista global si es necesario
            onProductsChange={(newProducts) => setAllProducts(newProducts)}
          />
        );
      } else {
        // Si intenta entrar y no es admin, lo mandamos al home
        return (
          <div className="access-denied">
            <h2>⛔ Acceso Denegado</h2>
            <p>No tienes permisos de administrador.</p>
            <button onClick={() => setCurrentPage('home')}>Volver al Inicio</button>
          </div>
        );
      }
    }

    // Rutas Públicas / Usuario
    if (!user && (currentPage === 'login' || currentPage === 'register')) {
      return authMode === 'login' 
        ? <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthMode('register')} />
        : <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthMode('login')} />;
    }

    switch(currentPage) {
      case 'home':
        return (
          <>
            <Home products={allProducts} onAddToCart={addToCart} />
            <footer className="site-footer product-footer">
              <div className="footer-content">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <span style={{color:'#FFD700',fontWeight:'bold'}}>© 2025 Perfumería Sahur</span>
                  <span style={{color:'#fff'}}>Encuéntranos en redes sociales:</span>
                  <div style={{display:'flex',gap:12}}>
                    <a href="#" style={{color:'#FFD700'}}>Instagram</a>
                    <a href="#" style={{color:'#FFD700'}}>Facebook</a>
                    <a href="#" style={{color:'#FFD700'}}>Twitter</a>
                  </div>
                  <span style={{color:'#bbb',fontSize:'13px'}}>Av. Aromas 1234, Santiago, Chile</span>
                </div>
              </div>
            </footer>
          </>
        );
      
      case 'products':
        return (
          <>
            <div>
              <h1>Nuestros Productos</h1>
              <div className="grid-container">
                {allProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
            <footer className="site-footer product-footer">
              <div className="footer-content">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <span style={{color:'#FFD700',fontWeight:'bold'}}>© 2025 Perfumería Sahur</span>
                  <span style={{color:'#fff'}}>Encuéntranos en redes sociales:</span>
                  <div style={{display:'flex',gap:12}}>
                    <a href="#" style={{color:'#FFD700'}}>Instagram</a>
                    <a href="#" style={{color:'#FFD700'}}>Facebook</a>
                    <a href="#" style={{color:'#FFD700'}}>Twitter</a>
                  </div>
                  <span style={{color:'#bbb',fontSize:'13px'}}>Av. Aromas 1234, Santiago, Chile</span>
                </div>
              </div>
            </footer>
          </>
        );

      case 'cart':
        if (!user) return (
          <div className="empty-cart-page">
            <h2>Inicia sesión para ver tu carrito</h2>
            <button onClick={() => { setAuthMode('login'); setCurrentPage('login'); }}>Ir al Login</button>
          </div>
        );
        return (
          <>
            <div className="cart-page">
              <h1>🛒 Tu Carrito</h1>
              <Cart cart={cart} setCart={setCart} user={user} />
            </div>
            <footer className="site-footer product-footer">
              <div className="footer-content">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <span style={{color:'#FFD700',fontWeight:'bold'}}>© 2025 Perfumería Sahur</span>
                  <span style={{color:'#fff'}}>Encuéntranos en redes sociales:</span>
                  <div style={{display:'flex',gap:12}}>
                    <a href="#" style={{color:'#FFD700'}}>Instagram</a>
                    <a href="#" style={{color:'#FFD700'}}>Facebook</a>
                    <a href="#" style={{color:'#FFD700'}}>Twitter</a>
                  </div>
                  <span style={{color:'#bbb',fontSize:'13px'}}>Av. Aromas 1234, Santiago, Chile</span>
                </div>
              </div>
            </footer>
          </>
        );

      case 'contact':
        return (
          <>
            <div className="contact-page">
              <h1>Contáctanos</h1>
              <div className="contact-info">
                <div className="contact-item">
                  <h3>Dirección</h3>
                  <p>Av. Aromas 1234, Torre Perfume, Santiago, Chile</p>
                </div>
                <div className="contact-item">
                  <h3>Teléfonos</h3>
                  <p>+56 2 2345 6789</p>
                  <p>+56 9 8765 4321</p>
                </div>
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>contacto@perfumeriasahur.cl</p>
                  <p>ventas@perfumeriasahur.cl</p>
                </div>
                <div className="contact-item">
                  <h3>Redes Sociales</h3>
                  <p>
                    <a href="#" style={{color:'#FFD700'}}>Instagram</a> | 
                    <a href="#" style={{color:'#FFD700'}}>Facebook</a> | 
                    <a href="#" style={{color:'#FFD700'}}>Twitter</a>
                  </p>
                </div>
              </div>
              <div className="business-hours">
                <h3>Horario de Atención</h3>
                <p>Lunes a Viernes: 10:00 - 19:00</p>
                <p>Sábados: 11:00 - 16:00</p>
                <p>Domingos y festivos: Cerrado</p>
              </div>
              <div className="about-contact" style={{marginTop:40, background:'#181818', borderRadius:10, padding:24, color:'#FFD700'}}>
                <h2>Nuestra Historia</h2>
                <p>Perfumería Sahur es líder en fragancias de lujo en Chile desde 1998. Nos especializamos en perfumes originales, asesoría personalizada y experiencias olfativas únicas para cada cliente.</p>
                <h3>Nuestros Valores</h3>
                <ul style={{color:'#fff'}}>
                  <li>Calidad y autenticidad en cada fragancia</li>
                  <li>Atención personalizada y profesional</li>
                  <li>Pasión por el arte del perfume</li>
                  <li>Compromiso con la satisfacción del cliente</li>
                </ul>
              </div>
              <div className="map-section" style={{marginTop:40,textAlign:'center'}}>
                <h3>Encuéntranos aquí</h3>
                <iframe title="mapa" src="https://www.openstreetmap.org/export/embed.html?bbox=-70.6483%2C-33.4569%2C-70.6483%2C-33.4569&amp;layer=mapnik" style={{width:'100%',maxWidth:500,height:250,border:'2px solid #FFD700',borderRadius:8}} allowFullScreen="" loading="lazy"></iframe>
              </div>
            </div>
            <footer className="site-footer product-footer">
              <div className="footer-content">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <span style={{color:'#FFD700',fontWeight:'bold'}}>© 2025 Perfumería Sahur</span>
                  <span style={{color:'#fff'}}>Encuéntranos en redes sociales:</span>
                  <div style={{display:'flex',gap:12}}>
                    <a href="#" style={{color:'#FFD700'}}>Instagram</a>
                    <a href="#" style={{color:'#FFD700'}}>Facebook</a>
                    <a href="#" style={{color:'#FFD700'}}>Twitter</a>
                  </div>
                  <span style={{color:'#bbb',fontSize:'13px'}}>Av. Aromas 1234, Santiago, Chile</span>
                </div>
              </div>
            </footer>
          </>
        );

      default:
        return <Home products={allProducts} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="App">
      {/* Notificación de Error de APIs
      {(!apisAvailable.catalogo || !apisAvailable.usuario || !apisAvailable.carrito) && (
        <div className="api-warning-banner">
          ⚠️ Algunas conexiones fallaron: 
          {!apisAvailable.usuario && ' [Login 8081]'}
          {!apisAvailable.catalogo && ' [Catálogo 8080]'}
          {!apisAvailable.carrito && ' [Carrito 8082]'}
        </div>
      )} */}

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
              
              {/* Botón Admin solo si es Admin */}
              {user && user.rol === 'ROLE_ADMIN' && (
                <li><button onClick={() => setCurrentPage('admin')} style={{color: '#FFD700'}}>🛠️ Admin</button></li>
              )}

              {user ? (
                <>
                  {/* Oculta el carrito solo en la vista admin */}
                  {currentPage !== 'admin' && (
                    <li><button onClick={() => setCurrentPage('cart')}>🛒 ({getTotalItems()})</button></li>
                  )}
                  <li><button onClick={handleLogout}>Salir ({user.name?.split(' ')[0]})</button></li>
                </>
              ) : (
                <li><button onClick={() => { setAuthMode('login'); setCurrentPage('login'); }}>🔐 Ingresar</button></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {renderPage()}
      </main>

      {toast.show && <div className="toast">{toast.text}</div>}

      <footer className="site-footer">
        <p>© 2025 Perfumería Sahur - Sistema de Microservicios Integrado</p>
      </footer>
    </div>
  );
}

export default App;