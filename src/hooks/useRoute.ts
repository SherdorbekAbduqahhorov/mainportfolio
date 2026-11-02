import { useEffect, useState } from 'react';

export type Route = '/' | '/login' | '/profile';

function readRoute(): Route {
  const path = window.location.hash.replace(/^#/, '');
  if (path === '/login' || path === '/profile') return path;
  return '/';
}

export function navigate(route: Route): void {
  window.location.hash = route;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
