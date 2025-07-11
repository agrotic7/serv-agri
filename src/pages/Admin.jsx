import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import './Admin.css';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Innovation',
  'Événements',
  'Partenariats',
  'Technologies',
  'Développement durable'
];

function Admin() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [realisations, setRealisations] = useState([]);
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
  const [realisationFormData, setRealisationFormData] = useState({
    title: '',
    date: '',
    images: [],
    excerpt: '',
    fullContent: '',
    status: 'draft',
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [editingRealisationId, setEditingRealisationId] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all'); // 'all', 'draft', 'published'
  const [realisationFilter, setRealisationFilter] = useState('all'); // 'all', 'draft', 'published'
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [realisationSearchTerm, setRealisationSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRealisationPreviews, setImageRealisationPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    // Cette fonction simule l'upload d'image vers un backend.
    // Pour une vraie application, vous enverriez le fichier à votre serveur.
    // Exemple avec fetch vers un backend Node.js:

    // const formData = new FormData();
    // formData.append('image', file);

    // try {
    //     const response = await fetch('http://localhost:5000/api/upload-image', {
    //         method: 'POST',
    //         body: formData,
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //         return data.imageUrl; // Ceci serait l'URL de l'image depuis votre serveur
    //     } else {
    //         console.error('Erreur lors de l\'upload de l\'image:', data.message);
    //         return null;
    //     }
    // } catch (error) {
    //     console.error('Erreur réseau lors de l\'upload de l\'image:', error);
    //     return null;
    // }

    // Pour l'instant, nous continuons avec base64 pour que l'aperçu fonctionne sans backend
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
    const savedRealisations = localStorage.getItem('realisations');
    if (savedRealisations) {
      setRealisations(JSON.parse(savedRealisations));
    }
  }, []);

  // Charger les réalisations au montage du composant
  useEffect(() => {
    fetchRealisations();
  }, []);

  // Fonction pour récupérer les réalisations
  const fetchRealisations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/get-realisations');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réalisations');
      }
      const data = await response.json();
      setRealisations(data);
    } catch (error) {
      console.error('Error fetching realisations:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer les actualités
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/get-actualites');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités');
      }
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une actualité
  const addNews = async (newsItem) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/add-actualite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsItem),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'actualité');
      }
      const newNews = await response.json();
      setNews(prev => [...prev, newNews]);
      return newNews;
    } catch (error) {
      console.error('Error adding news:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour une actualité
  const updateNews = async (id, newsItem) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/update-actualite', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...newsItem }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'actualité');
      }
      const updatedNews = await response.json();
      setNews(prev => prev.map(n => n.id === id ? updatedNews : n));
      return updatedNews;
    } catch (error) {
      console.error('Error updating news:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une actualité
  const deleteNews = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/delete-actualite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'actualité');
      }
      setNews(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les actualités au montage du composant
  useEffect(() => {
    fetchNews();
  }, []);

  // Sauvegarder les actualités dans le localStorage
  const saveNews = (updatedNews) => {
    localStorage.setItem('news', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  // Sauvegarder les réalisations dans le localStorage
  const saveRealisations = (updatedRealisations) => {
    try {
      console.log('Attempting to save realisations:', updatedRealisations);
      
      // Vérifier si les données sont valides
      if (!Array.isArray(updatedRealisations)) {
        throw new Error('Les données à sauvegarder ne sont pas un tableau');
      }

      // Vérifier la taille des données
      const dataSize = new Blob([JSON.stringify(updatedRealisations)]).size;
      console.log('Data size:', dataSize, 'bytes');
      
      if (dataSize > 5 * 1024 * 1024) { // 5MB limite
        throw new Error('Les données sont trop volumineuses pour le localStorage');
      }

      // Sauvegarder les données
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
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRealisationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRealisationFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prévisualisation immédiate
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload de l'image (simulé ou réel)
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: imageUrl // Ici, nous stockerions l'URL du serveur
        }));
      }
    }
  };

  // Fonction pour redimensionner une image avec une compression plus agressive
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Dimensions maximales réduites
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
          
          // Compression plus agressive (50% de qualité)
          const resizedImage = canvas.toDataURL('image/jpeg', 0.5);
          resolve(resizedImage);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRealisationImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limiter le nombre d'images à 5
      if (realisationFormData.images.length + files.length > 5) {
        alert('Vous ne pouvez pas ajouter plus de 5 images par réalisation');
        return;
      }

      try {
        for (const file of files) {
          // Redimensionner l'image
          const resizedImage = await resizeImage(file);
          
          setRealisationFormData(prev => ({
            ...prev,
            images: [...prev.images, resizedImage]
          }));
          setImageRealisationPreviews(prev => [...prev, resizedImage]);
        }
      } catch (error) {
        console.error('Error processing images:', error);
        alert('Une erreur est survenue lors du traitement des images');
      }
    }
  };

  // Fonction pour nettoyer le localStorage
  const cleanupLocalStorage = () => {
    try {
      // Supprimer les anciennes données si nécessaire
      const savedRealisations = localStorage.getItem('realisations');
      if (savedRealisations) {
        const realisations = JSON.parse(savedRealisations);
        // Garder seulement les 10 dernières réalisations
        if (realisations.length > 10) {
          const recentRealisations = realisations.slice(-10);
          localStorage.setItem('realisations', JSON.stringify(recentRealisations));
          setRealisations(recentRealisations);
        }
      }
    } catch (error) {
      console.error('Error cleaning up localStorage:', error);
    }
  };

  // Appeler le nettoyage au chargement
  useEffect(() => {
    cleanupLocalStorage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.date || !formData.excerpt) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      if (!formData.image) {
        alert('Veuillez ajouter une image');
        return;
      }

      const newsData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      if (editingId) {
        await updateNews(editingId, newsData);
        setEditingId(null);
      } else {
        await addNews(newsData);
      }

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
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('Une erreur est survenue lors de la sauvegarde de l\'actualité');
    }
  };

  const handleRealisationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!realisationFormData.title || !realisationFormData.date || !realisationFormData.excerpt) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      if (realisationFormData.images.length === 0) {
        alert('Veuillez ajouter au moins une image');
        return;
      }

      const realisationData = {
        ...realisationFormData,
        date: new Date(realisationFormData.date).toISOString(),
      };

      if (editingRealisationId) {
        await updateRealisation(editingRealisationId, realisationData);
        setEditingRealisationId(null);
      } else {
        await addRealisation(realisationData);
      }

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
    } catch (error) {
      console.error('Error submitting realisation:', error);
      alert('Une erreur est survenue lors de la sauvegarde de la réalisation');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      date: new Date(item.date).toISOString().split('T')[0],
      image: item.image,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      status: item.status,
      featured: item.featured
    });
    setImagePreview(item.image);
  };

  const handleRealisationEdit = (item) => {
    setEditingRealisationId(item.id);
    setRealisationFormData({
      title: item.title,
      date: new Date(item.date).toISOString().split('T')[0],
      images: item.images,
      excerpt: item.excerpt,
      fullContent: item.fullContent,
      status: item.status,
      featured: item.featured
    });
    setImageRealisationPreviews(item.images);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        await deleteNews(id);
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Une erreur est survenue lors de la suppression de l\'actualité');
      }
    }
  };

  const handleRealisationDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      try {
        await deleteRealisation(id);
      } catch (error) {
        console.error('Error deleting realisation:', error);
        alert('Une erreur est survenue lors de la suppression de la réalisation');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const newsItem = news.find(n => n.id === id);
      if (newsItem) {
        await updateNews(id, { ...newsItem, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating news status:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut');
    }
  };

  const handleRealisationStatusChange = async (id, newStatus) => {
    try {
      const realisation = realisations.find(r => r.id === id);
      if (realisation) {
        await updateRealisation(id, { ...realisation, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating realisation status:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  const filteredNews = news
    .filter(item => {
      if (newsFilter === 'all') return true;
      return item.status === newsFilter;
    })
    .filter(item =>
      item.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(newsSearchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredRealisations = realisations
    .filter(item => {
      if (realisationFilter === 'all') return true;
      return item.status === realisationFilter;
    })
    .filter(item =>
      item.title.toLowerCase().includes(realisationSearchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(realisationSearchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log('Filtered News:', filteredNews);

  const removeImage = (index) => {
    setRealisationFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageRealisationPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="admin-container"
    >
      <div className="admin-header">
        <h1>Tableau de bord Admin</h1>
        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
      </div>

      <nav className="admin-sub-nav">
        <Link to="news" className="admin-sub-nav-link">Administration des Actualités</Link>
        <Link to="realisations" className="admin-sub-nav-link">Administration des Réalisations</Link>
      </nav>

      <div className="admin-content">
        <Outlet />
      </div>
    </motion.div>
  );
}

export default Admin; 