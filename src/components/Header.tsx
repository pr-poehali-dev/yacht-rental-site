
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <img src="/logo-b.svg" alt="Морские яхты" className="h-8 mr-2" />
            <span className="hidden sm:inline">МореЯхт</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">Главная</Link>
            <Link to="/catalog" className="hover:text-blue-200 transition-colors">Каталог</Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">О нас</Link>
            <Link to="/contacts" className="hover:text-blue-200 transition-colors">Контакты</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-blue-200">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                Войти
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-blue-800 mt-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-blue-200 py-2" onClick={toggleMenu}>Главная</Link>
              <Link to="/catalog" className="hover:text-blue-200 py-2" onClick={toggleMenu}>Каталог</Link>
              <Link to="/about" className="hover:text-blue-200 py-2" onClick={toggleMenu}>О нас</Link>
              <Link to="/contacts" className="hover:text-blue-200 py-2" onClick={toggleMenu}>Контакты</Link>
              <Link to="/cart" className="hover:text-blue-200 py-2" onClick={toggleMenu}>
                Корзина <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">0</span>
              </Link>
              <Link to="/login" className="hover:text-blue-200 py-2" onClick={toggleMenu}>Войти</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
