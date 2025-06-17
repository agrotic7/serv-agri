import React from 'react';
// Remove import of './Services.css' as we'll be using Tailwind CSS
// import './Services.css'; 
import { motion } from 'framer-motion'; // Importation de motion

const servicesData = [
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.2 14L12 17.2L6.8 14L12 6.8L17.2 14Z" /></svg>,
    title: "Systèmes d'Irrigation Intelligente",
    description: "Conception et installation de solutions d'irrigation automatisées et connectées, adaptées aux besoins spécifiques de vos cultures pour une utilisation optimale de l'eau.",
    badge: "Certifié ISO 9001"
  },
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18L7 13L12 8L17 13L12 18Z" /></svg>,
    title: "Analyse et Big Data Agronomique",
    description: "Collecte de données via capteurs et drones, analyse avancée et création de tableaux de bord intuitifs pour une prise de décision éclairée.",
    badge: "IA & Machine Learning"
  },
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z" /></svg>,
    title: "Optimisation de la Consommation d'Eau",
    description: "Solutions de précision pour réduire jusqu'à 40% votre consommation d'eau, en tenant compte des prévisions météo et des besoins réels de vos sols.",
    badge: "Économies Garanties"
  },
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" /></svg>,
    title: "Support et Accompagnement Personnalisé",
    description: "Une équipe d'experts dédiée à votre succès, offrant un support technique réactif et des conseils agronomiques sur mesure, du diagnostic à la maintenance.",
    badge: "24/7 Support"
  },
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" /></svg>,
    title: "Mise en place de l'Agriculture de Précision",
    description: "Intégration de technologies avancées (drones, capteurs, logiciels) pour une gestion optimisée des parcelles et une productivité accrue.",
    badge: "Innovation"
  },
  {
    icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 19.5C9.79 19.5 8 17.71 8 15.5C8 13.29 9.79 11.5 12 11.5C14.21 11.5 16 13.29 16 15.5C16 17.71 14.21 19.5 12 19.5Z" /></svg>,
    title: "Formations et Ateliers Pratiques",
    description: "Formations sur l'utilisation de nos systèmes et les meilleures pratiques agronomiques, pour une autonomie complète de vos équipes.",
    badge: "Expertise"
  },
];

export default function Services() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-light"
    >
      {/* Hero Section */}
      <section className="container-fluid bg-white py-5">
        <div className="container">
          <div className="row align-items-center justify-content-center py-5">
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-4 shadow-sm">
                Expert en Irrigation Connectée
              </span>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Solutions d'Irrigation Intelligente
              </h1>
              <p className="lead text-muted mb-5">
                Découvrez notre gamme complète de services d'irrigation connectée, 
                conçue pour optimiser votre consommation d'eau et maximiser vos rendements.
              </p>
              <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                <div className="col">
                  <div className="p-4 bg-white rounded-3 shadow-sm text-center">
                    <span className="d-block fs-2 fw-bold text-success mb-2">40%</span>
                    <span className="d-block text-muted">d'économie d'eau</span>
                  </div>
                </div>
                <div className="col">
                  <div className="p-4 bg-white rounded-3 shadow-sm text-center">
                    <span className="d-block fs-2 fw-bold text-success mb-2">500+</span>
                    <span className="d-block text-muted">installations</span>
                  </div>
                </div>
                <div className="col">
                  <div className="p-4 bg-white rounded-3 shadow-sm text-center">
                    <span className="d-block fs-2 fw-bold text-success mb-2">24/7</span>
                    <span className="d-block text-muted">support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-flex justify-content-center">
              <img src="servagri_irrigation.png" alt="Irrigation Solutions" className="img-fluid rounded-3 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Nos Solutions Complètes pour une Agriculture d'Avenir
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            Chez SERVAGRI, nous transformons l'agriculture grâce à des technologies de pointe et une expertise inégalée.
            Découvrez nos services sur mesure, conçus pour maximiser votre productivité tout en préservant vos ressources.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 justify-content-center">
          {servicesData.map((service, index) => (
            <div className="col" key={index}>
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div className="p-3 bg-success-subtle text-success rounded-3 mb-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    {service.icon}
                  </div>
                  <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 mb-3">
                    {service.badge}
                  </span>
                  <h3 className="card-title fs-5 fw-bold text-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="card-text text-muted mb-4 flex-grow-1 text-truncate-multiline">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
} 