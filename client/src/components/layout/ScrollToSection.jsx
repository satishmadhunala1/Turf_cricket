import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return null;
}

export const scrollToSection = (id, navigate, pathname) => {
  if (pathname === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    navigate('/', { state: { scrollTo: id } });
  }
};
