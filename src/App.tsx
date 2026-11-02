import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useRoute } from '@/hooks/useRoute';
import PortfolioPage from '@/pages/PortfolioPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';

function AppRoutes() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  if (route === '/login') return <LoginPage />;
  if (route === '/profile') return <ProfilePage />;
  return <PortfolioPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
