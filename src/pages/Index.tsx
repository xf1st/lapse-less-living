
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import Philosophy from "@/components/Philosophy";
import Features from "@/components/Features";
import Support from "@/components/Support";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard } from "lucide-react";

const Index = () => {
  const [sectionsVisible, setSectionsVisible] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    // Add smooth scroll effect
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Create intersaction observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setSectionsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      if (section.id) {
        observer.observe(section);
      }
    });
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      observer.disconnect();
    };
  }, []);

  // Floating action button for login/dashboard
  const AuthButton = () => (
    <div className="fixed bottom-8 right-8 z-50 animate-float">
      {user ? (
        <Link to="/dashboard">
          <Button size="lg" className="rounded-full shadow-lg px-6 py-6 bg-brand-blue hover:bg-brand-blue/90">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Мои привычки
          </Button>
        </Link>
      ) : (
        <Link to="/auth">
          <Button size="lg" className="rounded-full shadow-lg px-6 py-6 bg-brand-blue hover:bg-brand-blue/90">
            <LogIn className="mr-2 h-5 w-5" />
            Войти
          </Button>
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <section id="feature-cards">
          <FeatureCards />
        </section>
        
        <section id="how-it-works">
          <HowItWorks />
        </section>
        
        <section id="philosophy">
          <Philosophy />
        </section>
        
        <section id="features">
          <Features />
        </section>
        
        <section id="pricing">
          <Pricing />
        </section>
        
        <section id="contact">
          <Support />
        </section>
      </main>
      
      <Footer />
      
      <AuthButton />
    </div>
  );
};

export default Index;
