import React, { useState, useEffect } from 'react';

function AdminRealisations() {
  const [realisations, setRealisations] = useState([]);
  const [realisationFormData, setRealisationFormData] = useState({
    title: '',
    date: '',
    images: [],
    excerpt: '',
    fullContent: '',
    status: 'draft',
    featured: false
  });
  const [editingRealisationId, setEditingRealisationId] = useState(null);
  const [realisationFilter, setRealisationFilter] = useState('all');
  const [realisationSearchTerm, setRealisationSearchTerm] = useState('');
  const [imageRealisationPreviews, setImageRealisationPreviews] = useState([]);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compression plus agressive (qualité 50%)
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Charger les réalisations au montage du composant
  useEffect(() => {
    const savedRealisations = localStorage.getItem('realisations');
    if (savedRealisations) {
      setRealisations(JSON.parse(savedRealisations));
    }
  }, []);

  // Sauvegarder les réalisations dans le localStorage
  const saveRealisations = (updatedRealisations) => {
    try {
      console.log('Attempting to save realisations:', updatedRealisations);
      
      if (!Array.isArray(updatedRealisations)) {
        throw new Error('Les données à sauvegarder ne sont pas un tableau');
      }

      const dataSize = new Blob([JSON.stringify(updatedRealisations)]).size;
      console.log('Data size:', dataSize, 'bytes');
      
      if (dataSize > 2 * 1024 * 1024) { // Limite de 2MB pour localStorage
        throw new Error('Les données sont trop volumineuses pour le localStorage');
      }

      localStorage.setItem('realisations', JSON.stringify(updatedRealisations));
      setRealisations(updatedRealisations);
      console.log('Realisations saved successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        data: updatedRealisations
      });
      alert(`Une erreur est survenue lors de la sauvegarde de la réalisation: ${error.message}`);
      throw error;
    }
  };

  const cleanupLocalStorage = () => {
    const savedRealisations = localStorage.getItem('realisations');
    if (savedRealisations) {
      let realisationsData = JSON.parse(savedRealisations);
      // Trier par date pour garder les plus récentes
      realisationsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Garder seulement les 10 dernières réalisations
      realisationsData = realisationsData.slice(0, 10);
      localStorage.setItem('realisations', JSON.stringify(realisationsData));
      setRealisations(realisationsData);
      console.log('LocalStorage cleaned up. Keeping 10 most recent realisations.');
    }
  };

  useEffect(() => {
    // Nettoyage au chargement ou périodiquement
    cleanupLocalStorage();
  }, []);

  const handleRealisationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRealisationFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRealisationImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Vous ne pouvez télécharger que jusqu'à 5 images par réalisation.");
      return;
    }

    const newImages = [];
    const newImagePreviews = [];
    let totalSize = 0;

    for (const file of files) {
      const resizedImage = await resizeImage(file);
      newImages.push(resizedImage);
      newImagePreviews.push(resizedImage);
      totalSize += new Blob([resizedImage]).size;
    }

    if (totalSize > 4 * 1024 * 1024) { // Limite de 4MB pour les images
      alert("La taille totale des images est trop grande (max 4MB). Veuillez réduire la taille de vos images.");
      return;
    }

    setRealisationFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages] // Ajouter les nouvelles images
    }));
    setImageRealisationPreviews(prev => [...prev, ...newImagePreviews]);
  };

  const removeImage = (indexToRemove) => {
    setRealisationFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImageRealisationPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRealisationSubmit = (e) => {
    e.preventDefault();
    console.log('Realisation Form Data:', realisationFormData);

    if (!realisationFormData.title || !realisationFormData.date || !realisationFormData.excerpt || !realisationFormData.fullContent) {
      alert('Veuillez remplir tous les champs requis (Titre, Date, Extrait, Contenu complet).');
      return;
    }
    if (realisationFormData.images.length === 0 && !editingRealisationId) {
      alert('Veuillez ajouter au moins une image pour la réalisation.');
      return;
    }

    let updatedRealisations;
    if (editingRealisationId) {
      updatedRealisations = realisations.map(item => 
        item.id === editingRealisationId ? { ...realisationFormData, id: editingRealisationId } : item
      );
      setEditingRealisationId(null);
    } else {
      const newId = realisations.length > 0 ? Math.max(...realisations.map(item => item.id)) + 1 : 1;
      updatedRealisations = [...realisations, { ...realisationFormData, id: newId }];
    }

    try {
      saveRealisations(updatedRealisations);
      setRealisationFormData({
        title: '',
        date: '',
        images: [],
        excerpt: '',
        fullContent: '',
        status: 'draft',
        featured: false
      });
      setImageRealisationPreviews([]);
      alert(`Réalisation ${editingRealisationId ? 'modifiée' : 'ajoutée'} avec succès !`);
    } catch (error) {
      // L'erreur est déjà gérée dans saveRealisations, mais nous pouvons ajouter un log ici si nécessaire
      console.error('Erreur lors de la soumission de la réalisation:', error);
    }
  };

  const handleRealisationEdit = (item) => {
    setRealisationFormData(item);
    setImageRealisationPreviews(item.images || []);
    setEditingRealisationId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRealisationDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      const updatedRealisations = realisations.filter(item => item.id !== id);
      saveRealisations(updatedRealisations);
      alert('Réalisation supprimée avec succès !');
    }
  };

  const handleRealisationStatusChange = (id, newStatus) => {
    const updatedRealisations = realisations.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveRealisations(updatedRealisations);
  };

  const filteredRealisations = realisations
    .filter(item => realisationFilter === 'all' || item.status === realisationFilter)
    .filter(item => item.title.toLowerCase().includes(realisationSearchTerm.toLowerCase()));

  return (
    <div className="admin-section">
      <div className="admin-form">
        <div className="form-header">
          <h2>{editingRealisationId ? 'Modifier la réalisation' : 'Ajouter une nouvelle réalisation'}</h2>
          <div className="form-status">
            <label>
              Statut:
              <select name="status" value={realisationFormData.status} onChange={handleRealisationInputChange}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </label>
            <label>
              Mettre en avant:
              <input 
                type="checkbox" 
                name="featured" 
                checked={realisationFormData.featured} 
                onChange={handleRealisationInputChange} 
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleRealisationSubmit} className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label htmlFor="realisation-title">Titre de la réalisation <span className="required">*</span></label>
              <input
                type="text"
                id="realisation-title"
                name="title"
                value={realisationFormData.title}
                onChange={handleRealisationInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="realisation-date">Date <span className="required">*</span></label>
              <input
                type="date"
                id="realisation-date"
                name="date"
                value={realisationFormData.date}
                onChange={handleRealisationInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="realisation-excerpt">Extrait <span className="required">*</span></label>
              <textarea
                id="realisation-excerpt"
                name="excerpt"
                value={realisationFormData.excerpt}
                onChange={handleRealisationInputChange}
                required
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="realisation-fullContent">Contenu complet <span className="required">*</span></label>
              <textarea
                id="realisation-fullContent"
                name="fullContent"
                value={realisationFormData.fullContent}
                onChange={handleRealisationInputChange}
                required
                rows="10"
                className="content-editor"
              ></textarea>
            </div>
          </div>
          <div className="form-aside">
            <div className="form-group">
              <label htmlFor="realisation-image-upload" className="image-upload">
                {imageRealisationPreviews.length > 0 ? `Ajouter/Changer (${imageRealisationPreviews.length}/5)` : 'Ajouter des images (max 5)'}
                <input 
                  type="file" 
                  id="realisation-image-upload" 
                  className="image-input" 
                  onChange={handleRealisationImageChange} 
                  accept="image/*" 
                  multiple
                />
              </label>
              {imageRealisationPreviews.length > 0 && (
                <div className="image-previews">
                  {imageRealisationPreviews.map((image, index) => (
                    <div key={index} className="image-preview-container">
                      <img src={image} alt={`Aperçu ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)} 
                        className="remove-image-btn"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {editingRealisationId && (
              <button type="button" onClick={() => {
                setEditingRealisationId(null);
                setRealisationFormData({
                  title: '',
                  date: '',
                  images: [],
                  excerpt: '',
                  fullContent: '',
                  status: 'draft',
                  featured: false
                });
                setImageRealisationPreviews([]);
              }} className="cancel-edit-btn">
                Annuler la modification
              </button>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingRealisationId ? 'Modifier' : 'Ajouter'} Réalisation
            </button>
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3>Liste des Réalisations</h3>
        <div className="list-header">
          <div>Image</div>
          <div>Titre</div>
          <div>Date</div>
          <div>Statut</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        <div className="filter-buttons" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
          <input 
            type="text" 
            placeholder="Rechercher par titre..." 
            value={realisationSearchTerm}
            onChange={(e) => setRealisationSearchTerm(e.target.value)}
            className="search-box-inline"
          />
          <button 
            onClick={() => setRealisationFilter('all')} 
            className={realisationFilter === 'all' ? 'active' : ''}
          >
            Toutes
          </button>
          <button 
            onClick={() => setRealisationFilter('published')} 
            className={realisationFilter === 'published' ? 'active' : ''}
          >
            Publiées
          </button>
          <button 
            onClick={() => setRealisationFilter('draft')} 
            className={realisationFilter === 'draft' ? 'active' : ''}
          >
            Brouillons
          </button>
        </div>
        {filteredRealisations.length === 0 ? (
          <p className="no-items">Aucune réalisation trouvée.</p>
        ) : (
          filteredRealisations.map(item => (
            <div key={item.id} className="list-item">
              <div className="item-image">
                <img src={(item.images && item.images[0]) || item.image} alt={item.title} />
              </div>
              <div className="item-title">{item.title}</div>
              <div className="item-date">{item.date}</div>
              <div className="item-status">
                <span className={item.status === 'published' ? 'status-published' : 'status-draft'}>
                  {item.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleRealisationEdit(item)} className="edit-btn">
                  Modifier
                </button>
                {item.status === 'draft' ? (
                  <button onClick={() => handleRealisationStatusChange(item.id, 'published')} className="publish-btn">
                    Publier
                  </button>
                ) : (
                  <button onClick={() => handleRealisationStatusChange(item.id, 'draft')} className="unpublish-btn">
                    Dépublier
                  </button>
                )}
                <button onClick={() => handleRealisationDelete(item.id)} className="delete-btn">
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminRealisations; 