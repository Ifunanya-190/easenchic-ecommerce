import React from 'react';
import { useLocation } from 'react-router-dom';
import LoadingDots from './LoadingDots';

const RouteLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const prevPathRef = React.useRef(location.pathname);

  React.useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setLoading(true);
      prevPathRef.current = location.pathname;
      const t = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  return loading ? <LoadingDots /> : null;
};

export default RouteLoader;
