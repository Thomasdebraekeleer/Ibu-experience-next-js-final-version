'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/** Désactivé en production — passer à true pour réactiver le popup. */
const NEWSLETTER_POPUP_ENABLED = false;

export default function NewsletterPopup() {
  const t = useTranslations('newsletterPopup');
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!NEWSLETTER_POPUP_ENABLED) return;

    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!NEWSLETTER_POPUP_ENABLED) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsletter_popup_seen', 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert(t('emailRequired'));
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
        alert(t('success'));
        setEmail('');
      } else {
        const errorData = await response.json();
        alert(t('errorPrefix', { message: errorData.message || t('errorGeneric') }));
      }
    } catch {
      alert(t('errorConnection'));
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

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
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

        <div style={{ padding: '20px', paddingTop: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {t('title')}
          </h2>

          <p style={{
            color: '#666',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {t('description')}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
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
              {isLoading ? t('submitting') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
