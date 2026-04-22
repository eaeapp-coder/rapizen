import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

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
    <div className="pt-32 pb-20 bg-neutral/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Catálogo Completo</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Explorá nuestros productos seleccionados para armonizar tu hogar.</p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar aromas..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-secondary border border-neutral hover:bg-neutral/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">Cargando catálogo...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-neutral flex flex-col"
              >
                <Link to={`/producto/${product.id}`} className="block h-56 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-sm font-bold text-primary flex flex-col items-end leading-none shadow-sm">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through mb-0.5">
                        ${product.originalPrice.toLocaleString('es-AR')}
                      </span>
                    )}
                    <span>${product.price.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white uppercase tracking-wider">
                    {product.category}
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 text-secondary hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                  <button 
                    onClick={() => addItem({ ...product, type: 'product' })}
                    className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center mt-auto"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('todos');}}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
