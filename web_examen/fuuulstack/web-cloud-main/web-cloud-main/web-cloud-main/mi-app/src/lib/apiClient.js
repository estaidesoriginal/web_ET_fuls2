// ==========================================
// 1. CONFIGURACIÓN DE PUERTOS
// ==========================================
const API_BASE_URL = {
  USUARIO: 'https://mi-backend-spring-login.onrender.com',    // Puerto 8081
  CATALOGO: 'https://mi-backend-spring-catalogo.onrender.com',            // Puerto 8080
  CARRITO: 'https://mi-backend-spring-carrito.onrender.com'  // Puerto 8082
};

// ==========================================
// 2. MAPEOS (TRADUCTORES DB <-> FRONTEND)
// ==========================================

// PRODUCTOS: La DB ahora está en INGLÉS (name, price, description)
// Pero tiene una llave foránea 'categoria_id'.
const mapProductoToFrontend = (p) => ({
  id: p.id,
  name: p.name,               
  description: p.description,
  price: p.price,
  image: p.image,
  // Mapeamos la FK de la base de datos al frontend
  categoryId: p.categoria_id || p.categoryId || 1, 
  // Si el backend nos manda el objeto categoria expandido, intentamos sacar el nombre, si no, 'General'
  categoryName: p.categoriaNombre || 'General' 
});

const mapProductoToBackend = (p) => ({
  name: p.name,
  description: p.description,
  price: parseInt(p.price), // Aseguramos entero para la DB
  image: p.image,
  // Java espera 'categoryId' en el DTO para guardarlo en 'categoria_id'
  categoryId: parseInt(p.categoryId) || 1 
});

// COMPRAS: La DB sigue en ESPAÑOL (nombre, total, estado)
const mapCompraToFrontend = (c) => ({
  id: c.id,
  // Unimos nombre y apellido para mostrar "Cliente"
  usuario: c.nombre ? `${c.nombre} ${c.apellido}` : 'Cliente',
  total: c.total,
  fecha: c.fecha,
  estado: c.estado,
  items: c.items || [] // Lista de productos
});

// ==========================================
// 3. VERIFICADOR DE ESTADO
// ==========================================
export const checkAPIsAvailable = async () => {
  const checks = await Promise.allSettled([
    fetch(`${API_BASE_URL.USUARIO}/usuarios`).then(r => r.ok).catch(() => false),
    fetch(`${API_BASE_URL.CATALOGO}/productos`).then(r => r.ok).catch(() => false),
    fetch(`${API_BASE_URL.CARRITO}/compras`).then(r => r.ok).catch(() => false)
  ]);
  
  return {
    usuario: checks[0].status === 'fulfilled' && checks[0].value,
    catalogo: checks[1].status === 'fulfilled' && checks[1].value,
    carrito: checks[2].status === 'fulfilled' && checks[2].value
  };
};

// ==========================================
// 4. API DE USUARIOS (Puerto 8081)
// ==========================================
export const usuariosAPI = {
  obtenerTodos: () => 
    fetch(`${API_BASE_URL.USUARIO}/usuarios`)
      .then(r => r.json()),

  obtenerPorId: (id) => 
    fetch(`${API_BASE_URL.USUARIO}/usuarios/${id}`)
      .then(r => r.json()),

  // Endpoint de búsqueda o filtro
  obtenerPorEmail: (email) => 
    fetch(`${API_BASE_URL.USUARIO}/usuarios`) // Traemos todos y filtramos si no hay endpoint específico
      .then(r => r.json())
      .then(users => users.find(u => u.correo === email || u.email === email)),

  crear: (usuario) => 
    fetch(`${API_BASE_URL.USUARIO}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    }).then(r => r.json()),

  login: (email, password) =>
  fetch(`${API_BASE_URL.USUARIO}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      correo: email, 
      contrasena: password 
    })
  }).then(r => r.json()),


  actualizar: (id, usuario) =>
    fetch(`${API_BASE_URL.USUARIO}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    }).then(r => r.json()),

  eliminar: (id) => 
    fetch(`${API_BASE_URL.USUARIO}/usuarios/${id}`, { method: 'DELETE' })
};

// ==========================================
// 5. API DE PRODUCTOS (Puerto 8080)
// ==========================================
export const productosAPI = {
  obtenerTodos: () => 
    fetch(`${API_BASE_URL.CATALOGO}/productos`)
      .then(r => r.json())
      .then(data => data.map(mapProductoToFrontend)),

  obtenerPorId: (id) => 
    fetch(`${API_BASE_URL.CATALOGO}/productos/${id}`)
      .then(r => r.json())
      .then(mapProductoToFrontend),

  crear: (prod) => 
    fetch(`${API_BASE_URL.CATALOGO}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapProductoToBackend(prod))
    }).then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }),

  actualizar: (id, prod) => 
    fetch(`${API_BASE_URL.CATALOGO}/productos/${id}`, { // <--- DEBE DECIR CATALOGO (8080)
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapProductoToBackend(prod))
    }).then(async res => {
       if (!res.ok) throw new Error(await res.text());
       return res.json();
    }),

  eliminar: (id) => 
    fetch(`${API_BASE_URL.CATALOGO}/productos/${id}`, { method: 'DELETE' })
};

// ==========================================
// 6. API DE COMPRAS (Puerto 8082)
// ==========================================
export const comprasAPI = {
  obtenerTodas: () => 
    fetch(`${API_BASE_URL.CARRITO}/compras`)
      .then(r => r.json())
      .then(data => (data || []).map(mapCompraToFrontend)),

  obtenerPorId: (id) => 
    fetch(`${API_BASE_URL.CARRITO}/compras/${id}`)
      .then(r => r.json()),

  crear: (compra) => 
    fetch(`${API_BASE_URL.CARRITO}/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compra)
    }).then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }),

  // 👇 AQUÍ ESTABA EL FALTANTE PARA EL BOTÓN DE ESTADO 👇
  actualizar: (id, datos) => 
    fetch(`${API_BASE_URL.CARRITO}/compras/${id}`, {
      method: 'PATCH', // Usamos PATCH para cambios pequeños (estado)
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    }).then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }),

  eliminar: (id) => 
    fetch(`${API_BASE_URL.CARRITO}/compras/${id}`, { method: 'DELETE' })
};

// Alias para compatibilidad
export const carritoAPI = comprasAPI;

// Export por defecto para importaciones sin llaves
export default {
  usuariosAPI,
  productosAPI,
  carritoAPI,
  comprasAPI,
  checkAPIsAvailable
};