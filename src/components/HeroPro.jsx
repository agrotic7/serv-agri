import React from 'react';
import './HeroPro.css'; // Importation du fichier CSS

function HeroPro() {
  return (
    <section className="hero-pro-section">
      <div className="hero-pro-content">
        <h1>L'agriculture de précision<br/>au service de votre rendement</h1>
        <p className="hero-pro-desc">
          Irrigation intelligente, données en temps réel, performance durable. SERVAGRI accompagne les agriculteurs vers une gestion optimisée de l'eau et des ressources.
        </p>
        <a href="/contact" className="hero-pro-btn">
          Demander un diagnostic gratuit
          <span className="hero-pro-arrow">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </a>
      </div>
      <div className="hero-pro-image hero-pro-img-overlay">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="hero-video"
        >
          <source src="/Vidéo_Irrigation_Automatique_Prête.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>
    </section>
  );
}

export default HeroPro;