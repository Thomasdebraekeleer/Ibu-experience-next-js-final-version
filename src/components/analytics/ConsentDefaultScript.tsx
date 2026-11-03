import { CONSENT_STORAGE_KEY } from "@/lib/analytics/constants";
import { shouldInjectGoogleAnalyticsOnServer } from "@/lib/analytics/env";

/**
 * Consent Mode v2 (Basic) — état par défaut refusé, avant tout tag Google.
 * Restaure synchroniquement un choix enregistré pour éviter les race conditions.
 */
export default function ConsentDefaultScript() {
  if (!shouldInjectGoogleAnalyticsOnServer()) {
    return null;
  }

  const inline = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    try {
      var raw = localStorage.getItem('${CONSENT_STORAGE_KEY}');
      if (raw) {
        var prefs = JSON.parse(raw);
        if (prefs && prefs.version === 1) {
          gtag('consent', 'update', {
            analytics_storage: prefs.analytics ? 'granted' : 'denied',
            ad_storage: prefs.marketing ? 'granted' : 'denied',
            ad_user_data: prefs.marketing ? 'granted' : 'denied',
            ad_personalization: prefs.marketing ? 'granted' : 'denied'
          });
        }
      }
    } catch (e) {}
  `;

  return (
    <script
      id="ibu-consent-default"
      dangerouslySetInnerHTML={{ __html: inline }}
    />
  );
}
