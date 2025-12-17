import React from "react";

export default function Popup({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
