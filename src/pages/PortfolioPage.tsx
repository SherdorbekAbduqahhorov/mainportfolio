import { useCallback, useEffect, useState } from 'react';
import type { PortfolioContent } from '@/lib/types';
import { fetchPortfolio } from '@/lib/content';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Projects from '@/components/portfolio/Projects';
import Skills from '@/components/portfolio/Skills';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import { ErrorState, LoadingState } from '@/components/ui/StatePanel';

type PageState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; content: PortfolioContent };

export default function PortfolioPage() {
  const [state, setState] = useState<PageState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const content = await fetchPortfolio();
      setState({ status: 'ready', content });
    } catch (error) {
      console.error(error);
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === 'loading') return <LoadingState label="Loading portfolio" />;
  if (state.status === 'error') {
    return <ErrorState message="We couldn't load the portfolio right now. Please try again." onRetry={load} />;
  }

  const { profile, skills, projects } = state.content;

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact profile={profile} />
      </main>
      <Footer />
    </div>
  );
}
