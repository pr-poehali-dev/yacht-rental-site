
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-blue-900 text-white">
      {/* Overlay Image */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1540946485063-a35a4335a0a9?auto=format&fit=crop&q=80&w=1200')",
          backgroundPosition: "center 30%"
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Незабываемые морские приключения ждут вас
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Аренда лучших яхт для идеального отдыха на море. Доступные цены, профессиональная команда и маршруты на любой вкус.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-100">
                Выбрать яхту
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                О нашей компании
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
