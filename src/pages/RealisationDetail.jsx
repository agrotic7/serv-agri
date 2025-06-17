import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './RealisationDetail.css';

function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [realisation, setRealisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealisation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/get-realisations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la réalisation');
        }
        const realisations = await response.json();
        const foundRealisation = realisations.find(r => r.id === parseInt(id));
        if (foundRealisation) {
          setRealisation(foundRealisation);
        }
      } catch (error) {
        console.error('Error fetching realisation:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRealisation();
  }, [id]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/realisation')} className="back-button">
          Retour aux réalisations
        </button>
      </div>
    );
  }

  if (!realisation) {
    return (
      <div className="error-container">
        <h2>Réalisation non trouvée</h2>
        <button onClick={() => navigate('/realisation')} className="back-button">
          Retour aux réalisations
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="realisation-detail-container"
    >
      <div className="realisation-detail-header">
        <button onClick={() => navigate('/realisation')} className="back-button">
          ← Retour aux réalisations
        </button>
      </div>

      <article className="realisation-detail">
        <div className="realisation-detail-images-container">
          {(realisation.images || []).filter(Boolean).map((image, index) => (
            <div key={index} className="realisation-detail-image-container">
              <img 
                src={image} 
                alt={`${realisation.title} - Image ${index + 1}`} 
                className="realisation-detail-image" 
              />
            </div>
          ))}
        </div>

        <div className="realisation-detail-content">
          <span className="realisation-detail-date">{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
          <h1 className="realisation-detail-title">{realisation.title}</h1>
          <div className="realisation-detail-excerpt">{realisation.excerpt}</div>
          <div className="realisation-detail-full-content">
            {realisation.fullContent}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default RealisationDetail; 