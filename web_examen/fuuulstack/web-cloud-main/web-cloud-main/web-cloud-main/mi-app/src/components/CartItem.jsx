import React from 'react';

const styles = {
  card: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 220px',
    alignItems: 'center',
    gap: 20,
    height: 180,
    backgroundColor: '#1a1a1a',
    border: '1px solid #FFD700',
    borderRadius: 12,
    padding: 20,
  },
  img: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #FFD700',
  },
  info: { overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  title: {
    color: '#FFD700',
    fontSize: 18,
    margin: '0 0 6px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  desc: {
    color: '#999',
    fontSize: 13,
    margin: '0 0 8px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: { color: '#ccc', fontSize: 15, fontWeight: 'bold' },
  actions: {
    width: 220,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  qtyBox: { display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#222', borderRadius: 8, padding: 4 },
  qtyBtn: {
    backgroundColor: '#FFD700',
    color: '#000',
    border: 'none',
    width: 30,
    height: 30,
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    width: 50,
    backgroundColor: '#111',
    border: '1px solid #FFD700',
    color: '#FFD700',
    textAlign: 'center',
    padding: 6,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 6,
  },
  subtotal: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', margin: 0 },
  remove: {
    backgroundColor: 'transparent',
    border: '2px solid #ff4444',
    color: '#ff4444',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 'bold',
  },
};

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div style={styles.card}>
      <img src={item.image} alt={item.name} style={styles.img} />
      <div style={styles.info}>
        <h3 style={styles.title}>{item.name}</h3>
        <p style={styles.desc}>{item.description}</p>
        <p style={styles.price}>Precio unitario: ${item.price.toLocaleString('es-CL')}</p>
      </div>
      <div style={styles.actions}>
        <div style={styles.qtyBox}>
          <button style={styles.qtyBtn} onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
          <input
            style={styles.qtyInput}
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button style={styles.qtyBtn} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <p style={styles.subtotal}>Subtotal: ${(item.price * item.quantity).toLocaleString('es-CL')}</p>
        <button style={styles.remove} onClick={() => onRemove(item.id)}>🗑️ Eliminar</button>
      </div>
    </div>
  );
}

export default CartItem;