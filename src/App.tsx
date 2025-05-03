
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import YachtDetail from './pages/YachtDetail';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminYachts from './pages/AdminYachts';
import AdminBookings from './pages/AdminBookings';
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Административные маршруты */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/yachts" element={<AdminYachts />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
