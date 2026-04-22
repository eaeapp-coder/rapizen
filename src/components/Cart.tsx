import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-bold text-secondary">Tu Carrito</h2>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-neutral rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Tu carrito está vacío</p>
                  <p className="text-sm mt-2">Agregá productos para comenzar tu pedido.</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-6 text-primary font-medium hover:underline"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.selectedAroma || index}`} className="flex gap-4 bg-white">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-xl object-cover border border-neutral"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-secondary text-sm line-clamp-2">{item.name}</h3>
                              {item.selectedAroma && (
                                <p className="text-xs text-gray-500 mt-0.5">Aroma: {item.selectedAroma}</p>
                              )}
                            </div>
                            <button 
                              onClick={() => removeItem(item.id, item.selectedAroma)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-primary font-bold mt-1">${item.price.toLocaleString('es-AR')}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-neutral rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedAroma)}
                              className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedAroma)}
                              className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral p-6 bg-neutral/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-secondary">${getCartTotal().toLocaleString('es-AR')}</span>
                </div>
                {getCartTotal() >= 15000 && (
                  <div className="bg-accent/10 text-accent text-sm font-medium px-4 py-2 rounded-lg mb-4 text-center">
                    ¡Tenés envío gratis! 🎉
                  </div>
                )}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary/30"
                >
                  Finalizar Pedido
                </button>
                <button 
                  onClick={() => {
                    toggleCart();
                    navigate('/productos');
                  }}
                  className="w-full mt-3 bg-white border border-neutral hover:bg-neutral/50 text-secondary py-3 rounded-xl font-medium transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
