import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';
import { motion } from 'framer-motion';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/get-actualites');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des actualités');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (item) => {
    navigate(`/actualites/${item.id}`);
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
      <section className="news-section">
        <div className="news-header">
          <h2 className="news-title">Actualités</h2>
          <p className="news-subtitle">Restez informé des dernières nouvelles de SERVAGRI</p>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <article className="news-card" key={item.id}>
              <div className="news-image-container">
                <img src={item.image} alt={item.title} className="news-image" />
              </div>
              <div className="news-content">
                <span className="news-date">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-excerpt">{item.excerpt}</p>
                <button 
                  className="news-read-more"
                  onClick={() => handleReadMore(item)}
                >
                  Lire la suite
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default News; 