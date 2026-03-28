import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getSiteUrl = () => {
  if (import.meta?.env?.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://typevex.vercel.app';
};

const DEFAULT_SEO = {
  title: 'TypeSprint | Premium Typing Speed Test',
  description:
    'TypeSprint is a premium typing speed test with real-time WPM tracking, analytics, and competitive leaderboards.',
  image: '/Type-logo.png',
  keywords:
    'typing test, WPM calculator, typing speed, TypeSprint, typing practice, typing leaderboard, accuracy test',
  noIndex: false,
};

const ROUTE_SEO = {
  '/': {
    title: 'TypeSprint | Premium Typing Speed Test',
    description: 'Start your typing test instantly with real-time WPM tracking and analytics.',
  },
  '/first': {
    title: 'TypeSprint | Premium Typing Speed Test',
    description: 'Start your typing test instantly with real-time WPM tracking and analytics.',
  },
  '/home': {
    title: 'Typing Test | TypeSprint',
    description: 'Jump into the typing test with live accuracy and speed feedback.',
  },
  '/type': {
    title: 'Typing Test | TypeSprint',
    description: 'Jump into the typing test with live accuracy and speed feedback.',
  },
  '/leaderboard': {
    title: 'Leaderboard | TypeSprint',
    description: 'Compare your typing speed with the fastest typists worldwide.',
  },
  '/login': {
    title: 'Login | TypeSprint',
    description: 'Sign in to track your typing progress and stats.',
    noIndex: true,
  },
  '/register': {
    title: 'Register | TypeSprint',
    description: 'Create a TypeSprint account to save your typing history.',
    noIndex: true,
  },
  '/profile': {
    title: 'Profile | TypeSprint',
    description: 'Manage your TypeSprint profile and typing stats.',
    noIndex: true,
  },
  '/result': {
    title: 'Results | TypeSprint',
    description: 'Review your recent typing test results and performance trends.',
    noIndex: true,
  },
  '/notifications': {
    title: 'Notifications | TypeSprint',
    description: 'View your latest typing achievements and updates.',
    noIndex: true,
  },
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const routeMeta = ROUTE_SEO[location.pathname] || {};
    const meta = { ...DEFAULT_SEO, ...routeMeta };
    const canonical = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`;
    const robotsContent = meta.noIndex ? 'noindex,nofollow' : 'index,follow';
    const imageUrl = meta.image?.startsWith('http') ? meta.image : `${siteUrl}${meta.image}`;

    const setMeta = (name, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setProperty = (property, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('keywords', meta.keywords);
    setMeta('robots', robotsContent);
    setLink('canonical', canonical);

    setProperty('og:type', 'website');
    setProperty('og:site_name', 'TypeSprint');
    setProperty('og:title', meta.title);
    setProperty('og:description', meta.description);
    setProperty('og:url', canonical);
  setProperty('og:image', imageUrl);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', imageUrl);
  }, [location.pathname]);

  return null;
};

export default SEO;