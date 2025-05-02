import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on path change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component does not render anything
};

export default ScrollToTop; 