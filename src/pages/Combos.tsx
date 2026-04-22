import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Gift } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Combos() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'combos'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCombos(data);
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Nuestros Combos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Diseñamos combos exclusivos para que ahorres y disfrutes de una experiencia aromática completa.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Cargando combos...</div>
        ) : combos.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {combos.map((combo, index) => (
              <motion.div 
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-1 border border-primary/10"
              >
                <div className="bg-white rounded-[1.4rem] p-6 sm:p-8 h-full flex flex-col sm:flex-row gap-6 items-center">
                  <Link to={`/combo/${combo.id}`} className="block shrink-0">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-40 h-40 rounded-2xl object-cover shadow-md transition-transform hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="flex-1 text-center sm:text-left flex flex-col h-full">
                    <Link to={`/combo/${combo.id}`}>
                      <h3 className="font-bold text-2xl mb-2 text-primary hover:text-primary/80 transition-colors">{combo.name}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4 flex-grow">{combo.description}</p>
                    
                    <div className="bg-neutral/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="text-3xl font-bold text-secondary">${combo.price.toLocaleString('es-AR')}</span>
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-gray-400 line-through">Normal: ${combo.originalPrice.toLocaleString('es-AR')}</span>
                          <span className="text-xs font-bold text-accent">Ahorrás ${(combo.originalPrice - combo.price).toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => addItem({ ...combo, type: 'combo' })}
                      className="w-full inline-flex bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors items-center justify-center"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No hay combos disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
}

