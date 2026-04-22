import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import { MessageCircle, MapPin, Menu, X, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { generateWhatsAppLink } from './utils/whatsapp';
import { AuthProvider } from './contexts/AuthContext';
import { useCartStore } from './store/cartStore';
import Cart from './components/Cart';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Products from './pages/Products';
import Combos from './pages/Combos';
import Checkout from './pages/Checkout';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ProductDetail from './pages/ProductDetail';
import ComboDetail from './pages/ComboDetail';
import FAQ from './pages/FAQ';
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import KaliZen from './pages/KaliZen';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Prevent browser from restoring scroll position on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Force complete scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, getCartCount } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-background font-sans text-secondary flex flex-col">
      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 bg-[#4B1E7A] ${isScrolled ? 'py-1.5 shadow-md' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center cursor-pointer">
              <img 
                src="https://eaeapp.com/imagenes-ia/rapizen/logo-rapizen-white.png" 
                alt="RapiZen Logo" 
                className="h-16 object-contain" 
                referrerPolicy="no-referrer" 
              />
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/productos" className="text-white hover:text-[#F9B234] font-medium transition-colors">Catálogo</Link>
              <Link to="/combos" className="text-white hover:text-[#F9B234] font-medium transition-colors">Combos</Link>
              <Link to="/kalizen" className="text-white hover:text-[#F9B234] font-medium transition-colors">KaliZen</Link>
              <Link to="/nosotros" className="text-white hover:text-[#F9B234] font-medium transition-colors">Nosotros</Link>
              <Link to="/faq" className="text-white hover:text-[#F9B234] font-medium transition-colors">FAQ</Link>
              <button 
                onClick={toggleCart}
                className="relative p-2 text-white hover:text-[#F9B234] transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleCart}
                className="relative p-2 text-white hover:text-[#F9B234] transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-[#F9B234] p-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 text-xl">
              <Link to="/productos" className="text-left font-medium text-secondary border-b border-neutral pb-4">Catálogo</Link>
              <Link to="/combos" className="text-left font-medium text-secondary border-b border-neutral pb-4">Combos</Link>
              <Link to="/kalizen" className="text-left font-medium text-secondary border-b border-neutral pb-4">KaliZen</Link>
              <Link to="/nosotros" className="text-left font-medium text-secondary border-b border-neutral pb-4">Nosotros</Link>
              <Link to="/faq" className="text-left font-medium text-secondary border-b border-neutral pb-4">FAQ</Link>
              <a 
                href={generateWhatsAppLink("Hola RapiZen, me gustaría hacer una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-white px-6 py-4 rounded-xl font-medium text-center flex items-center justify-center mt-4"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      <Cart />
      <WhatsAppButton />

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4 bg-white/10 p-2 rounded-xl inline-block w-fit">
                <img 
                  src="https://eaeapp.com/imagenes-ia/rapizen/logo-rapizen.png" 
                  alt="RapiZen Logo" 
                  className="h-12 object-contain brightness-0 invert" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <p className="text-gray-400 text-sm max-w-sm mb-6">
                Delivery de aromas en bicicleta. Rápido, ecológico y confiable. Salta, Argentina.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-accent transition-colors">Inicio</Link></li>
                <li><Link to="/productos" className="hover:text-accent transition-colors">Catálogo</Link></li>
                <li><Link to="/combos" className="hover:text-accent transition-colors">Combos</Link></li>
                <li><Link to="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
                <li><Link to="/faq" className="hover:text-accent transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp: +54 9 387 568-4449
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  KaliZen: Plaza Güemes (Fines de semana)
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} RapiZen. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/combos" element={<Combos />} />
            <Route path="/combo/:id" element={<ComboDetail />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/kalizen" element={<KaliZen />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
