import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Innovation',
  'Événements',
  'Partenariats',
  'Technologies',
  'Développement durable'
];

function AdminNews() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft', // 'draft' ou 'published'
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all'); // 'all', 'draft', 'published'
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const uploadImage = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result); // C'est le base64
        };
        reader.readAsDataURL(file);
    });
  };

  // Charger les actualités au montage du composant
  useEffect(() => {
    const savedNews = localStorage.getItem('news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    }
  }, []);

  // Sauvegarder les actualités dans le localStorage
  const saveNews = (updatedNews) => {
    localStorage.setItem('news', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    // Validation des champs requis
    if (!formData.title || !formData.date || !formData.excerpt || !formData.content || !formData.category) {
      alert('Veuillez remplir tous les champs requis (Titre, Date, Extrait, Contenu, Catégorie).');
      return;
    }
    if (!formData.image && !editingId) {
      alert('Veuillez ajouter une image pour l\'actualité.');
      return;
    }

    let updatedNews;
    if (editingId) {
      updatedNews = news.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      setEditingId(null);
    } else {
      const newId = news.length > 0 ? Math.max(...news.map(item => item.id)) + 1 : 1;
      updatedNews = [...news, { ...formData, id: newId }];
    }
    saveNews(updatedNews);
    setFormData({
      title: '',
      date: '',
      image: '',
      excerpt: '',
      content: '',
      category: '',
      status: 'draft',
      featured: false
    });
    setImagePreview(null);
    alert(`Actualité ${editingId ? 'modifiée' : 'ajoutée'} avec succès !`);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setImagePreview(item.image);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      const updatedNews = news.filter(item => item.id !== id);
      saveNews(updatedNews);
      alert('Actualité supprimée avec succès !');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedNews = news.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveNews(updatedNews);
  };

  const filteredNews = news
    .filter(item => newsFilter === 'all' || item.status === newsFilter)
    .filter(item => item.title.toLowerCase().includes(newsSearchTerm.toLowerCase()));

  return (
    <div className="admin-section">
      <div className="admin-form">
        <div className="form-header">
          <h2>{editingId ? 'Modifier l\'actualité' : 'Ajouter une nouvelle actualité'}</h2>
          <div className="form-status">
            <label>
              Statut:
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </label>
            <label>
              Mettre en avant:
              <input 
                type="checkbox" 
                name="featured" 
                checked={formData.featured} 
                onChange={handleInputChange} 
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label htmlFor="news-title">Titre de l'actualité <span className="required">*</span></label>
              <input
                type="text"
                id="news-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="news-date">Date <span className="required">*</span></label>
              <input
                type="date"
                id="news-date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="news-excerpt">Extrait <span className="required">*</span></label>
              <textarea
                id="news-excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="news-content">Contenu complet <span className="required">*</span></label>
              <textarea
                id="news-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="10"
                className="content-editor"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="news-category">Catégorie <span className="required">*</span></label>
              <select
                id="news-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-aside">
            <div className="form-group">
              <label htmlFor="news-image-upload" className="image-upload">
                {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
                <input 
                  type="file" 
                  id="news-image-upload" 
                  className="image-input" 
                  onChange={handleImageChange} 
                  accept="image/*"
                />
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Aperçu" />
                </div>
              )}
            </div>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  date: '',
                  image: '',
                  excerpt: '',
                  content: '',
                  category: '',
                  status: 'draft',
                  featured: false
                });
                setImagePreview(null);
              }} className="cancel-edit-btn">
                Annuler la modification
              </button>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? 'Modifier' : 'Ajouter'} Actualité
            </button>
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3>Liste des Actualités</h3>
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
            value={newsSearchTerm}
            onChange={(e) => setNewsSearchTerm(e.target.value)}
            className="search-box-inline"
          />
          <button 
            onClick={() => setNewsFilter('all')} 
            className={newsFilter === 'all' ? 'active' : ''}
          >
            Toutes
          </button>
          <button 
            onClick={() => setNewsFilter('published')} 
            className={newsFilter === 'published' ? 'active' : ''}
          >
            Publiées
          </button>
          <button 
            onClick={() => setNewsFilter('draft')} 
            className={newsFilter === 'draft' ? 'active' : ''}
          >
            Brouillons
          </button>
        </div>
        {filteredNews.length === 0 ? (
          <p className="no-items">Aucune actualité trouvée.</p>
        ) : (
          filteredNews.map(item => (
            <div key={item.id} className="list-item">
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="item-title">{item.title}</div>
              <div className="item-date">{item.date}</div>
              <div className="item-status">
                <span className={item.status === 'published' ? 'status-published' : 'status-draft'}>
                  {item.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="edit-btn">
                  Modifier
                </button>
                {item.status === 'draft' ? (
                  <button onClick={() => handleStatusChange(item.id, 'published')} className="publish-btn">
                    Publier
                  </button>
                ) : (
                  <button onClick={() => handleStatusChange(item.id, 'draft')} className="unpublish-btn">
                    Dépublier
                  </button>
                )}
                <button onClick={() => handleDelete(item.id)} className="delete-btn">
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

export default AdminNews; 