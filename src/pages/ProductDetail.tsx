import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, LayoutGrid, ShoppingBag, Plus, Minus, Star, Leaf, Recycle, Heart, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAromas, setSelectedAromas] = useState<Record<string, number>>({});
  const [baseQuantity, setBaseQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addItem, toggleCart, getCartCount } = useCartStore();
  const cartCount = getCartCount();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAromaQuantityChange = (aroma: string, delta: number) => {
    setSelectedAromas(prev => {
      const current = prev[aroma] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [aroma]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [aroma]: next };
    });
  };

  const handleAddToCart = () => {
    if (product.aromas && product.aromas.length > 0) {
      const selected = Object.entries(selectedAromas);
      if (selected.length === 0) {
        alert("Por favor elegí al menos una fragancia y su cantidad.");
        return;
      }
      selected.forEach(([aroma, qty]) => {
        addItem({ ...product, type: 'product', selectedAroma: aroma, quantity: qty });
      });
    } else {
      addItem({ ...product, type: 'product', quantity: baseQuantity });
    }
    // navigate('/checkout');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8F9FA] pt-32 flex justify-center items-center font-medium text-gray-500">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pt-32 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
        <Link to="/productos" className="text-black font-semibold hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

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
                alt={product.name} 
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
              { icon: Leaf, label: 'Natural' },
              { icon: Recycle, label: 'Ecológico' },
              { icon: Heart, label: 'Artesanal' }
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
              {product.name}
            </h1>
            <div className="flex flex-col items-end">
              <div className="flex text-accent">
                {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">(132 Reviews)</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Categoría: {product.category}</p>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {product.aromas && product.aromas.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Fragancias disponibles:</p>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {product.aromas.map((aroma: string) => {
                  const qty = selectedAromas[aroma] || 0;
                  return (
                    <div key={aroma} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${qty > 0 ? 'border-accent bg-accent/5' : 'border-gray-100 bg-gray-50/50'}`}>
                      <span className="font-bold text-gray-700 text-sm">{aroma}</span>
                      <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-sm px-2">
                        <button 
                          onClick={() => handleAromaQuantityChange(aroma, -1)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors font-bold ${qty > 0 ? 'text-gray-900' : 'text-gray-300'}`}
                          disabled={qty === 0}
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-gray-900 text-xs">{qty}</span>
                        <button 
                          onClick={() => handleAromaQuantityChange(aroma, 1)}
                          className="w-6 h-6 rounded-full text-accent flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">${product.price.toLocaleString('es-AR')}</span>
            </div>

            <div className="flex flex-1 items-center gap-2 md:gap-4 justify-end">
              {(!product.aromas || product.aromas.length === 0) && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-100 shrink-0">
                  <button 
                    onClick={() => setBaseQuantity(Math.max(1, baseQuantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 font-bold text-xl bg-white rounded-full shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-gray-900 text-sm">{baseQuantity}</span>
                  <button 
                    onClick={() => setBaseQuantity(baseQuantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 font-bold text-xl bg-white rounded-full shadow-sm"
                  >
                    +
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleAddToCart}
                className="bg-accent hover:bg-accent/90 text-white px-8 md:px-10 py-4 rounded-[2rem] font-bold text-sm shadow-lg shadow-accent/20 transition-all active:scale-95 flex-1 max-w-[200px]"
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
