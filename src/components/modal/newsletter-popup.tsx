'use client';
import React, { useState, useEffect } from 'react';
import { CloseTwo } from '@/components/svg';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si le popup a déjà été vu
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
    
    if (!hasSeenPopup) {
      // Ouvrir le popup après 1 seconde
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Marquer comme vu dans localStorage (côté client uniquement)
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsletter_popup_seen', 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Veuillez entrer votre adresse email.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        handleClose();
        alert('Merci ! Vous êtes inscrit(e).');
        setEmail('');
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || 'Une erreur est survenue.'}`);
      }
    } catch (error) {
      alert('Erreur : Impossible de se connecter au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semi-transparent */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <CloseTwo />
        </button>

        {/* Contenu */}
        <div className="p-8 pt-12">
          {/* Titre */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            Soyez les premiers à réserver
          </h2>
          
          {/* Paragraphe */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            Les réservations arrivent très bientôt. Inscrivez-vous à la newsletter pour être alerté(e) en premier.
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Inscription...</span>
                </div>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {/* Texte informatif */}
          <p className="text-xs text-gray-500 text-center mt-4">
            En vous inscrivant, vous acceptez de recevoir nos actualités par email.
          </p>
        </div>
      </div>
    </div>
  );
}
