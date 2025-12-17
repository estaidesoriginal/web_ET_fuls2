import React, { useState, useEffect } from 'react';

function Home({ products, onAddToCart }) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const masVendidos = products.slice(0, 5);

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= masVendidos.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
      setTimeout(() => setIsTransitioning(true), 50);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(masVendidos.length);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  };

  useEffect(() => {
    if (masVendidos.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [masVendidos.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Si no hay productos, mostrar mensaje
  if (!products || products.length === 0 || masVendidos.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#FFD700' }}>
      <h2>Cargando productos...</h2>
    </div>;
  }

  return (
    <div>
      <section className="hero-section">
        <h1>Bienvenido a Perfumería Sahur</h1>
        <p className="hero-subtitle">Descubre nuestras fragancias exclusivas</p>
      </section>

      {/* Carrusel de Más Vendidos */}
      <section className="mas-vendidos-section">
        <h2>🔥 Los Más Vendidos</h2>
        
        <div className="carousel-container">
          <button className="carousel-btn carousel-btn-prev" onClick={handlePrev}>
            ❮
          </button>

          <div className="carousel-track-wrapper">
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
              }}
              onTransitionEnd={handleTransitionEnd}
            >
            {/* Clon del último elemento al inicio */}
            <div className="carousel-item" style={{ minWidth: '100%' }}>
              <div className="bestseller-badge">⭐ MÁS VENDIDO</div>
              <div className="product-image-wrapper">
                <img src={masVendidos[masVendidos.length - 1].image} alt={masVendidos[masVendidos.length - 1].name} />
              </div>
              <h3>{masVendidos[masVendidos.length - 1].name}</h3>
              <p className="price">${masVendidos[masVendidos.length - 1].price.toLocaleString('es-CL')}</p>
              <p className="description">{masVendidos[masVendidos.length - 1].description}</p>
              {/* <button 
                className="btn-ver-producto"
                onClick={() => onAddToCart(masVendidos[masVendidos.length - 1])}
              >
                Agregar al Carrito
              </button> */}
            </div>

            {/* Elementos originales */}
            {masVendidos.map((producto) => (
              <div
                key={producto.id}
                className="carousel-item"
                style={{ minWidth: '100%' }}
              >
                <div className="bestseller-badge">⭐ MÁS VENDIDO</div>
                <div className="product-image-wrapper">
                  <img src={producto.image} alt={producto.name} />
                </div>
                <h3>{producto.name}</h3>
                <p className="price">${producto.price.toLocaleString('es-CL')}</p>
                <p className="description">{producto.description}</p>
                {/* <button 
                  className="btn-ver-producto"
                  onClick={() => onAddToCart(producto)}
                >
                  Agregar al Carrito
                </button> */}
              </div>
            ))}

            {/* Clon del primer elemento al final */}
            <div className="carousel-item" style={{ minWidth: '100%' }}>
              <div className="bestseller-badge">⭐ MÁS VENDIDO</div>
              <div className="product-image-wrapper">
                <img src={masVendidos[0].image} alt={masVendidos[0].name} />
              </div>
              <h3>{masVendidos[0].name}</h3>
              <p className="price">${masVendidos[0].price.toLocaleString('es-CL')}</p>
              <p className="description">{masVendidos[0].description}</p>
              {/* <button 
                className="btn-ver-producto"
                onClick={() => onAddToCart(masVendidos[0])}
              >
                Agregar al Carrito
              </button> */}
            </div>
            </div>
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={handleNext}>
            ❯
          </button>
        </div>

        <div className="carousel-dots">
          {masVendidos.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index + 1)}
            />
          ))}
        </div>
      </section>

      {/* Video de perfumes (debajo de los Más Vendidos) */}
      <section className="home-video-section">
        <div className="home-video-frame">
          <iframe
            className="home-video"
            src="https://www.youtube.com/embed/I1f-84k3iuk?autoplay=1&mute=1&loop=1&playlist=I1f-84k3iuk&controls=1&modestbranding=1&rel=0"
            title="Video Perfumes 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      {/* Productos destacados */}
      <section className="home-products-section">
        <h2>🌟 Productos Destacados</h2>
        <div className="home-products-grid">
          {products.slice(5, 11).map(producto => (
            <div key={producto.id} className="home-product-card">
              <div className="product-image-wrapper">
                <img src={producto.image} alt={producto.name} />
              </div>
              <h3>{producto.name}</h3>
              <p className="price">${producto.price.toLocaleString('es-CL')}</p>
              <button 
                className="btn-add-cart"
                onClick={() => onAddToCart(producto)}
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;