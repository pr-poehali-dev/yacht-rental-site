
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import YachtDetail from './pages/YachtDetail';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/yacht/:id" element={<YachtDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
