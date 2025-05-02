
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">МореЯхт</h3>
            <p className="text-blue-100 mb-4">
              Лучший выбор яхт для незабываемого отдыха на море. Доступные цены, профессиональное обслуживание.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-white">Главная</Link></li>
              <li><Link to="/catalog" className="text-blue-100 hover:text-white">Каталог яхт</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-white">О нас</Link></li>
              <li><Link to="/contacts" className="text-blue-100 hover:text-white">Контакты</Link></li>
              <li><Link to="/cart" className="text-blue-100 hover:text-white">Корзина</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <address className="not-italic text-blue-100">
              <p className="mb-2">ул. Морская, 123</p>
              <p className="mb-2">г. Севастополь, Россия</p>
              <p className="mb-2">Телефон: +7 (123) 456-78-90</p>
              <p className="mb-2">Email: info@moreyacht.ru</p>
            </address>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-100">
          <p>&copy; {currentYear} МореЯхт. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
