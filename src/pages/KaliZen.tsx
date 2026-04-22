import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, Star, Sparkles, Heart, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KaliZen() {
  const [artesanalProducts, setArtesanalProducts] = useState<any[]>([]);
  const [pageData, setPageData] = useState({
    description: "KaliZen es una marca dedicada a la creación artesanal de pulseras de macramé, llamadores de ángeles, porta sahumerios y amuletos con medallas y runas. Cada pieza está hecha a mano con intención, conectando con la energía, la armonía y el misterio que habita en cada momento.",
    gallery: [
      "https://images.unsplash.com/photo-1610709605781-67858c8942b0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1599643478524-fb5244098775?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { name: "María Laura", text: "Compré un llamador de ángeles y es hermoso. Se nota el amor y la dedicación en cada detalle. ¡Súper recomendado!", rating: 5 },
      { name: "Sofía G.", text: "Las pulseras de macramé son preciosas y súper resistentes. Me encanta la energía que transmiten.", rating: 5 },
      { name: "Carolina M.", text: "El porta sahumerios que me hicieron es una obra de arte. Queda perfecto en mi rincón de meditación.", rating: 5 }
    ],
    socials: {
      facebook: '',
      instagram: ''
    }
  });
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const q = query(collection(db, 'products'), where('category', '==', 'artesanal'));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtesanalProducts(products);

        // Fetch page settings
        const docSnap = await getDoc(doc(db, 'settings', 'kalyzen'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPageData({
            description: data.description || pageData.description,
            gallery: data.gallery || pageData.gallery,
            reviews: data.reviews || pageData.reviews,
            socials: data.socials || { facebook: '', instagram: '' }
          });
        }
      } catch (error) {
        console.error("Error fetching KaliZen data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-neutral/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-8 font-serif tracking-tight">
              KaliZen
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light whitespace-pre-line mb-8">
              {pageData.description}
            </p>
            
            {(pageData.socials.facebook || pageData.socials.instagram) && (
              <div className="flex justify-center gap-4 mt-8">
                {pageData.socials.facebook && (
                  <a 
                    href={pageData.socials.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {pageData.socials.instagram && (
                  <a 
                    href={pageData.socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Nuestras Creaciones</h2>
            <p className="text-gray-600">Piezas únicas hechas a mano con amor y dedicación.</p>
          </div>

          {artesanalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {artesanalProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral flex flex-col group"
                >
                  <Link to={`/producto/${product.id}`} className="block relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary">
                      ${product.price.toLocaleString('es-AR')}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="font-bold text-lg mb-2 text-secondary hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
                    <button 
                      onClick={() => addItem({ ...product, type: 'product' })}
                      className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center mt-auto"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-neutral">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Pronto subiremos nuestras nuevas creaciones artesanales.</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Inspiración</h2>
            <p className="text-gray-600">Un vistazo a nuestro proceso y creaciones.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pageData.gallery.map((img, index) => (
              img ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                >
                  <img 
                    src={img} 
                    alt={`Galería ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ) : null
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Lo que dicen de nosotros</h2>
            <p className="text-gray-600">Experiencias de quienes ya tienen su pieza KaliZen.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData.reviews.map((review, index) => (
              review.name && review.text ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-neutral"
                >
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                  <p className="font-bold text-secondary">{review.name}</p>
                </motion.div>
              ) : null
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}