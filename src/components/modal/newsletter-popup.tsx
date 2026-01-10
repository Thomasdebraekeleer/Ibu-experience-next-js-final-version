'use client';
import React, { useState, useEffect } from 'react';
import { CloseTwo } from '@/components/svg';

export default function NewsletterPopup() {
  // POPUP DÉSACTIVÉ - Pour réactiver, supprimez simplement la ligne ci-dessous
  return null;
  
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      
      {/* Modal simplifié */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        {/* Contenu */}
        <div style={{ padding: '20px', paddingTop: '40px' }}>
          {/* Titre */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Soyez les premiers à réserver
          </h2>
          
          {/* Paragraphe */}
          <p style={{
            color: '#666',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Les réservations arrivent très bientôt. Inscrivez-vous à la newsletter pour être alerté(e) en premier.
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#053725',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isLoading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
