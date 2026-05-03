import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, SlidersHorizontal, Heart } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import ProductImageSlider from '../components/ProductImageSlider';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const categories = ['todos', 'sahumerios', 'perfumes', 'difusores', 'aromatizantes', 'accesorios', 'artesanal'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-20 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-8"></div> {/* Spacer for centering if needed */}
          <h1 className="text-base font-bold text-gray-900">Buscar Producto</h1>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Ej. Sahumerios" 
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-none shadow-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-800 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white p-2 rounded-xl shadow-sm text-gray-800 flex flex-col justify-center items-center w-10">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {/* Categories (Optional, below search) */}
        <div className="flex overflow-x-auto w-full gap-2 mb-6 hide-scrollbar pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                activeCategory === category 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Encontrado<br/>
            {filteredProducts.length} Resultados
          </h2>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">Buscando productos...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[1.5rem] flex flex-col relative shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                <Link to={`/producto/${product.id}`} className="block w-full relative group">
                  <div className="bg-[#F8F9FA] w-full h-56 sm:h-72 flex items-center justify-center overflow-hidden">
                    <ProductImageSlider 
                      images={product.images || [product.image]} 
                      name={product.name} 
                    />
                  </div>
                </Link>
                <div className="p-4 w-full flex flex-col relative">
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 pr-10">{product.name}</h3>
                    <p className="text-gray-400 text-xs line-clamp-1">{product.category}</p>
                  </Link>
                  
                  <div className="w-full flex items-center justify-between mt-4">
                    <span className="font-bold text-gray-900 text-base">${product.price.toLocaleString('es-AR')}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.aromas && product.aromas.length > 0) {
                        navigate(`/producto/${product.id}`, { state: { showAromaError: true } });
                      } else {
                        addItem({ ...product, type: 'product' });
                      }
                    }}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-accent text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                    OFERTA
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 font-medium">No se encontraron productos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
