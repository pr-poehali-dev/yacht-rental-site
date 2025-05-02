
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedYachts from '@/components/FeaturedYachts';
import WhyChooseUs from '@/components/WhyChooseUs';
import TestimonialSection from '@/components/TestimonialSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <WhyChooseUs />
        <FeaturedYachts />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
