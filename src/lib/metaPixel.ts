/**
 * Meta Pixel (Facebook Pixel) Helper Functions
 * Utilities pour faciliter le tracking des événements Meta Pixel
 */

// Types pour les événements Meta Pixel
export type MetaPixelEvent = 
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration';

export interface MetaPixelParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number }>;
  currency?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Vérifie si le Meta Pixel est initialisé
 */
export const isMetaPixelInitialized = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).fbq !== 'undefined';
};

/**
 * Track un événement PageView
 */
export const pageview = (): void => {
  if (!isMetaPixelInitialized()) return;
  
  try {
    (window as any).fbq('track', 'PageView');
  } catch (error) {
    console.error('Meta Pixel PageView error:', error);
  }
};

/**
 * Track un événement personnalisé
 * @param event - Le nom de l'événement
 * @param params - Les paramètres de l'événement
 */
export const track = (event: MetaPixelEvent, params?: MetaPixelParams): void => {
  if (!isMetaPixelInitialized()) return;
  
  try {
    if (params) {
      (window as any).fbq('track', event, params);
    } else {
      (window as any).fbq('track', event);
    }
  } catch (error) {
    console.error(`Meta Pixel ${event} error:`, error);
  }
};

/**
 * Track un événement personnalisé (custom event)
 * @param eventName - Le nom de l'événement personnalisé
 * @param params - Les paramètres de l'événement
 */
export const trackCustom = (eventName: string, params?: MetaPixelParams): void => {
  if (!isMetaPixelInitialized()) return;
  
  try {
    if (params) {
      (window as any).fbq('trackCustom', eventName, params);
    } else {
      (window as any).fbq('trackCustom', eventName);
    }
  } catch (error) {
    console.error(`Meta Pixel Custom Event ${eventName} error:`, error);
  }
};

