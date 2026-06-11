'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Leaf, UpArrow, UpArrowTwo, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon } from '@/components/svg';
import AwardOne from '@/components/award/award-one';
import AvailabilitySearch from '@/components/AvailabilitySearch';
import VideoTwo from '@/components/video/video-two';
import { IBU_REVIEWS } from '@/data/ibu-reviews';
import ExpandableReviewText from '@/components/testimonial/expandable-review-text';

// images 
import port_d_1 from '@/assets/img/inner-project/showcase/showcase-details-2-2.jpg';
import port_d_2 from '@/assets/img/inner-project/showcase/showcase-details-2-3.jpg';
import port_d_3 from '@/assets/img/inner-project/showcase/showcase-details-2-4.jpg';
import port_d_4 from '@/assets/img/inner-project/showcase/showcase-details-2-5.jpg';
import port_d_5 from '@/assets/img/inner-project/showcase/showcase-details-2-6.jpg';
import port_d_6 from '@/assets/img/inner-project/showcase/showcase-details-2-7.jpg';
import port_d_7 from '@/assets/img/inner-project/showcase/showcase-details-2-8.jpg';
import port_d_8 from '@/assets/img/inner-project/showcase/showcase-details-2-9.jpg';

import fullwidth_img from '@/assets/img/inner-project/showcase/showcase-details-2-10.jpg';
import fullwidth_img_2 from '@/assets/img/inner-project/showcase/showcase-details-2-13.jpg';
import d_g_img_1 from '@/assets/img/inner-project/showcase/showcase-details-2-11.jpg';
import d_g_img_2 from '@/assets/img/inner-project/showcase/showcase-details-2-12.jpg';
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';

// images des cocons
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';


// img data pour version PC
const img_data = [port_d_1, port_d_2, port_d_3, port_d_4, port_d_5, port_d_6, port_d_7, port_d_8];

// img data pour carrousel mobile (section Évasion)
const mobile_carousel_images = [
  '/assets/img/inner-project/Caroussel pictures/Image 1.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 2.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 3.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 4.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 5.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 6.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 7.webp',
];

const PROGRAM_PHOTO_MOBILE_SRC =
  '/assets/img/inner-project/Caroussel pictures/Image Mobile home page.webp';

// Voir src/data/ibu-reviews.ts (utilisée aussi page À propos)

/** ≥768px : horizontal — <768px : vertical (aligné sur Bootstrap `md`) */
const HERO_VIDEO_BREAKPOINT_PX = 768;
const HERO_SCROLL_SOUND_FADE_PX = 300;
const HERO_SOUND_TARGET_VOLUME = 0.25;
const HERO_AUDIO_ENABLE_FADE_MS = 450;
const HERO_AUDIO_DISABLE_FADE_MS = 400;
/** Lissage par frame vers la cible scroll (0–1, typ. 0.08–0.15) */
const HERO_SCROLL_VOLUME_LERP = 0.12;
const HERO_VOLUME_MUTE_THRESHOLD = 0.01;
const HERO_VOLUME_STOP_LERP_EPS = 0.002;

const HERO_VIDEO_DESKTOP_SRC =
  'https://pub-f75a4080d6fb43b6b0e593ff2ffe8b23.r2.dev/IBU-EXPERIENCE-VIDEO%20PC.mp4';
const HERO_VIDEO_MOBILE_SRC =
  'https://pub-3b7b23a5bbcf4fe4a97e11f2b1f5fe2f.r2.dev/IBU-EXPERIENCE-VIDEO%20PHONE.mp4';

const testimonial_slider_setting = {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 1000,
  navigation: {
    nextEl: ".tp-testimonial-next",
    prevEl: ".tp-testimonial-prev",
  },
};

export default function PortfolioDetailsShowcaseTwoArea() {
  const heroRef = useRef<HTMLDivElement>(null);
  /** Conteneur vidéo desktop — parallaxe au scroll */
  const backgroundRef = useRef<HTMLDivElement>(null);
  const videoDesktopRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const bienEtreRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  /** Après avoir choisi « Activer le son » une première fois ; le fondu au scroll ne s’applique que si true. */
  const hasUserActivatedAudioRef = useRef(false);
  const [hasUserActivatedAudio, setHasUserActivatedAudio] = useState(false);

  /** Muet volontairement via le bouton (n’inverse pas hasUserActivatedAudio). */
  const soundDisabledByToggleRef = useRef(false);
  const [soundDisabledByToggle, setSoundDisabledByToggle] = useState(false);

  /** isAudioEnabled côté UI : false tant que pas d’activation / désactivé par le bouton. */
  const isAudioEnabled = hasUserActivatedAudio && !soundDisabledByToggle;

  const getHeroScrollTop = () =>
    typeof window !== 'undefined'
      ? window.scrollY || document.documentElement.scrollTop || 0
      : 0;

  /** Après hydrate : évite d’afficher le CTA son si mouvement réduit. */
  const [heroReduceMotion, setHeroReduceMotion] = useState<boolean | null>(
    null
  );

  /** Pendant une rampe volume manuelle (bouton), le lissage scroll est ignoré. */
  const heroManualFadeBlockingRef = useRef(false);
  const heroSmoothedScrollVolumeRef = useRef(0);
  const heroManualVolumeRampRafRef = useRef<number | null>(null);
  const heroScrollVolumeSmoothingRafRef = useRef<number | null>(null);

  const cancelQueuedHeroScrollVolumeTick = useCallback(() => {
    if (heroScrollVolumeSmoothingRafRef.current != null) {
      cancelAnimationFrame(heroScrollVolumeSmoothingRafRef.current);
      heroScrollVolumeSmoothingRafRef.current = null;
    }
  }, []);

  const clampHeroVolume = useCallback((v: number) => {
    return Math.min(Math.max(v, 0), HERO_SOUND_TARGET_VOLUME);
  }, []);

  /** Cible volume [0, 0.25] dérivée du scroll (linéaire sur HERO_SCROLL_SOUND_FADE_PX). */
  const getHeroScrollDesiredVolume = useCallback((y: number) => {
    if (y <= 0) return HERO_SOUND_TARGET_VOLUME;
    if (y >= HERO_SCROLL_SOUND_FADE_PX) return 0;
    return HERO_SOUND_TARGET_VOLUME * (1 - y / HERO_SCROLL_SOUND_FADE_PX);
  }, []);

  const cancelHeroManualVolumeRamp = useCallback(() => {
    if (heroManualVolumeRampRafRef.current != null) {
      cancelAnimationFrame(heroManualVolumeRampRafRef.current);
      heroManualVolumeRampRafRef.current = null;
    }
    heroManualFadeBlockingRef.current = false;
  }, []);

  /** Rampe volume avec annulation de la rampe précédente et du pending scroll (smoothstep). */
  const smoothSetHeroVolume = useCallback(
    (
      video: HTMLVideoElement,
      fromVol: number,
      toVol: number,
      durationMs: number,
      onComplete: () => void
    ) => {
      cancelHeroManualVolumeRamp();
      cancelQueuedHeroScrollVolumeTick();
      heroManualFadeBlockingRef.current = true;
      const clampedFrom = clampHeroVolume(fromVol);
      const clampedTo = clampHeroVolume(toVol);
      video.volume = clampedFrom;
      const t0 = performance.now();

      const step = (now: number) => {
        const elapsed = now - t0;
        const u = Math.min(1, elapsed / durationMs);
        const k = u * u * (3 - 2 * u);
        const v = clampHeroVolume(clampedFrom + (clampedTo - clampedFrom) * k);
        video.volume = v;
        if (u >= 1) {
          heroManualVolumeRampRafRef.current = null;
          video.volume = clampedTo;
          heroManualFadeBlockingRef.current = false;
          onComplete();
          return;
        }
        heroManualVolumeRampRafRef.current = requestAnimationFrame(step);
      };
      heroManualVolumeRampRafRef.current = requestAnimationFrame(step);
    },
    [cancelHeroManualVolumeRamp, cancelQueuedHeroScrollVolumeTick, clampHeroVolume]
  );

  /** Toutes les pistes mutées (autoplay / désactivation), sans pause. */
  const commitHeroMutedAllVideos = useCallback(() => {
    const desktop = videoDesktopRef.current;
    const mobile = videoMobileRef.current;
    [desktop, mobile].forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.volume = HERO_SOUND_TARGET_VOLUME;
    });
    heroSmoothedScrollVolumeRef.current = 0;
  }, []);

  /** Met à jour inactive = muet ; active = interpolation vers la cible scroll (rAF). */
  const tickHeroScrollVolumeSmoothing = useCallback(() => {
    heroScrollVolumeSmoothingRafRef.current = null;

    if (heroManualFadeBlockingRef.current) return;

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqDesk = window.matchMedia(
      `(min-width: ${HERO_VIDEO_BREAKPOINT_PX}px)`
    );
    const desktop = videoDesktopRef.current;
    const mobile = videoMobileRef.current;
    const active = mqDesk.matches ? desktop : mobile;
    const inactive = mqDesk.matches ? mobile : desktop;

    const keepLooping = (): number | null => {
      heroScrollVolumeSmoothingRafRef.current = requestAnimationFrame(
        tickHeroScrollVolumeSmoothing
      );
      return heroScrollVolumeSmoothingRafRef.current;
    };

    if (inactive) {
      inactive.muted = true;
      inactive.volume = HERO_SOUND_TARGET_VOLUME;
    }

    if (!active || mqReduce.matches) {
      commitHeroMutedAllVideos();
      return;
    }

    if (
      !hasUserActivatedAudioRef.current ||
      soundDisabledByToggleRef.current
    ) {
      commitHeroMutedAllVideos();
      return;
    }

    const y = getHeroScrollTop();
    const desired = getHeroScrollDesiredVolume(y);

    let s = heroSmoothedScrollVolumeRef.current;
    if (
      s <= 0 &&
      desired > HERO_VOLUME_MUTE_THRESHOLD &&
      active.volume <= HERO_VOLUME_MUTE_THRESHOLD
    ) {
      /* Reprise après mute : aligner sur la piste pour éviter un saut */
      s = Math.min(active.volume, desired);
    }
    s += (desired - s) * HERO_SCROLL_VOLUME_LERP;
    heroSmoothedScrollVolumeRef.current = s;

    const out = clampHeroVolume(s);
    active.volume = out;

    /* Pas de mute=true tant que le volume (ou la cible) reste perceptible au-dessus du seuil. */
    const shouldMuteOutput =
      out <= HERO_VOLUME_MUTE_THRESHOLD &&
      desired <= HERO_VOLUME_MUTE_THRESHOLD;

    active.muted = shouldMuteOutput;

    const diff = Math.abs(desired - out);
    if (diff > HERO_VOLUME_STOP_LERP_EPS) keepLooping();
  }, [
    clampHeroVolume,
    commitHeroMutedAllVideos,
    getHeroScrollDesiredVolume,
  ]);

  const scheduleHeroScrollVolumeTick = useCallback(() => {
    if (heroScrollVolumeSmoothingRafRef.current != null) {
      cancelAnimationFrame(heroScrollVolumeSmoothingRafRef.current);
    }
    heroScrollVolumeSmoothingRafRef.current = requestAnimationFrame(
      tickHeroScrollVolumeSmoothing
    );
  }, [tickHeroScrollVolumeSmoothing]);

  /** Après autoplay muette : lissage scroll si l’audio user est actif ; sinon tout muet. */
  const syncHeroMutedPlaybackAudio = useCallback(() => {
    if (
      hasUserActivatedAudioRef.current &&
      !soundDisabledByToggleRef.current &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches === false
    ) {
      scheduleHeroScrollVolumeTick();
    } else {
      commitHeroMutedAllVideos();
    }
  }, [commitHeroMutedAllVideos, scheduleHeroScrollVolumeTick]);

  const configureHeroVideosMutedAutoplay = useCallback(() => {
    const desk = videoDesktopRef.current;
    const mob = videoMobileRef.current;
    [desk, mob].forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.defaultMuted = true;
      try {
        (v as HTMLVideoElement).playsInline = true;
      } catch {
        /* ignore */
      }
      v.volume = HERO_SOUND_TARGET_VOLUME;
    });
  }, []);

  const getHeroVideoElements = useCallback((): HTMLVideoElement[] => {
    return [videoDesktopRef.current, videoMobileRef.current].filter(
      (v): v is HTMLVideoElement => Boolean(v)
    );
  }, []);

  /** Lecture muette uniquement ; le son utilisateur est géré par le lissage scroll / rampes bouton. */
  const attemptHeroMutedPlaybackOnly = useCallback((): Promise<void> => {
    configureHeroVideosMutedAutoplay();
    const els = getHeroVideoElements();
    return Promise.all(els.map((v) => v.play().catch(() => undefined))).then(
      () => undefined
    );
  }, [configureHeroVideosMutedAutoplay, getHeroVideoElements]);

  // === Parallaxe optimisée: rAF + désactivation mobile ===
  useIsomorphicLayoutEffect(() => {
    const bg = backgroundRef.current;
    if (!bg) return;

    const isMobile = window.innerWidth < 992;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    // IMPORTANT: Désactiver sur mobile ET si reduced motion
    if (isMobile || prefersReducedMotion) {
      bg.style.transform = 'translateY(0)';
      return;
    }

    bg.style.willChange = 'transform';
    (bg.style as any).backfaceVisibility = 'hidden';

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;

        const maxScroll = 2000;
        const clampedScroll = Math.min(scrolled, maxScroll);
        const rateBg = clampedScroll * -0.5;

        bg.style.transform = `translate3d(0, ${rateBg}px, 0)`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll as any);
      bg.style.willChange = 'auto';
    };
  }, []);

  /** Lecture muette (autoplay prod) + aucun pause() hero ; tentative au chargement puis filet sur interaction. */
  useEffect(() => {
    const mqMdUp = window.matchMedia(
      `(min-width: ${HERO_VIDEO_BREAKPOINT_PX}px)`
    );
    const heroMutedPlayInteractionEvents = [
      'pointerdown',
      'touchstart',
      'keydown',
      'scroll',
    ] as const;
    const mutedPlayListenerOpts: AddEventListenerOptions = {
      capture: true,
      passive: true,
    };

    const isActiveHeroPlayingMutedOk = (): boolean => {
      const active = mqMdUp.matches
        ? videoDesktopRef.current
        : videoMobileRef.current;
      return Boolean(active && !active.paused);
    };

    let listenersMounted = false;

    let detachInteractionFallback: () => void;

    const onUserInteractionMutedPlay = (e: Event) => {
      const target = e.target;
      if (
        target instanceof Element &&
        target.closest('.hero-sound-cta, .hero-sound-inline')
      ) {
        return;
      }
      void attemptHeroMutedPlaybackOnly().finally(() => {
        if (isActiveHeroPlayingMutedOk()) detachInteractionFallback();
      });
      syncHeroMutedPlaybackAudio();
    };

    detachInteractionFallback = () => {
      if (!listenersMounted) return;
      listenersMounted = false;
      for (const evt of heroMutedPlayInteractionEvents) {
        window.removeEventListener(
          evt,
          onUserInteractionMutedPlay,
          mutedPlayListenerOpts
        );
      }
    };

    const attachInteractionFallbackIfNeeded = () => {
      if (listenersMounted) return;
      listenersMounted = true;
      for (const evt of heroMutedPlayInteractionEvents) {
        window.addEventListener(
          evt,
          onUserInteractionMutedPlay,
          mutedPlayListenerOpts
        );
      }
    };

    const kickMutedAutoplay = () => {
      void attemptHeroMutedPlaybackOnly().finally(() => {
        if (isActiveHeroPlayingMutedOk()) {
          detachInteractionFallback();
        } else {
          attachInteractionFallbackIfNeeded();
        }
      });
      syncHeroMutedPlaybackAudio();
    };

    kickMutedAutoplay();
    mqMdUp.addEventListener('change', kickMutedAutoplay);

    attachInteractionFallbackIfNeeded();

    return () => {
      mqMdUp.removeEventListener('change', kickMutedAutoplay);
      detachInteractionFallback();
    };
  }, [attemptHeroMutedPlaybackOnly, syncHeroMutedPlaybackAudio]);

  /** Relance uniquement une frame de lissage volume (pas de volume brut sur scroll). */
  useEffect(() => {
    const shouldSmooth =
      isAudioEnabled && heroReduceMotion === false;

    if (!shouldSmooth) return;

    let scrollCoalesceRaf = 0;

    const onScroll = () => {
      cancelAnimationFrame(scrollCoalesceRaf);
      scrollCoalesceRaf = requestAnimationFrame(() => {
        scrollCoalesceRaf = 0;
        scheduleHeroScrollVolumeTick();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    scheduleHeroScrollVolumeTick();
    return () => {
      cancelAnimationFrame(scrollCoalesceRaf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [
    heroReduceMotion,
    isAudioEnabled,
    scheduleHeroScrollVolumeTick,
  ]);

  /** Préférence mouvement réduit (SSR-safe). */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setHeroReduceMotion(mq.matches);
    const h = () => setHeroReduceMotion(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  /** Hors période « son utilisateur », force le muet cohérent (sans rejouer configure sur la rampe bouton). */
  useIsomorphicLayoutEffect(() => {
    if (!hasUserActivatedAudio || soundDisabledByToggle) {
      cancelHeroManualVolumeRamp();
      cancelQueuedHeroScrollVolumeTick();
      commitHeroMutedAllVideos();
    }
  }, [
    hasUserActivatedAudio,
    soundDisabledByToggle,
    cancelHeroManualVolumeRamp,
    cancelQueuedHeroScrollVolumeTick,
    commitHeroMutedAllVideos,
  ]);

  const muteHeroSoundByUser = () => {
    cancelQueuedHeroScrollVolumeTick();
    const mqDesk = window.matchMedia(
      `(min-width: ${HERO_VIDEO_BREAKPOINT_PX}px)`
    ).matches;
    const active = mqDesk ? videoDesktopRef.current : videoMobileRef.current;
    const inactive = mqDesk ? videoMobileRef.current : videoDesktopRef.current;
    if (!active) {
      soundDisabledByToggleRef.current = true;
      setSoundDisabledByToggle(true);
      commitHeroMutedAllVideos();
      return;
    }

    const startVol = clampHeroVolume(active.volume);
    smoothSetHeroVolume(active, startVol, 0, HERO_AUDIO_DISABLE_FADE_MS, () => {
      active.muted = true;
      active.volume = HERO_SOUND_TARGET_VOLUME;
      if (inactive) {
        inactive.muted = true;
        inactive.volume = HERO_SOUND_TARGET_VOLUME;
      }
      heroSmoothedScrollVolumeRef.current = 0;
      soundDisabledByToggleRef.current = true;
      setSoundDisabledByToggle(true);
    });
  };

  const unmuteHeroSoundByUser = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    cancelQueuedHeroScrollVolumeTick();

    hasUserActivatedAudioRef.current = true;
    soundDisabledByToggleRef.current = false;
    setHasUserActivatedAudio(true);
    setSoundDisabledByToggle(false);

    const mqDesk = window.matchMedia(
      `(min-width: ${HERO_VIDEO_BREAKPOINT_PX}px)`
    ).matches;
    const active = mqDesk ? videoDesktopRef.current : videoMobileRef.current;
    const inactive = mqDesk ? videoMobileRef.current : videoDesktopRef.current;
    if (!active) return;

    if (inactive) {
      inactive.muted = true;
      inactive.volume = HERO_SOUND_TARGET_VOLUME;
    }

    active.muted = false;
    active.volume = 0;
    heroSmoothedScrollVolumeRef.current = 0;

    void active.play().catch(() => {});

    /* Mobile / iOS : volume audible dans le même geste (rAF hors gesture = muet). */
    if (!mqDesk) {
      active.volume = HERO_SOUND_TARGET_VOLUME;
      heroSmoothedScrollVolumeRef.current = HERO_SOUND_TARGET_VOLUME;
      scheduleHeroScrollVolumeTick();
      return;
    }

    smoothSetHeroVolume(
      active,
      0,
      HERO_SOUND_TARGET_VOLUME,
      HERO_AUDIO_ENABLE_FADE_MS,
      () => {
        heroSmoothedScrollVolumeRef.current = clampHeroVolume(active.volume);
        scheduleHeroScrollVolumeTick();
      }
    );
  };

  const onHeroSoundToggleClick = () => {
    if (isAudioEnabled) muteHeroSoundByUser();
    else unmuteHeroSoundByUser();
  };

  // === IntersectionObserver pour mobile hover states ===
  useEffect(() => {
    const isDesktop = window.innerWidth >= 992;
    if (isDesktop) return;
    
    const targets = [bienEtreRef.current, signatureRef.current].filter(
      (el): el is HTMLDivElement => Boolean(el)
    );

    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mobile-hover-active');
          } else {
            entry.target.classList.remove('mobile-hover-active');
          }
        });
      },
      { 
        root: null, 
        threshold: 0.25,
        rootMargin: '-50px' // Trigger un peu avant pour une meilleure expérience
      }
    );

    targets.forEach(t => io.observe(t));
    
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <>
      {/* portfolio hero — vidéos R2 ; autoplay muette garantie puis son uniquement après action utilisateur. */}
      <div ref={heroRef} className="showcase-details-2-area showcase-details-2-bg p-relative overflow-hidden">
        <div
          ref={backgroundRef}
          className="hero-video-layer p-absolute w-100 h-100 d-none d-md-block"
          style={{
            zIndex: 1,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* TODO(hero-video): poster="/..." quand une image poster dédiée sera disponible */}
          <video
            ref={videoDesktopRef}
            src={HERO_VIDEO_DESKTOP_SRC}
            className="hero-video-media"
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            suppressHydrationWarning
            aria-hidden="true"
            controls={false}
          />
        </div>
        <div
          className="hero-video-layer p-absolute w-100 h-100 d-block d-md-none"
          style={{
            zIndex: 1,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* TODO(hero-video): poster="/..." quand une image poster dédiée sera disponible */}
          <video
            ref={videoMobileRef}
            src={HERO_VIDEO_MOBILE_SRC}
            className="hero-video-media"
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            suppressHydrationWarning
            aria-hidden="true"
            controls={false}
          />
        </div>

        {/* Voile léger pour améliorer la lisibilité du texte / menu au-dessus */}
        <div className="hero-video-scrim p-absolute w-100 h-100" aria-hidden="true" />

        {/* Contenu du hero avec textes */}
        <div 
          className="hero-content-wrapper p-relative" 
          style={{
            zIndex: 2, 
             paddingTop: '0px',
            marginTop: 'clamp(-140px, -16vw, -160px)'
          }}
        >
          <div className="showcase-details-2-wrapper" data-lag="0.2" data-stagger="0.08">
            <div className="container container-1550">
                <div className="row">
                  <div className="col-xl-8">
                      <div className="showcase-details-2-title-box">
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation force-visible" style={{
                          whiteSpace: 'nowrap',
                          fontSize: 'clamp(2.2rem, 11vw, 7.8rem)',
                          lineHeight: '0.8',
                          letterSpacing: '0.08em',
                          fontWeight: '700',
                          width: '100%',
                          maxWidth: '100%',
                          textAlign: 'left',
                          transform: 'translateX(0)',
                          position: 'relative',
                          zIndex: '1',
                          color: 'white',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          marginLeft: '0',
                          paddingLeft: '0'
                        }}>
                          IBÙ EXPERIENCE
                        </h5>
                        <span className="showcase-details-2-subtitle tp_title_anim force-visible" style={{
                          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                          lineHeight: '1.3',
                          fontWeight: '400',
                          marginBottom: '20px',
                          display: 'block'
                        }}>L&apos;art de s&apos;évader dans des lieux d&apos;exception</span>
                        <div className="hero-keywords" style={{
                          fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                          color: 'white',
                          fontWeight: '300',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          opacity: '0.9'
                        }}>
                          VIGNOBLE • CHÂTEAU • DOMAINE
                        </div>
                        {heroReduceMotion === false && (
                          <div
                            className="hero-sound-inline"
                            style={{ marginTop: '18px' }}
                          >
                            <button
                              type="button"
                              className="hero-sound-cta hero-sound-cta-under-keywords"
                              onClick={onHeroSoundToggleClick}
                              aria-label={
                                isAudioEnabled
                                  ? 'Désactiver le son de la vidéo en arrière-plan'
                                  : 'Activer le son de la vidéo en arrière-plan'
                              }
                            >
                              {isAudioEnabled
                                ? 'Désactiver le son'
                                : 'Activer le son'}
                            </button>
                          </div>
                        )}
                      </div>
                  </div>
                  
                </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche de disponibilités (custom, redirection Lodgify) */}
        <div 
          className="lodgify-hero-container p-absolute availability-search-hero-wrapper"
          style={{
            width: 'auto',
            maxWidth: '820px',
            pointerEvents: 'auto',
            minWidth: 0
          }}
        >
          <AvailabilitySearch className="w-100" variant="hero" />
        </div>

      </div>
      {/* portfolio hero */}

      {/* details title avec galerie intégrée */}
      <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation" style={{
                        whiteSpace: 'nowrap',
                        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                        lineHeight: '1.1',
                        letterSpacing: 'clamp(0.05em, 0.5vw, 0.08em)'
                      }}>IBÙ EXPERIENCE</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Évasion
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-section-right tp_title_anim">
                      <p>Dormez en pleine nature, nichés dans des vignobles, châteaux et autres lieux d&apos;exception, à travers la Belgique. Nos Cocons au design minimaliste et confortable vous accueillent pour une expérience hors du temps, entre élégance, bien-être et gastronomie locale, à vivre avec ceux que vous aimez.</p>
                  </div>
                </div>
            </div>
          </div>
          
          {/* Version PC - moving gallery */}
          <div className="moving-gallery d-none d-lg-block" style={{marginTop: '120px'}}>
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-top d-flex align-items-end mb-20">
              {img_data.slice(0,4).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>

          <div className="moving-gallery d-none d-lg-block">
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-bottom d-flex align-items-start">
              {img_data.slice(4,8).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>

          {/* Version Mobile - Carrousel (pleine largeur sans 100vw → évite le scroll horizontal) */}
          <div className="evasion-mobile-fullbleed d-block d-lg-none" style={{ marginTop: '60px' }}>
            <Swiper
              slidesPerView={1}
              centeredSlides={true}
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet evasion-mobile-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active evasion-mobile-bullet-active',
              }}
              modules={[Autoplay, Pagination]}
              className="evasion-mobile-carousel"
              style={{
                padding: '0 0 40px 0'
              }}
            >
              {mobile_carousel_images.map((imgSrc, i) => (
                <SwiperSlide key={i}>
                  <div className="evasion-mobile-item" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <Image 
                      src={imgSrc} 
                      alt={`Évasion IBÙ - Image ${i + 1}`}
                      width={500}
                      height={400}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
      </div>
      {/* details title avec galerie intégrée */}

      {/* Awards section - The Program */}
      <div className="tp-award-wrapper">
        <AwardOne cls="pt-120 pb-250" />
      </div>
      {/* Awards section */}

      {/* full width image — PC : photo horizontale + parallaxe ; mobile : taille native */}
      <div className="showcase-details-2-fullwidth-img program-photo-spacing">
          <Image
            data-speed=".8"
            src={fullwidth_img}
            alt="fullwidth_img"
            className="program-photo-desktop d-none d-md-block w-100"
            style={{ height: 'auto' }}
          />
          <Image
            src={PROGRAM_PHOTO_MOBILE_SRC}
            alt="Le Programme IBÙ"
            width={1200}
            height={1600}
            sizes="100vw"
            className="program-photo-mobile-native d-block d-md-none w-100"
            style={{ width: '100%', height: 'auto' }}
          />
      </div>
      {/* full width image */}

      {/* detail title 3 — Notre Approche */}
      <div className="showcase-details-2-area mission-approach-section pt-120 pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-10">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Notre Approche.</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Mission
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-content-right tp_title_anim">
                      <p>IBÙ offre la chance de séjourner au cœur de domaines d&apos;exception en Belgique, en valorisant leur patrimoine, leurs produits et leur savoir-faire.</p>
                      <p>Nous créons des expériences uniques qui allient hébergement raffiné et immersion dans des lieux emblématiques, pour sublimer le terroir local.</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* detail title 3 */}

      {/* grid images */}
      <div className="showcase-details-2-grid-area pb-90 grid-before-engagements after-mission-photos">
          <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-left" src={d_g_img_1} alt="details-img" style={{height:'auto'}}/>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-right" src={d_g_img_2} alt="details-img" style={{height:'auto'}}/>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* grid images */}

             {/* Section fusionnée : Engagements + Nos Formules */}
       <div className="showcase-details-2-area pt-60 pb-120 engagements-section">
           <div className="container">
             {/* Section Engagements */}
             <div className="row">
                 <div className="col-xl-3">
                   <div className="showcase-details-2-section-left">
                       <span className="ab-inner-subtitle mb-25">
                         <Leaf/>
                         Engagements
                       </span>
                   </div>
                 </div>
                 <div className="col-xl-9">
                   <div className="showcase-details-2-content-right tp_title_anim">
                       <p style={{marginBottom: '60px'}}>Nos hébergements allient respect de l&apos;environnement, circuits courts et harmonie avec la nature. Conçus avec des matériaux durables, ils valorisent les producteurs locaux et intègrent des solutions éco-énergétiques pour offrir une expérience authentique et responsable..</p>
                   </div>
                 </div>
             </div>
             
             {/* Section Nos Cocons intégrée */}
             <div className="row" style={{marginTop: '60px'}}>
                 <div className="col-xl-8">
                   <div className="showcase-details-2-section-box">
                       <h4 className="showcase-details-2-section-title tp-char-animation">NOS COCONS</h4>
                   </div>
                 </div>
             </div>
             <div className="row">
                 <div className="col-xl-3">
                   <div className="showcase-details-2-section-left">
                       <span className="ab-inner-subtitle mb-25">
                         <Leaf/>
                         Immersion naturelle
                       </span>
                   </div>
                 </div>
                 <div className="col-xl-9">
                   <div className="showcase-details-2-content-right tp_title_anim">
                       <p>Conçus dans un esprit minimaliste et chaleureux, nos cocons offrent une immersion totale dans la nature sans compromis sur le confort : lit double avec baie vitrée panoramique, salle de bain moderne, kitchenette fonctionnel et mini garde robe.</p>
                       <p style={{marginBottom: '50px'}}>Pour prolonger l&apos;expérience, profitez d&apos;options bien-être en extérieur : sauna et bain nordique avec vue imprenable sur le domaine, en toute intimité.</p>
                   </div>
                 </div>
             </div>
             
             {/* Images des cocons - Version PC */}
             <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '40px'}}>
                 <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_1} alt="cocons-img-1" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_2} alt="cocons-img-2" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_3} alt="cocons-img-3" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_4} alt="cocons-img-4" style={{height:'auto'}}/>
                    </div>
                  </div>
             </div>

             {/* Images des cocons - Version Mobile Carrousel */}
             <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '40px'}}>
               <Swiper
                 slidesPerView={1}
                 centeredSlides={true}
                 spaceBetween={20}
                 loop={true}
                 autoplay={{
                   delay: 4000,
                   disableOnInteraction: false,
                 }}
                 pagination={{
                   clickable: true,
                   bulletClass: 'swiper-pagination-bullet cocons-mobile-bullet',
                   bulletActiveClass: 'swiper-pagination-bullet-active cocons-mobile-bullet-active',
                 }}
                 modules={[Autoplay, Pagination]}
                 className="cocons-mobile-carousel"
                 style={{
                   padding: '0 20px 40px 20px'
                 }}
               >
                 {[cocons_img_1, cocons_img_2, cocons_img_3, cocons_img_4].map((imgSrc, i) => (
                   <SwiperSlide key={i}>
                     <div className="cocons-mobile-item" style={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center'
                     }}>
                       <Image 
                         src={imgSrc} 
                         alt="Nos Cocons IBÙ" 
                         style={{
                           width: '100%',
                           maxWidth: '350px',
                           height: '280px',
                           objectFit: 'cover'
                         }}
                       />
                     </div>
                   </SwiperSlide>
                 ))}
               </Swiper>
             </div>
             
             {/* Icônes des cocons - Version PC */}
             <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '60px'}}>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <LitDoubleIcon />
                       </div>
                       <h6 className="cocon-feature-title">Lit double</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <BathroomIcon />
                       </div>
                       <h6 className="cocon-feature-title">Salle de bain</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <KitchenetteIcon />
                       </div>
                       <h6 className="cocon-feature-title">Kitchenette</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <GardeRobeIcon />
                       </div>
                       <h6 className="cocon-feature-title">Mini garde robe</h6>
                   </div>
                 </div>
             </div>

             {/* Icônes des cocons - Version Mobile (2x2) */}
             <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '60px'}}>
               <div className="row">
                 {/* Première ligne : Lit double + Salle de bain */}
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <LitDoubleIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Lit double</h6>
                   </div>
                 </div>
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <BathroomIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Salle de bain</h6>
                   </div>
                 </div>
               </div>
               
               <div className="row" style={{marginTop: '30px'}}>
                 {/* Deuxième ligne : Kitchenette + Garde robe */}
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <KitchenetteIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Kitchenette</h6>
                   </div>
                 </div>
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <GardeRobeIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Mini garde robe</h6>
                   </div>
                 </div>
               </div>
             </div>
           </div>
       </div>
       {/* details title 5 */}

      <VideoTwo />

      {/* Avis clients (à propos + accueil) */}
      <div className="tp-testimonial-area pb-120 pt-120 ils-nous-soutiennent-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 text-center">
              <div className="showcase-details-2-section-box mb-60 text-center">
                <h4 className="showcase-details-2-section-title ils-nous-soutiennent-title ibu-title-no-split">
                  Ils ont testé avant vous
                </h4>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="tp-testimonial-slider-wrapper p-relative">
                {/* Flèches desktop */}
                <div className="tp-testimonial-arrow-box d-none d-lg-block">
                  <button className="tp-testimonial-prev" style={{
                    background: 'transparent',
                    border: '2px solid #053725',
                    color: '#053725',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    ←
                  </button>
                  <button className="tp-testimonial-next" style={{
                    background: 'transparent',
                    border: '2px solid #053725',
                    color: '#053725',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    →
                  </button>
                </div>

                <Swiper
                  {...testimonial_slider_setting}
                  modules={[Navigation]}
                  className="swiper-container tp-testimonial-slider-active fix"
                >
                  {IBU_REVIEWS.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="tp-testimonial-item text-center">
                        <ExpandableReviewText text={item.desc} />
                        <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: '#053725' }}>
                          <em>{item.name}</em>
                          {item.designation ? ` - ${item.designation}` : ''}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Flèches mobile */}
                <div className="tp-testimonial-arrow-box-mobile d-lg-none" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '30px'
                }}>
                  <button className="tp-testimonial-prev" style={{
                    background: 'transparent',
                    border: '2px solid #053725',
                    color: '#053725',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    position: 'static',
                    transform: 'none'
                  }}>
                    ←
                  </button>
                  <button className="tp-testimonial-next" style={{
                    background: 'transparent',
                    border: '2px solid #053725',
                    color: '#053725',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    position: 'static',
                    transform: 'none'
                  }}>
                    →
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Styles consolidés */}
      <style jsx>{`
        /* Optimisations pour les performances du hero */
        .hero-video-layer {
          will-change: transform;
          contain: layout paint size;
          transform: translateZ(0);
        }
        .hero-video-scrim {
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.1);
        }
        .hero-video-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          pointer-events: none;
        }
        video.hero-video-media::-webkit-media-controls {
          display: none !important;
        }
        video.hero-video-media::-webkit-media-controls-enclosure {
          display: none !important;
        }
        .hero-sound-cta {
          font-family: inherit;
          font-size: clamp(13px, 2.8vw, 15px);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: rgba(0, 0, 0, 0.35);
          color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }
        .hero-sound-cta:hover {
          border-color: rgba(255, 255, 255, 0.75);
          background: rgba(0, 0, 0, 0.48);
          color: #fff;
        }
        .hero-sound-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        .hero-sound-cta.hero-sound-cta-under-keywords {
          align-self: flex-start;
          font-size: clamp(11px, 2.4vw, 13px);
          padding: 0.42rem 0.88rem;
          letter-spacing: 0.08em;
        }
        .hero-sound-inline {
          display: flex;
          justify-content: flex-start;
        }
        
        /* Réduire l'espace entre "Le Programme" et la photo sur mobile */
        @media (max-width: 991px) {
          /* Empêcher le micro scroll horizontal (100vw, titres nowrap, carrousels…) */
          :global(body.home-page),
          :global(body.home-page #smooth-wrapper),
          :global(body.home-page #smooth-content),
          :global(body.home-page main) {
            overflow-x: clip;
            max-width: 100%;
          }

          .showcase-details-2-area {
            overflow-x: clip;
            max-width: 100%;
          }

          .showcase-details-2-section-title {
            white-space: normal !important;
          }

          /* Carrousel mobile : bord à bord via marges négatives du container, pas 100vw */
          .evasion-mobile-fullbleed {
            width: auto;
            max-width: none;
            margin-left: calc(-1 * var(--bs-gutter-x, 1.5rem) * 0.5);
            margin-right: calc(-1 * var(--bs-gutter-x, 1.5rem) * 0.5);
          }

          .evasion-mobile-carousel {
            max-width: 100%;
            overflow: hidden;
          }

          /* Forcer un espacement au-dessus du titre pour éviter qu'il ne passe sous la section précédente */
          .tp-award-wrapper {
            padding-top: 8px !important;
            margin-top: 0 !important;
          }
          .tp-award-wrapper :global(.tp-award-area) {
            padding-top: 12px !important;
            padding-bottom: 8px !important;
            margin-top: 0 !important;
          }
          /* Décaler le bloc titre pour éviter toute découpe visuelle */
          .tp-award-wrapper :global(.tp-award-title-box) {
            margin-top: 4px !important;
            padding-top: 0 !important;
          }
          /* Garantir que le titre "L'instant IBÙ" s'affiche sur mobile */
          .tp-award-wrapper :global(.tp-award-title-box),
          .tp-award-wrapper :global(.tp-award-title-box h4),
          .tp-award-wrapper :global(.tp-award-title-box .showcase-details-2-section-title) {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-size: clamp(3rem, 9vw, 4.6rem) !important;
            line-height: 1.05 !important;
            letter-spacing: 0.02em !important;
          }
          
          /* Réduire drastiquement le padding-bottom de la section Awards */
          .tp-award-wrapper :global(.tp-award-area) {
            padding-bottom: 8px !important;
            margin-bottom: 0 !important;
          }

          /* Annuler les gros espacements PC (custom-hero-effects) sur mobile */
          .tp-award-wrapper :global(.tp-award-list-wrap) {
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .tp-award-wrapper :global(.tp-award-area .col-xl-8),
          .tp-award-wrapper :global(.tp-award-area .col-12) {
            padding-bottom: 0 !important;
          }
          .tp-award-wrapper :global(.tp-award-list-item:last-child::after) {
            margin-bottom: 0 !important;
          }
          .tp-award-wrapper :global(.tp-award-list-item:last-child) {
            padding-bottom: 12px !important;
          }
          
          /* Garder la photo complète sans découpe - retirer la marge négative */
          .program-photo-spacing {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Mobile : photo verticale 1200×1600 — pleine largeur écran, ratio conservé, sans zoom/crop */
          .program-photo-spacing.showcase-details-2-fullwidth-img {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }

          .program-photo-spacing .program-photo-mobile-native {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center top !important;
            display: block !important;
          }
          
          /* Garantir que l'image garde sa taille originale et ne se coupe pas */
          .showcase-details-2-fullwidth-img {
            overflow: visible !important;
          }
          
          .showcase-details-2-fullwidth-img img:not(.program-photo-mobile-native) {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center top !important;
            max-height: none !important;
          }
          
          /* Réduire de moitié l'espace entre les photos et "Engagements" */
          .grid-before-engagements {
            padding-bottom: 45px !important; /* 90px / 2 */
          }
          
          .engagements-section {
            padding-top: 30px !important; /* 60px / 2 */
          }
          
          /* Réduire l'espace entre "sublimer le terroir local" et les photos sur mobile */
          .mission-approach-section.showcase-details-2-area {
            padding-bottom: 24px !important;
          }

          .after-mission-photos {
            margin-top: -8px !important;
            padding-top: 0 !important;
          }
        }
        
        @media (max-width: 768px) {
          .showcase-details-2-title {
            white-space: normal !important;
          }
          
          /* Encore plus de remontée sur petits mobiles */
          .tp-award-wrapper :global(.tp-award-area) {
            padding-top: 10px !important;
            padding-bottom: 4px !important;
            margin-bottom: 0 !important;
          }

          .tp-award-wrapper :global(.tp-award-list-wrap) {
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }

          .tp-award-wrapper :global(.tp-award-area .col-xl-8),
          .tp-award-wrapper :global(.tp-award-area .col-12) {
            padding-bottom: 0 !important;
          }
          
          .program-photo-spacing {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Garantir que l'image garde sa taille originale et ne se coupe pas sur petits écrans */
          .program-photo-spacing.showcase-details-2-fullwidth-img {
            height: auto !important;
          }

          .program-photo-spacing .program-photo-mobile-native {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
          }

          .showcase-details-2-fullwidth-img img:not(.program-photo-mobile-native) {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center top !important;
            max-height: none !important;
          }
          
          /* Réduire de moitié l'espace entre les photos et "Engagements" */
          .grid-before-engagements {
            padding-bottom: 45px !important; /* 90px / 2 */
          }
          
          .engagements-section {
            padding-top: 30px !important; /* 60px / 2 */
          }

          .mission-approach-section.showcase-details-2-area {
            padding-bottom: 16px !important;
          }

          .after-mission-photos {
            margin-top: -4px !important;
          }
        }
        
        
        @media (max-width: 991px) {
          .showcase-hover-container.mobile-hover-active .showcase-hover-text {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
          }
          
          .showcase-hover-container.mobile-hover-active .showcase-image-link::before {
            opacity: 0.8 !important;
          }
        }
        
        .cocons-mobile-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .cocons-mobile-carousel .swiper-pagination-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        
        .evasion-mobile-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .evasion-mobile-carousel .swiper-pagination-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        
        /* Ajustement mobile pour le hero - descendre le bloc de texte */
        @media (max-width: 991px) {
          .hero-content-wrapper {
            margin-top: clamp(-40px, -5vw, -60px) !important;
            z-index: 100 !important; /* Au-dessus du widget sur mobile */
            position: relative !important;
            pointer-events: none !important; /* Permet les interactions avec le widget en dessous */
          }
          /* S'assurer que le texte est au-dessus du widget mais n'empêche pas les interactions */
          .showcase-details-2-title-box,
          .showcase-details-2-title,
          .showcase-details-2-subtitle,
          .hero-keywords {
            position: relative !important;
            z-index: 101 !important; /* Au-dessus du contenu wrapper */
            pointer-events: none !important; /* Permet les interactions avec le widget en dessous */
          }
          /* Réactiver pointer-events pour les liens si nécessaire */
          .showcase-details-2-title-box a,
          .showcase-details-2-title a {
            pointer-events: auto !important;
          }
          /* Bouton son : cliquable sur mobile (parent en pointer-events: none) */
          .hero-sound-inline,
          .hero-sound-cta {
            pointer-events: auto !important;
            position: relative !important;
            z-index: 102 !important;
            touch-action: manipulation;
          }
          /* Désactiver l'effet parallax sur mobile pour éviter les saccades */
          .showcase-details-2-fullwidth-img img.program-photo-desktop {
            transform: none !important;
            will-change: auto !important;
          }
          .showcase-details-2-fullwidth-img {
            transform: none !important;
            will-change: auto !important;
          }
        }
        
        /* Styles pour le widget Lodgify dans le hero */
        .lodgify-hero-container {
          /* Positionnement par défaut - PC */
          z-index: 10; /* Au-dessus de l'image premier plan (z-index 3) sur PC */
          box-sizing: border-box !important;
        }
        
        /* Empêcher le widget de dépasser à gauche du viewport */
        .lodgify-hero-container #lodgify-search-bar {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        @media (min-width: 769px) {
          .lodgify-hero-container {
            width: auto !important;
            max-width: 820px !important;
            min-width: 0 !important;
            z-index: 10 !important;
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Surcharger le fichier ibu-bien-etre-mobile-fix.css avec une spécificité très élevée */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container,
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container {
            top: 60% !important; /* Position ajustée - remonté encore */
            left: 5% !important;
            width: 90% !important;
            max-width: 90% !important;
            right: 5% !important;
            z-index: 4 !important; /* Au-dessus de l'image premier plan (z-index 3) mais en dessous du texte (z-index 100+) */
            pointer-events: auto !important; /* Permet les interactions avec le widget */
          }
          /* S'assurer que le widget lui-même accepte les interactions */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box),
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box) {
            pointer-events: auto !important;
          }
        }
        
        /* Styles CSS pour le widget de booking Lodgify dans le hero - Background blanc réduit */
        .lodgify-hero-container :global(#lodgify-book-now-box) {
          --ldg-bnb-background: #ffffff !important;
          --ldg-bnb-border-radius: 0.42em !important;
          --ldg-bnb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1) !important;
          --ldg-bnb-padding: 14px !important;
          --ldg-bnb-input-background: #ffffff !important;
          --ldg-bnb-button-border-radius: 0px !important;
          --ldg-bnb-color-primary: #053701 !important;
          --ldg-bnb-color-primary-lighter: #829b80 !important;
          --ldg-bnb-color-primary-darker: #031c01 !important;
          --ldg-bnb-color-primary-contrast: #ffffff !important;
          --ldg-component-calendar-cell-selection-bg-color: #053701 !important;
          --ldg-component-calendar-cell-selection-color: #ffffff !important;
          --ldg-component-calendar-cell-selected-bg-color: #829b80 !important;
          --ldg-component-calendar-cell-selected-color: #ffffff !important;
          --ldg-bnb-font-family: inherit !important;
          /* Background blanc mais largeur réduite pour moins d'espace à gauche/droite */
          background: #ffffff !important;
          box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1) !important;
          padding: 14px !important;
          border-radius: 0.42em !important;
          width: fit-content !important;
          min-width: 300px !important;
          max-width: 450px !important;
          box-sizing: border-box !important;
          display: block !important;
          margin: 0 auto !important;
        }
        
        /* S'assurer que le conteneur parent ne crée pas d'espace supplémentaire */
        .lodgify-hero-container {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Sur PC : aligner le widget à gauche avec le texte du conteneur - Descendre pour éviter chevauchement */
        @media (min-width: 1400px) {
          .lodgify-hero-container {
            left: max(30px, calc((100vw - 1550px) / 2 + 15px)) !important;
            top: 60% !important;
            transform: translateY(-50%) !important;
            margin-left: 0 !important;
          }
        }
        
        @media (min-width: 992px) and (max-width: 1399px) {
          .lodgify-hero-container {
            left: max(30px, 3%) !important;
            top: 60% !important;
            transform: translateY(-50%) !important;
            margin-left: 0 !important;
          }
        }
        
        /* Sur mobile : centrer le widget - Position ajustée pour éviter chevauchement */
        @media (max-width: 991px) {
          /* Surcharger le fichier ibu-bien-etre-mobile-fix.css avec une spécificité très élevée */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container,
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container {
            left: 50% !important;
            top: 60% !important; /* Position ajustée - remonté encore */
            z-index: 4 !important; /* Au-dessus de l'image premier plan (z-index 3) mais en dessous du texte (z-index 100+) */
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 450px !important;
            pointer-events: auto !important; /* Permet les interactions avec le widget */
          }
          /* S'assurer que le widget lui-même accepte les interactions */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box),
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box) {
            pointer-events: auto !important;
          }
        }
        
        /* Enlever les marges/paddings des éléments internes qui créent de l'espace */
        .lodgify-hero-container :global(#lodgify-book-now-box) > * {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        
        .lodgify-hero-container :global(#lodgify-book-now-box) > *:first-child {
          margin-top: 0 !important;
        }
        
        .lodgify-hero-container :global(#lodgify-book-now-box) > *:last-child {
          margin-bottom: 0 !important;
        }
        
        /* Annuler les styles globaux qui suppriment les bordures */
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="number"]),
        .lodgify-hero-container :global(#lodgify-book-now-box .number-input),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-counter),
        .lodgify-hero-container :global(#lodgify-book-now-box .price-display),
        .lodgify-hero-container :global(#lodgify-book-now-box .total-price),
        .lodgify-hero-container :global(#lodgify-book-now-box .minimum-price),
        .lodgify-hero-container :global(#lodgify-book-now-box .price-amount),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-count) {
          border: initial !important;
          outline: initial !important;
          box-shadow: initial !important;
          background: initial !important;
        }
        
        /* Annuler les styles globaux pour les champs de dates */
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="text"]),
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="date"]),
        .lodgify-hero-container :global(#lodgify-book-now-box select) {
          background: #ffffff !important;
          border: 1px solid #ddd !important;
          border-radius: 4px !important;
          box-shadow: none !important;
        }
        
        /* Annuler les styles globaux pour les conteneurs d'invités */
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-selector),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-counter-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-input-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-field),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-wrapper) {
          border: initial !important;
          box-shadow: initial !important;
          background: initial !important;
        }
        
        /* Annuler les styles globaux pour les conteneurs de dates */
        .lodgify-hero-container :global(#lodgify-book-now-box .date-selector),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-field),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-wrapper) {
          border: initial !important;
          border-radius: initial !important;
          background: initial !important;
          box-shadow: initial !important;
        }
        
        /* Annuler les styles globaux pour les boutons +/- */
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="plus"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="moins"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="increase"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="decrease"]),
        .lodgify-hero-container :global(#lodgify-book-now-box .increment-button),
        .lodgify-hero-container :global(#lodgify-book-now-box .decrement-button) {
          border: initial !important;
          outline: initial !important;
          box-shadow: initial !important;
          background: initial !important;
          border-radius: initial !important;
        }
        /* Espacement pour la section Ils nous soutiennent */
        .ils-nous-soutiennent-section {
          background: #ffffff;
          margin-top: 0 !important;
          padding-top: 80px !important;
          padding-bottom: 20px !important;
        }
        
        /* Titre avis — harmonisé avec la page À propos, taille raisonnable sur grands écrans */
        h4.showcase-details-2-section-title.ils-nous-soutiennent-title {
          font-size: clamp(1.75rem, 3.25vw, 3rem) !important;
          line-height: 1.15 !important;
          max-width: 100% !important;
          width: 100% !important;
          word-wrap: break-word !important;
          hyphens: none !important;
          letter-spacing: 0.045em !important;
          word-spacing: 0.06em !important;
          text-align: center !important;
        }
      `}</style>
    </>
  )
}
