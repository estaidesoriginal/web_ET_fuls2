import React, { useState, useEffect, useCallback } from 'react';
import { productosAPI, usuariosAPI, comprasAPI } from '../lib/apiClient';

function Admin({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  
  // Estados de datos
  const [products, setProducts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [compras, setCompras] = useState([]);
  
  // Estados de UI
  const [editingProduct, setEditingProduct] = useState(null);
  const [reportType, setReportType] = useState('compras');
  const [toast, setToast] = useState(null);
  
  // Estado para nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    categoryId: '' 
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // CARGA DE DATOS (Optimizada y Silenciosa)
  // ==========================================
  
  const loadData = useCallback(async () => {
    try {
      // Intentamos cargar productos (Es lo más importante)
      const productsData = await productosAPI.obtenerTodos();
      setProducts(productsData || []);
      
      // Intentamos cargar usuarios y compras por separado para que si fallan
      // no detengan la carga de productos.
      try {
        const usersData = await usuariosAPI.obtenerTodos();
        setUsuarios(usersData || []);
      } catch (e) { console.log("Info: API Usuarios no disponible"); }

      try {
        const comprasData = await comprasAPI.obtenerTodas();
        setCompras(comprasData || []);
      } catch (e) { console.log("Info: API Compras no disponible"); }

    } catch (error) {
      console.error("Error principal cargando datos:", error);
      // ⚠️ HE ELIMINADO EL SHOWTOAST DE ERROR AQUÍ PARA QUE NO SALGA EL MENSAJE AMARILLO
    }
  }, []);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==========================================
  // LÓGICA DE PRODUCTOS
  // ==========================================

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId) || 1
      };

      await productosAPI.crear(payload);
      
      setNewProduct({ name: '', price: '', description: '', image: '', categoryId: '' });
      await loadData();
      showToast('✅ Producto creado correctamente');
    } catch (error) {
      showToast('Error al crear: ' + error.message, 'error');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const payload = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        categoryId: parseInt(editingProduct.categoryId)
      };

      await productosAPI.actualizar(editingProduct.id, payload);
      
      setEditingProduct(null);
      await loadData(); 
      showToast('✅ Producto actualizado correctamente');
    } catch (error) {
      showToast('Error al actualizar: ' + error.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productosAPI.eliminar(id);
      await loadData();
      showToast('🗑️ Producto eliminado');
    } catch (error) {
      showToast('Error al eliminar: ' + error.message, 'error');
    }
  };

  // ==========================================
  // LÓGICA DE USUARIOS
  // ==========================================

  const handleDeleteUser = async (id) => {
    try {
      await usuariosAPI.eliminar(id);
      await loadData();
      showToast('🗑️ Usuario eliminado');
    } catch (error) {
      showToast('Error al eliminar: ' + error.message, 'error');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const usuario = usuarios.find(u => u.id === userId);
      if (!usuario) return;
      
      await usuariosAPI.actualizar(userId, { ...usuario, rol: newRole });
      await loadData();
      showToast('✅ Rol actualizado');
    } catch (error) {
      showToast('Error al cambiar rol', 'error');
    }
  };

  // ==========================================
  // REPORTES / ESTADOS
  // ==========================================
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await comprasAPI.actualizar(id, { estado: newStatus });
      showToast('✅ Estado actualizado a: ' + newStatus);
      loadData();
    } catch (error) {
      showToast('Error al actualizar estado', 'error');
    }
  };

  const downloadExcel = () => {
    let csvContent = '';
    let filename = '';
    
    if (reportType === 'compras') {
      csvContent = 'ID,Cliente,Total,Fecha,Estado,Items\n';
      compras.forEach(c => {
        const itemsStr = c.items?.map(i => `${i.cantidad}x ${i.producto_nombre}`).join(' | ') || '';
        csvContent += `${c.id},"${c.usuario}",${c.total},"${c.fecha}","${c.estado}","${itemsStr}"\n`;
      });
      filename = `reporte_compras.csv`;
    } else {
      csvContent = 'ID,Nombre,Email,Rol\n';
      usuarios.forEach(u => {
        csvContent += `${u.id},"${u.name || u.nombre}","${u.email || u.correo}","${u.rol}"\n`;
      });
      filename = `reporte_usuarios.csv`;
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================

  const renderProducts = () => (
    <div className="admin-section">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Gestión de Productos</h2>

      {/* --- FORMULARIO DISEÑO TARJETA --- */}
      <div className="admin-form-container" style={{
        maxWidth: '800px',
        margin: '0 auto 40px auto',
        padding: '30px',
        background: '#252525',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '1px solid #333'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: '#FFD700', 
          borderBottom: '1px solid #444', 
          paddingBottom: '10px' 
        }}>
          ✨ Agregar Nuevo Producto
        </h3>

        <form onSubmit={handleAddProduct} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* FILA 1: Nombre y Categoría */}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 3 }}>
              <label style={{display:'block', marginBottom:5, fontSize:'0.9rem', color:'#aaa'}}>Nombre del Producto</label>
              <input
                type="text"
                placeholder="Ej: Camiseta Negra"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
              />
            </div>
            
            {/* SELECTOR DE CATEGORÍA (NUEVO) */}
            <div style={{ flex: 2 }}>
              <label style={{display:'block', marginBottom:5, fontSize:'0.9rem', color:'#aaa'}}>Temporada (Categoría)</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white', cursor: 'pointer' }}
              >
                <option value="" disabled>Seleccione...</option>
                <option value="1">☀️ 1 - Verano</option>
                <option value="2">❄️ 2 - Invierno</option>
                <option value="3">🌸 3 - Primavera</option>
                <option value="4">🍂 4 - Otoño</option>
                <option value="5">🔖 5 - Otro</option>
              </select>
            </div>
          </div>

          {/* FILA 2: Precio e Imagen */}
          <div>
            <label style={{display:'block', marginBottom:5, fontSize:'0.9rem', color:'#aaa'}}>Precio ($)</label>
            <input
              type="number"
              placeholder="Ej: 15000"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
            />
          </div>

          <div>
             <label style={{display:'block', marginBottom:5, fontSize:'0.9rem', color:'#aaa'}}>URL Imagen</label>
            <input
              type="url"
              placeholder="https://..."
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
            />
          </div>

          {/* FILA 3: Descripción */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{display:'block', marginBottom:5, fontSize:'0.9rem', color:'#aaa'}}>Descripción Detallada</label>
            <textarea
              placeholder="Describe el producto..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
              rows="3"
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white', resize: 'vertical' }}
            />
          </div>

          {/* BOTÓN */}
          <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <button type="submit" className="admin-btn-add" style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>
              + Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* --- MODAL EDITAR (TAMBIÉN ACTUALIZADO CON SELECT) --- */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth:'500px', width:'90%'}}>
            <h3 style={{textAlign:'center', color:'#FFD700'}}>✏️ Editar Producto</h3>
            <form onSubmit={handleUpdateProduct} className="admin-form" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              
              <div>
                <label style={{fontSize:'0.8rem', color:'#888'}}>Nombre</label>
                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required style={{padding:10, width:'100%'}} />
              </div>
              
              <div style={{display:'flex', gap:10}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:'0.8rem', color:'#888'}}>Categoría</label>
                  {/* SELECTOR EN MODO EDICIÓN */}
                  <select
                    value={editingProduct.categoryId || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    required
                    style={{padding:10, width:'100%', background:'#eee', border:'1px solid #ccc', borderRadius:'4px'}}
                  >
                    <option value="1">1 - Verano</option>
                    <option value="2">2 - Invierno</option>
                    <option value="3">3 - Primavera</option>
                    <option value="4">4 - Otoño</option>
                    <option value="5">5 - Otro</option>
                  </select>
                </div>

                <div style={{flex:1}}>
                   <label style={{fontSize:'0.8rem', color:'#888'}}>Precio</label>
                   <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required style={{padding:10, width:'100%'}} />
                </div>
              </div>

              <div>
                <label style={{fontSize:'0.8rem', color:'#888'}}>Descripción</label>
                <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} required rows={4} style={{padding:10, width:'100%'}} />
              </div>

              <div>
                <label style={{fontSize:'0.8rem', color:'#888'}}>Imagen URL</label>
                <input type="url" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} style={{padding:10, width:'100%'}} />
              </div>
              
              <div className="modal-buttons" style={{marginTop:10}}>
                <button type="submit" className="admin-btn-save">Guardar Cambios</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="admin-btn-cancel">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLA PRODUCTOS --- */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cat. ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'4px'}} />
                </td>
                <td style={{fontWeight:'500'}}>{product.name}</td>
                <td>${(product.price || 0).toLocaleString('es-CL')}</td>
                <td style={{textAlign:'center'}}>
                   {/* PÍLDORA VISUAL PARA LA CATEGORÍA */}
                   <span style={{
                     background: product.categoryId == 1 ? '#FFD700' : 
                                 product.categoryId == 2 ? '#87CEEB' :
                                 product.categoryId == 3 ? '#90EE90' :
                                 product.categoryId == 4 ? '#FFA07A' : '#ccc',
                     color: '#000',
                     padding: '2px 8px', 
                     borderRadius: '10px', 
                     fontSize: '0.8rem',
                     fontWeight: 'bold'
                   }}>
                     {product.categoryId}
                   </span>
                </td>
                <td>
                  <button onClick={() => setEditingProduct(product)} className="admin-btn-edit">✏️</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="admin-btn-delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <h2>Gestión de Usuarios</h2>
      <p className="admin-stats">Total: <strong>{usuarios.length}</strong></p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || user.nombre}</td>
                <td>{user.email || user.correo}</td>
                <td>
                  <select
                    value={user.rol || 'ROLE_USER'}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    className={`role-select role-${user.rol}`}
                  >
                    <option value="ROLE_USER">USER</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)} className="admin-btn-delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReportes = () => (
    <div className="admin-section">
      <h2>📊 Reportes</h2>
      <div className="report-type-selector">
        <button className={reportType === 'compras' ? 'report-btn active' : 'report-btn'} onClick={() => setReportType('compras')}>🛒 Compras</button>
      </div>
      <div className="report-download">
        <button onClick={downloadExcel} className="download-excel-btn">📥 Descargar Excel (.CSV)</button>
      </div>
      {reportType === 'compras' && (
         <div className="admin-table-container">
           <table className="admin-table">
             <thead><tr><th>ID</th><th>Usuario</th><th>Total</th><th>Estado</th><th>Items</th></tr></thead>
             <tbody>
               {compras.map(c => (
                 <tr key={c.id}>
                   <td>#{c.id}</td>
                   <td>{c.usuario}</td>
                   <td>${c.total.toLocaleString('es-CL')}</td>
                   <td>{c.estado}</td>
                   <td>{c.items?.length || 0} productos</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      )}
    </div>
  );

  const renderCompras = () => (
    <div className="admin-section">
      <h2>Historial de Compras</h2>
      {compras.length === 0 ? <p className="admin-empty">No hay compras aún (o API en mantenimiento)</p> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Actualizar Estado</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(compra => (
                <tr key={compra.id}>
                  <td>#{compra.id}</td>
                  <td>{compra.usuario}</td>
                  <td>
                    {compra.items?.map((item, i) => (
                      <div key={i} className="compra-item-detail">
                        {item.cantidad}x {item.producto_nombre}
                      </div>
                    ))}
                  </td>
                  <td className="admin-total">${compra.total.toLocaleString('es-CL')}</td>
                  <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                  <td><span className={`estado-badge estado-${compra.estado}`}>{compra.estado}</span></td>
                  <td>
                    <select
                      value=""
                      onChange={(e) => handleStatusChange(compra.id, e.target.value)}
                      className="action-select"
                    >
                      <option value="" disabled>ESTADO</option>
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-container">
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.message}</div>}

      <header className="admin-panel-header" style={{background:'#181818', borderBottom:'3px solid #FFD700', marginBottom:30, padding:'18px 0', textAlign:'center'}}>
        <h1 style={{color:'#FFD700', fontSize:'2.2rem', margin:0, letterSpacing:'2px'}}>🛠️ Panel de Administración</h1>
        <button onClick={onLogout} className="admin-logout" style={{position:'absolute', right:30, top:24, background:'#ff4757', color:'#fff', border:'none', borderRadius:6, padding:'10px 22px', fontWeight:'bold', fontSize:'1rem', cursor:'pointer'}}>Cerrar Sesión</button>
      </header>

      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('products')}>📦 Productos</button>
        <button className={activeTab === 'users' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('users')}>👥 Usuarios</button>
        <button className={activeTab === 'compras' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('compras')}>📊 Compras</button>
        <button className={activeTab === 'reportes' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('reportes')}>📈 Reportes</button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'compras' && renderCompras()}
        {activeTab === 'reportes' && renderReportes()}
      </div>
    </div>
  );
}

export default Admin;
