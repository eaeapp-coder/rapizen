import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAromas, setSelectedAromas] = useState<Record<string, number>>({});
  const [baseQuantity, setBaseQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          if (data.aromas && data.aromas.length > 0) {
            // Optional: Initialize the first one to 1 if we want, but it's better to let them add.
            // Let's set the first one to 1 so the "Agregar al carrito" works directly if they don't change anything.
            setSelectedAromas({ [data.aromas[0]]: 1 });
          }
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
    navigate('/checkout');
  };

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center items-center">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">Producto no encontrado</h2>
        <Link to="/productos" className="text-primary hover:underline">Volver al catálogo</Link>
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
              className="rounded-2xl overflow-hidden bg-neutral/20"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit uppercase tracking-wider">
                {product.category}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString('es-AR')}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex flex-col">
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-sm font-bold text-accent">
                      Oferta especial
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {product.aromas && product.aromas.length > 0 ? (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elegí tus fragancias y cantidades
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {product.aromas.map((aroma: string) => {
                      const qty = selectedAromas[aroma] || 0;
                      return (
                        <div key={aroma} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${qty > 0 ? 'border-primary bg-primary/5' : 'border-neutral bg-white'}`}>
                          <span className="font-medium text-gray-700">{aroma}</span>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleAromaQuantityChange(aroma, -1)}
                              className={`p-1.5 rounded-lg transition-colors ${qty > 0 ? 'text-primary hover:bg-primary/10' : 'text-gray-300'}`}
                              disabled={qty === 0}
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-6 text-center font-bold text-secondary">{qty}</span>
                            <button 
                              onClick={() => handleAromaQuantityChange(aroma, 1)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
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
              )}

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

              <button 
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-accent/30"
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
