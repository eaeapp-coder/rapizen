import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bike, MessageCircle, MapPin, Clock, CreditCard, Truck, ChevronRight, ShoppingBag, Calendar, Sparkles, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, limit, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { generateWhatsAppLink } from '../utils/whatsapp';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredCombos, setFeaturedCombos] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addItem } = useCartStore();

  const [kalizenData, setKalizenData] = useState({
    homeTitle: "KaliZen",
    homeDescription: "Descubrí nuestra línea exclusiva de creaciones artesanales. Pulseras de macramé, llamadores de ángeles, porta sahumerios y amuletos hechos a mano con intención y energía.",
    homeImage: "https://eaeapp.com/imagenes-ia/rapizen/ejemplo-2.jpg"
  });

  const defaultSlides = [
    { image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=1920', link: '/productos' },
    { image: 'https://images.unsplash.com/photo-1610709605781-67858c8942b0?auto=format&fit=crop&q=80&w=1920', link: '/kalizen' },
    { image: 'https://images.unsplash.com/photo-1599643478524-fb5244098775?auto=format&fit=crop&q=80&w=1920', link: '/combos' }
  ];

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        const allProducts = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort newest first
        allProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        // Filter by featured
        const featured = allProducts.filter(p => p.featured === true);
        
        // If there are featured products, use them. Otherwise, fallback to the latest products (legacy mode).
        if (featured.length > 0) {
          setFeaturedProducts(featured.slice(0, 4));
        } else {
          setFeaturedProducts(allProducts.slice(0, 4));
        }

        const combosQuery = query(collection(db, 'combos'), limit(2));
        const combosSnap = await getDocs(combosQuery);
        setFeaturedCombos(combosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const postsSnap = await getDocs(collection(db, 'posts'));
        const postsData = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedPosts = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLatestPosts(sortedPosts.slice(0, 3));

        const heroSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (heroSnap.exists()) {
          const data = heroSnap.data();
          if (data.slides && data.slides.length > 0) {
            const validSlides = data.slides.filter((s: any) => s.image);
            if (validSlides.length > 0) {
              setHeroSlides(validSlides);
            } else {
              setHeroSlides(defaultSlides);
            }
          } else {
            setHeroSlides(defaultSlides);
          }
        } else {
          setHeroSlides(defaultSlides);
        }

        const kalizenSnap = await getDoc(doc(db, 'settings', 'kalyzen'));
        if (kalizenSnap.exists()) {
          const data = kalizenSnap.data();
          setKalizenData({
            homeTitle: data.homeTitle || "KaliZen",
            homeDescription: data.homeDescription || "Descubrí nuestra línea exclusiva de creaciones artesanales. Pulseras de macramé, llamadores de ángeles, porta sahumerios y amuletos hechos a mano con intención y energía.",
            homeImage: data.homeImage || "https://eaeapp.com/imagenes-ia/rapizen/ejemplo-2.jpg"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleSlideClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  return (
    <>
      {/* Hero Carousel */}
      {heroSlides.length > 0 && (
        <section className="relative w-full h-[180px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden mt-[76px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleSlideClick(heroSlides[currentSlide].link)}
            >
              <img 
                src={heroSlides[currentSlide].image} 
                alt={`Slide ${currentSlide + 1}`} 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </motion.div>
          </AnimatePresence>

          {heroSlides.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-secondary" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-secondary" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Benefits Bar */}
      <section className="bg-primary text-white py-4 md:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="flex flex-col items-center p-2">
              <Clock className="w-6 h-6 md:w-8 md:h-8 mb-2 text-accent" />
              <h3 className="font-semibold text-base md:text-lg mb-0.5">Entrega en el día</h3>
              <p className="text-primary-100 text-xs md:text-sm opacity-80">Recibí tu pedido en 1 a 2 horas</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 mb-2 text-accent" />
              <h3 className="font-semibold text-base md:text-lg mb-0.5">Pago contra entrega</h3>
              <p className="text-primary-100 text-xs md:text-sm opacity-80">Pagá al recibir tu primer pedido</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Truck className="w-6 h-6 md:w-8 md:h-8 mb-2 text-accent" />
              <h3 className="font-semibold text-base md:text-lg mb-0.5">Envío gratis</h3>
              <p className="text-primary-100 text-xs md:text-sm opacity-80">En compras mayores a $15.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/productos" className="relative group overflow-hidden rounded-2xl block">
            <img 
              src="https://eaeapp.com/imagenes-ia/rapizen/seccion_productos.webp" 
              alt="Productos" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
          <Link to="/combos" className="relative group overflow-hidden rounded-2xl block">
            <img 
              src="https://eaeapp.com/imagenes-ia/rapizen/seccion_combos.webp" 
              alt="Combos" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>
      </section>

      {/* 4-Column Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Link key={item} to="/productos" className="relative group overflow-hidden rounded-xl block">
              <img 
                src="https://eaeapp.com/imagenes-ia/rapizen/categorias.webp" 
                alt={`Categoría ${item}`} 
                className="w-full h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-20 bg-neutral/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">Productos Destacados</h2>
              <p className="text-gray-600 max-w-2xl">Elegí tus aromas favoritos y te los llevamos pedaleando.</p>
            </div>
            <Link to="/productos" className="hidden sm:flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
              Ver todos <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-neutral flex flex-col"
              >
                <Link to={`/producto/${product.id}`} className="block h-32 sm:h-48 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-primary flex flex-col items-end leading-none shadow-sm">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through mb-0.5">
                        ${product.originalPrice.toLocaleString('es-AR')}
                      </span>
                    )}
                    <span>${product.price.toLocaleString('es-AR')}</span>
                  </div>
                </Link>
                <div className="p-3 sm:p-5 flex flex-col flex-grow">
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-secondary hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-grow line-clamp-2 sm:line-clamp-3">{product.description}</p>
                  <button 
                    onClick={() => addItem({ ...product, type: 'product' })}
                    className="w-full bg-accent hover:bg-accent/90 text-white py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-base transition-colors flex items-center justify-center mt-auto"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Agregar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/productos" className="inline-flex items-center justify-center w-full bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl font-medium">
              Ver todos los productos <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Combos Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                Ofertas Especiales
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">Combos Zen</h2>
              <p className="text-gray-600 max-w-2xl">Llevá más, pagá menos. Ideales para regalar o renovar toda tu casa.</p>
            </div>
            <Link to="/combos" className="hidden sm:flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
              Ver todos <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-8 max-w-4xl mx-auto">
            {featuredCombos.map((combo) => (
              <motion.div 
                key={combo.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 border border-primary/10"
              >
                <div className="bg-white rounded-[1rem] sm:rounded-[1.4rem] p-3 sm:p-6 h-full flex flex-col sm:flex-row gap-3 sm:gap-6 items-center">
                  <Link to={`/combo/${combo.id}`} className="block shrink-0">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl object-cover shadow-md transition-transform hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="flex-1 text-center sm:text-left flex flex-col items-center sm:items-start h-full">
                    <Link to={`/combo/${combo.id}`}>
                      <h3 className="font-bold text-sm sm:text-xl mb-1 sm:mb-2 text-primary hover:text-primary/80 transition-colors line-clamp-2">{combo.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 hidden sm:block">{combo.description}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-3 mb-2 sm:mb-4 mt-auto">
                      <span className="text-sm sm:text-2xl font-bold text-secondary">${combo.price.toLocaleString('es-AR')}</span>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">${combo.originalPrice.toLocaleString('es-AR')}</span>
                    </div>
                    <button 
                      onClick={() => addItem({ ...combo, type: 'combo' })}
                      className="w-full sm:w-auto inline-flex bg-primary hover:bg-primary/90 text-white px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-base transition-colors items-center justify-center mt-auto"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/combos" className="inline-flex items-center justify-center w-full bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl font-medium">
              Ver todos los combos <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* KaliZen Hero Block */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-neutral">
        <div className="absolute inset-0 bg-[#E8E2D5] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-r from-[#FFC6B7] to-[#FE8D88] rounded-[2rem] p-8 md:p-16 border border-[#E8E2D5] shadow-lg">
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight [text-shadow:0_4px_16px_rgba(254,141,136,1),0_2px_4px_rgba(254,141,136,0.8)]">
                {kalizenData.homeTitle}
              </h2>
              <p className="text-lg md:text-xl text-white mb-10 leading-relaxed font-light">
                {kalizenData.homeDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  to="/kalizen" 
                  className="inline-flex items-center justify-center bg-white hover:bg-white/90 text-[#FE8D88] px-8 py-4 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Ir a KaliZen
                </Link>
                <Link 
                  to="/productos?categoria=artesanal" 
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-medium transition-colors"
                >
                  Ver productos artesanales
                </Link>
              </div>
            </div>

            <div className="flex-shrink-0 relative">
              <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-xl relative z-10">
                <img 
                  src={kalizenData.homeImage} 
                  alt="KaliZen" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -z-0 w-full h-full rounded-full border-2 border-primary/20 scale-110 top-0 left-0 animate-[spin_10s_linear_infinite]"></div>
              <Sparkles className="w-10 h-10 text-primary absolute -top-4 -right-4 z-20 animate-bounce" />
            </div>

          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-neutral/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Novedades
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">Blog RapiZen</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Consejos, novedades y todo sobre el mundo de los aromas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral flex flex-col"
                >
                  <Link to={`/blog/${post.id}`} className="block relative h-48 overflow-hidden shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-400 text-xs mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('es-AR')}
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="font-bold text-xl mb-3 text-secondary hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors mt-auto"
                    >
                      Leer más <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us */}
      <section id="nosotros" className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-accent rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pedaleamos por tu bienestar</h2>
              <p className="text-primary-100 mb-6 text-lg">
                RapiZen nació con la idea de llevar aromas y armonía a los hogares salteños de la forma más rápida y ecológica posible: en bicicleta.
              </p>
              <p className="text-primary-100 mb-8 text-lg">
                Trabajamos con productos de primera calidad (línea Saphirus) y nos aseguramos de que tu pedido llegue en el día, para que no tengas que esperar para disfrutar de tu momento Zen.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-accent mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Visitá nuestro punto físico: KaliZen</h4>
                    <p className="text-primary-100 text-sm">
                      Los fines de semana nos encontrás en Plaza Güemes. Además de nuestros aromas, vas a encontrar hermosas artesanías, porta sahumerios y macramé para complementar tu espacio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800" 
                alt="Bicicleta en la ciudad" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md text-secondary p-4 rounded-xl flex items-center">
                  <Bike className="w-8 h-8 text-primary mr-4" />
                  <div>
                    <p className="font-bold">Cero Emisiones</p>
                    <p className="text-sm text-gray-600">Entregas 100% a pedal en Salta Capital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Hero Section (Moved) */}
      <section id="home" className="pt-20 pb-16 md:pt-24 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Bike className="w-4 h-4 mr-2" />
              Delivery Ecológico en Salta
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mb-6">
              Tu momento Zen, <br/>
              <span className="text-primary">entregado en bicicleta.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Aromatizantes, sahumerios y difusores en la puerta de tu casa en 1 a 2 horas. Relajate, nosotros pedaleamos por vos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/productos"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors flex items-center justify-center shadow-lg shadow-primary/30"
              >
                Ver Catálogo
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
              <a 
                href={generateWhatsAppLink("Hola RapiZen, quiero hacer un pedido.")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-accent text-accent hover:bg-accent/5 px-8 py-4 rounded-full font-medium text-lg transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Pedir por WhatsApp
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=800" 
              alt="Productos de aromatización" 
              className="rounded-[2rem] shadow-xl object-cover h-[400px] md:h-[500px] w-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral/50 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">¿Listo para aromatizar tu espacio?</h2>
          <p className="text-gray-600 text-lg mb-8">Hacé tu pedido ahora y recibilo hoy mismo. Pagás cuando te lo entregamos.</p>
          <a 
            href={generateWhatsAppLink("Hola RapiZen, quiero ver el catálogo completo y hacer un pedido.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-accent/30 items-center"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

