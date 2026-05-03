import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ChevronLeft, LayoutGrid, ShoppingBag, Plus, Minus, Star, Leaf, Recycle, Gift, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ComboDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [baseQuantity, setBaseQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addItem, toggleCart, getCartCount } = useCartStore();
  const cartCount = getCartCount();

  useEffect(() => {
    const fetchCombo = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'combos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCombo({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching combo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombo();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#F8F9FA] pt-32 flex justify-center items-center font-medium text-gray-500">Cargando combo...</div>;
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pt-32 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Combo no encontrado</h2>
        <Link to="/combos" className="text-black font-semibold hover:underline">Volver a combos</Link>
      </div>
    );
  }

  const images = combo.images && combo.images.length > 0 ? combo.images : [combo.image];

  return (
    <div className="bg-[#F2F2F2] min-h-screen flex flex-col font-sans selection:bg-accent/30 items-center">
      <div className="w-full max-w-md lg:max-w-4xl flex flex-col min-h-screen relative">
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-[100] px-6 py-8 flex justify-between items-center pointer-events-none">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          
          <div className="flex gap-3 pointer-events-auto">
            <button 
              onClick={toggleCart}
              className="w-12 h-12 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl flex items-center justify-center active:scale-90 transition-transform relative"
            >
              <ShoppingBag className="w-6 h-6 text-gray-900" />
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="w-12 h-12 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
              onClick={() => setIsMenuOpen(true)}
            >
              <LayoutGrid className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Full Screen Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[200] bg-white pt-24 px-6"
            >
              <div className="absolute top-8 right-6">
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-900">
                  <X className="h-8 w-8" />
                </button>
              </div>
              <div className="flex flex-col space-y-6 text-xl mt-8">
                <Link to="/" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">Inicio</Link>
                <Link to="/productos" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">Tienda</Link>
                <Link to="/combos" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">Combos</Link>
                <Link to="/kalizen" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">KaliZen</Link>
                <Link to="/nosotros" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">Nosotros</Link>
                <Link to="/faq" className="text-left font-medium text-gray-900 border-b border-gray-100 pb-4">FAQ</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col lg:flex-row pt-24 pb-8 lg:px-8 lg:gap-12 lg:items-center">
          {/* Image Section */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 mb-12 lg:mb-0 w-full">
          <div className="w-full aspect-square max-w-md relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                src={images[currentImageIndex]} 
                alt={combo.name} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl translate-y-[-20px]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          
          {/* Gallery Dots */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {images.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-4 bg-gray-900' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
          )}

          {/* Badges Overlay */}
          <div className="w-full max-w-md grid grid-cols-3 gap-3 mt-12 px-2">
            {[
              { icon: Gift, label: 'Combo' },
              { icon: Leaf, label: 'Natural' },
              { icon: Recycle, label: 'Ecológico' }
            ].map((badge, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 flex flex-col items-center shadow-sm border border-white/20"
              >
                <badge.icon className="w-6 h-6 text-gray-900 mb-2" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Card - Slides up */}
        <motion.div 
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-[3rem] px-6 md:px-8 pt-10 pb-10 shadow-2xl shadow-black/5 mx-4 mb-4 relative lg:w-1/2 flex flex-col h-full lg:max-h-[85vh] lg:overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight pr-4">
              {combo.name}
            </h1>
            <div className="flex flex-col items-end">
              <div className="flex text-accent">
                {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">(12 Reviews)</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Promoción Especial</p>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {combo.description}
          </p>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-full px-4 py-3 flex items-center justify-between border border-white/50 z-50">
            <div className="flex flex-col pl-4">
              {combo.originalPrice && combo.originalPrice > combo.price && (
                <span className="text-[10px] text-gray-400 line-through md:mb-0.5 leading-none">${combo.originalPrice.toLocaleString('es-AR')}</span>
              )}
              <span className="text-xl font-bold text-gray-900 leading-none">${combo.price.toLocaleString('es-AR')}</span>
            </div>

            <div className="flex items-center gap-2 md:gap-4 justify-end">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shrink-0">
                <button 
                  onClick={() => setBaseQuantity(Math.max(1, baseQuantity - 1))}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold text-lg bg-white rounded-full shadow-sm"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-gray-900 text-sm">{baseQuantity}</span>
                <button 
                  onClick={() => setBaseQuantity(baseQuantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold text-lg bg-white rounded-full shadow-sm"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => {
                  addItem({ ...combo, type: 'combo', quantity: baseQuantity });
                  // navigate('/checkout');
                }}
                className="bg-accent hover:bg-accent/90 text-white px-5 md:px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-accent/30 transition-all active:scale-95"
              >
                Agregar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
}
