import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Gift, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

export default function ComboDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [baseQuantity, setBaseQuantity] = useState(1);
  const { addItem } = useCartStore();

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
    return <div className="min-h-screen pt-32 flex justify-center items-center">Cargando combo...</div>;
  }

  if (!combo) {
    return (
      <div className="min-h-screen pt-32 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">Combo no encontrado</h2>
        <Link to="/combos" className="text-primary hover:underline">Volver a combos</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-neutral/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex items-center justify-center"
            >
              <img 
                src={combo.image} 
                alt={combo.name} 
                className="w-full max-w-md h-auto object-cover rounded-2xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <div className="inline-flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit uppercase tracking-wider">
                <Gift className="w-4 h-4 mr-2" />
                Combo Especial
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4">
                {combo.name}
              </h1>
              
              <div className="flex items-end gap-4 mb-6">
                <p className="text-4xl font-bold text-primary">
                  ${combo.price.toLocaleString('es-AR')}
                </p>
                <div className="flex flex-col pb-1">
                  <span className="text-lg text-gray-400 line-through">Normal: ${combo.originalPrice.toLocaleString('es-AR')}</span>
                  <span className="text-sm font-bold text-accent">Ahorrás ${(combo.originalPrice - combo.price).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {combo.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Truck className="w-5 h-5 mr-3 text-accent" />
                  <span>Envío en el día (1 a 2 horas)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ShieldCheck className="w-5 h-5 mr-3 text-accent" />
                  <span>Pago contra entrega disponible</span>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4 w-32 border border-neutral p-1 rounded-xl bg-white">
                  <button 
                    onClick={() => setBaseQuantity(Math.max(1, baseQuantity - 1))}
                    className="p-2 text-gray-500 hover:text-primary transition-colors"
                    disabled={baseQuantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-secondary">{baseQuantity}</span>
                  <button 
                    onClick={() => setBaseQuantity(baseQuantity + 1)}
                    className="p-2 text-gray-500 hover:text-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  addItem({ ...combo, type: 'combo', quantity: baseQuantity });
                  navigate('/checkout');
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Agregar al carrito
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
