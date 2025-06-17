import React, { useEffect, useRef } from 'react';
import './ChiffresCles.css';

function ChiffresCles() {
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <section className="chiffres-cles-section">
      <div className="chiffres-cles-container" ref={statsRef}>
        <div className="chiffres-cles-title">
          <h2>Nos Chiffres Clés</h2>
          <p>Des résultats concrets qui parlent d'eux-mêmes</p>
        </div>
        
        <div className="chiffres-cles-grid">
          <div className="chiffre-item">
            <div className="chiffre-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="chiffre-value" data-value="500">0</div>
            <div className="chiffre-label">Clients Satisfaits</div>
          </div>

          <div className="chiffre-item">
            <div className="chiffre-icon">
              <i className="bi bi-droplet-fill"></i>
            </div>
            <div className="chiffre-value" data-value="1000">0</div>
            <div className="chiffre-label">Hectares Irrigués</div>
          </div>

          <div className="chiffre-item">
            <div className="chiffre-icon">
              <i className="bi bi-tree-fill"></i>
            </div>
            <div className="chiffre-value" data-value="40">0</div>
            <div className="chiffre-label">% d'Économie d'Eau</div>
          </div>

          <div className="chiffre-item">
            <div className="chiffre-icon">
              <i className="bi bi-gear-fill"></i>
            </div>
            <div className="chiffre-value" data-value="1000">0</div>
            <div className="chiffre-label">Installations Réalisées</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChiffresCles; 