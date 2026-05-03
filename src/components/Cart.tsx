import { X, Plus, Minus, ShoppingBag, Trash2, ArrowLeft, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Cart() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getCartTotal, getDiscountedTotal, appliedPromo, setAppliedPromo } = useCartStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setLoadingPromo(true);
    setPromoError('');
    try {
      const q = query(
        collection(db, 'promos'), 
        where('code', '==', promoCode.toUpperCase().trim()),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setPromoError('Código inválido o expirado');
        return;
      }

      const promoData = querySnapshot.docs[0].data();
      const subtotal = getCartTotal();

      if (promoData.minPurchase && subtotal < promoData.minPurchase) {
        setPromoError(`Compra mínima: $${promoData.minPurchase.toLocaleString('es-AR')}`);
        return;
      }

      setAppliedPromo({
        code: promoData.code,
        discount: promoData.discount,
        type: promoData.type
      });
      setPromoCode('');
    } catch (error) {
      console.error("Error applying promo:", error);
      setPromoError('Error al validar código');
    } finally {
      setLoadingPromo(false);
    }
  };

  const subtotal = getCartTotal();
  const discountedTotal = getDiscountedTotal();
  // We'll use 15000 as a default if settings aren't loaded yet
  const shipping = discountedTotal >= 15000 ? 0 : 2500;
  const bagTotal = discountedTotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-gray-50/95 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <button onClick={toggleCart} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
              <div className="flex items-center font-bold text-gray-900 text-sm tracking-wide uppercase">
                Mi Bolsa
              </div>
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium text-gray-600">Tu bolsa está vacía</p>
                  <p className="text-sm mt-1">Explorá nuestro catálogo para sumar productos.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.selectedAroma || index}`} className="flex gap-4 items-center bg-white p-3 rounded-2xl shadow-sm border border-transparent">
                      <div className="bg-gray-100 rounded-xl p-2 w-20 h-20 flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id, item.selectedAroma)}
                            className="text-gray-400 hover:text-black transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {item.selectedAroma && (
                          <p className="text-xs text-gray-400 mt-0.5">Aroma: {item.selectedAroma}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-gray-900 font-bold text-sm">
                            ${item.price.toLocaleString('es-AR')}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-accent/5 rounded-full px-1 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedAroma)}
                                className="w-6 h-6 flex items-center justify-center text-accent bg-white rounded-full shadow-sm hover:bg-accent/10 transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-6 text-center text-[10px] font-bold text-gray-800">{item.quantity.toString().padStart(2, '0')}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedAroma)}
                                className="w-6 h-6 flex items-center justify-center text-white bg-accent hover:bg-accent/90 rounded-full shadow-md shadow-accent/20 transition-all active:scale-90"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 mt-2">
                {!appliedPromo ? (
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="Cupón de descuento"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError('');
                          }}
                          className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all font-medium"
                        />
                      </div>
                      <button 
                        onClick={handleApplyPromo}
                        disabled={loadingPromo}
                        className="bg-primary hover:bg-primary/90 text-white px-5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        {loadingPromo ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-red-500 ml-1 font-medium">{promoError}</p>}
                  </div>
                ) : (
                  <div className="mb-6 flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center">
                        <Ticket className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-primary tracking-tight">CUPÓN: {appliedPromo.code}</span>
                    </div>
                    <button 
                      onClick={() => setAppliedPromo(null)}
                      className="text-[10px] font-bold text-primary/60 hover:text-primary underline"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                <div className="space-y-2.5 mb-6">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-900 font-bold">${subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-[11px] font-medium text-primary">
                      <span>Descuento</span>
                      <span className="font-bold">
                        -{appliedPromo.type === 'percent' ? `${appliedPromo.discount}%` : `$${appliedPromo.discount.toLocaleString('es-AR')}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-gray-400">Envío</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-accent' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-50">
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Total</span>
                    <span className="text-xl font-black text-primary">${bagTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ir al Pago
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
