import Script from 'next/script';

/**
 * Composant Meta Pixel (Facebook Pixel)
 * Charge et initialise le Meta Pixel sur toutes les pages
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '850620137569894';
  
  // TEMPORAIRE : Chargement en dev pour tests
  // TODO : Remettre la condition "if (process.env.NODE_ENV !== 'production') return null;" après les tests
  // if (process.env.NODE_ENV !== 'production') {
  //   return null;
  // }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            console.log('🎯 Meta Pixel - Initialisation...', 'ID: ${pixelId}', 'ENV:', '${process.env.NODE_ENV}');
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
            console.log('✅ Meta Pixel - Initialisé avec succès', window.fbq);
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

