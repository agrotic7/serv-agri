import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Realisation.css';
import { motion } from 'framer-motion';

function Realisation() {
  const [realisations, setRealisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/get-realisations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réalisations');
        }
        const data = await response.json();
        setRealisations(data);
      } catch (error) {
        console.error('Error fetching realisations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRealisations();
  }, []);

  const handleReadMore = (item) => {
    navigate(`/realisation/${item.id}`);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <section className="realisation-section">
        <div className="realisation-header">
          <h2 className="realisation-title">Nos Réalisations</h2>
          <p className="realisation-subtitle">Découvrez nos projets réussis et l'impact de nos solutions.</p>
        </div>
        <div className="realisation-grid">
          {realisations.map((item) => (
            <article className="realisation-card" key={item.id}>
              <div className="realisation-image-container">
                <img 
                  src={item.images?.[0]} 
                  alt={item.title} 
                  className="realisation-image" 
                />
              </div>
              <div className="realisation-content">
                <span className="realisation-date">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                <h3 className="realisation-card-title">{item.title}</h3>
                <p className="realisation-excerpt">{item.excerpt}</p>
                <button 
                  className="realisation-read-more"
                  onClick={() => handleReadMore(item)}
                >
                  Voir le projet
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default Realisation; 