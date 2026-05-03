import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, Star, Heart, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function KaliZen() {
  const navigate = useNavigate();
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

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

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
    <div className="min-h-screen bg-white">
      {/* Redesigned Elegance Hero Section */}
      <section className="relative min-h-screen pt-24 overflow-hidden bg-[#e5e4de] pb-10 flex flex-col justify-between">
        {/* Background Landscape */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/60 z-10 pointer-events-none" />
          <img 
            src="/images/kalizen-bg.svg" 
            alt="Landscape"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Top Row: Title & Abstract Card */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 lg:px-16 pt-10 lg:pt-20 flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
          
          {/* Left Title */}
          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-7xl lg:text-[130px] leading-[0.85] font-serif text-[#2a2626] mb-8 lg:mb-12 tracking-tight"
            >
              KALI<br />ZEN<sup className="text-4xl lg:text-6xl top-[-0.8em] relative">®</sup>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="flex items-center gap-4 text-[#2a2626] text-xl lg:text-2xl mb-10"
            >
              <span className="text-[#2a2626] font-medium tracking-wide">/ Creamos magia a mano /</span>
            </motion.div>
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              onClick={() => {
                const productsSection = document.getElementById('products-section');
                productsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#38322c] text-white px-10 py-4 rounded-full uppercase tracking-[0.2em] text-sm hover:bg-[#1a1715] transition-all shadow-xl"
            >
              Comenzar
            </motion.button>
          </div>

          {/* Right Floating Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full lg:w-[500px]"
          >
            {/* White Info Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[40px] p-8 lg:p-10 shadow-2xl relative z-10 w-full mb-12 lg:mb-0">
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-700">Auténtico</span>
                <span className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-700">Diseño</span>
                <span className="bg-[#38322c] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">Zen</span>
              </div>
              
              <h2 className="text-3xl lg:text-[42px] font-serif text-[#2a2626] mb-4 leading-[1.1] font-medium">
                Diseño único &<br/>ergonomía
              </h2>
              <p className="text-gray-500 mb-10 text-lg">
                Desde los bocetos a la realidad.
              </p>
              
              {/* Spacer for overlapping image on desktop */}
              <div className="h-32 hidden lg:block"></div>
            </div>

            {/* Overlapping Main Image */}
            <div className="lg:absolute lg:-bottom-24 lg:-right-12 lg:w-[115%] w-full z-20 shadow-2xl rounded-[32px] overflow-hidden -mt-16 lg:mt-0 relative group">
              <img 
                src={pageData.gallery[0] || "/images/kalizen-main.svg"} 
                alt="Diseño destacado" 
                className="w-full h-[280px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Small Overlapping Card (Roomtour-like) */}
            <div className="absolute top-[40%] -right-4 lg:-right-16 bg-[#eae7de]/90 backdrop-blur-md rounded-[28px] p-4 shadow-xl z-30 w-36 lg:w-44 flex flex-col items-center border border-white/50">
              <span className="text-[10px] lg:text-xs font-bold tracking-widest uppercase mb-3 text-gray-800">Galería</span>
              <div className="w-full h-20 lg:h-24 rounded-[20px] overflow-hidden mb-2 relative group cursor-pointer">
                <img 
                  src={pageData.gallery[1] || "/images/kalizen-room.svg"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Play Button Simulation */}
              <div className="absolute -left-5 top-[55%] -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-[#a48e7d] rounded-full flex items-center justify-center shadow-lg border-2 border-[#eae7de] cursor-pointer hover:bg-[#8b7668] transition-colors">
                 <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Footer Blocks inside Hero */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-end mt-16 lg:mt-0 gap-8 lg:gap-0 pb-8 px-0 lg:px-0">
          
          {/* Bottom Left Block */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="bg-[#a48e7d]/95 backdrop-blur-md lg:rounded-tr-[50px] lg:rounded-br-[50px] rounded-[30px] lg:rounded-l-none mx-4 lg:mx-0 p-8 lg:p-12 w-auto lg:w-[500px] xl:w-[600px] relative overflow-hidden text-white flex flex-col justify-center min-h-[200px] lg:min-h-[260px] shadow-2xl"
          >
            <h3 className="text-3xl lg:text-4xl font-serif mb-4 relative z-10 w-full lg:w-3/4 leading-tight font-medium text-white/95">
              ¡Utilizamos los mejores materiales!
            </h3>
            <p className="text-white/80 text-sm lg:text-base leading-relaxed relative z-10 w-full lg:w-3/4 font-light">
              {pageData.description}
            </p>
            
            {/* The structural slice image in the block */}
            <div className="absolute -right-10 -bottom-10 lg:-bottom-16 w-40 h-40 lg:w-56 lg:h-56 transform rotate-[-15deg] opacity-60 lg:opacity-100 pointer-events-none">
              <img 
                src={pageData.gallery[2] || "/images/kalizen-materials.svg"} 
                className="w-full h-full object-cover shadow-2xl rounded-2xl border-4 border-[#a48e7d]" 
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Bottom Right Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="flex-1 flex flex-col-reverse sm:flex-row justify-between items-center sm:items-end px-6 lg:px-16 w-full gap-8 lg:gap-0"
          >
            {/* Customers Stat */}
            <div className="flex flex-col items-center">
              <div className="flex -space-x-3 mb-3">
                <img src="https://i.pravatar.cc/100?img=1" className="w-[52px] h-[52px] rounded-full border-[3px] border-[#e5e4de] shadow-md object-cover" alt="Customer"/>
                <img src="https://i.pravatar.cc/100?img=5" className="w-[52px] h-[52px] rounded-full border-[3px] border-[#e5e4de] shadow-md object-cover" alt="Customer"/>
              </div>
              <div className="text-white text-5xl lg:text-6xl font-serif italic mb-1 shrink-0 drop-shadow-md flex items-end font-medium">
                12<span className="text-4xl not-italic tracking-tighter">m+</span>
              </div>
              <div className="text-white/90 text-[11px] lg:text-sm tracking-[0.2em] uppercase font-semibold">
                Clientes
              </div>
            </div>

            {/* Title & Learn More */}
            <div className="text-center sm:text-right max-w-sm sm:max-w-md">
               <h3 className="text-3xl lg:text-[40px] font-serif text-white mb-6 uppercase tracking-wider leading-[1.1] drop-shadow-lg font-medium">
                  PODEMOS COMBINAR NATURALEZA Y CONFORT
               </h3>
               <div className="flex items-center justify-center sm:justify-end gap-6">
                 {pageData.socials.instagram && (
                    <a href={pageData.socials.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors drop-shadow">
                      <Instagram className="w-5 h-5"/>
                    </a>
                 )}
                 {pageData.socials.facebook && (
                    <a href={pageData.socials.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors drop-shadow">
                      <Facebook className="w-5 h-5"/>
                    </a>
                 )}
                 <a href="#about" className="uppercase tracking-[0.2em] text-sm lg:text-sm border-b border-white pb-1 inline-block drop-shadow-md text-white font-medium hover:text-white/80 transition-colors">
                    Saber Más
                 </a>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimalism Products Section */}
      <section id="products-section" className="py-32 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              >
                Colección
                <br />
                Artística
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-gray-500 text-xl font-light"
              >
                Piezas únicas hechas a mano con dedicación.
              </motion.p>
            </div>
            <Link to="/productos" className="flex items-center text-sm font-semibold uppercase tracking-widest text-black/60 hover:text-black transition-colors group">
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {artesanalProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-x-8 gap-y-8 sm:gap-y-16">
              {artesanalProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col"
                >
                  <Link to={`/producto/${product.id}`} className="block relative aspect-[4/5] overflow-hidden mb-3 sm:mb-6 bg-gray-100 rounded-xl sm:rounded-2xl">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </Link>
                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-3 gap-2 sm:gap-4">
                      <Link to={`/producto/${product.id}`} className="block">
                        <h3 className="font-bold text-base sm:text-2xl group-hover:text-primary transition-colors leading-tight tracking-tight line-clamp-2 sm:line-clamp-none">{product.name}</h3>
                      </Link>
                      <span className="font-medium whitespace-nowrap bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        ${product.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-8 flex-grow line-clamp-2 leading-relaxed">{product.description}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.aromas && product.aromas.length > 0) {
                          navigate(`/producto/${product.id}`, { state: { showAromaError: true } });
                        } else {
                          addItem({ ...product, type: 'product' });
                        }
                      }}
                      className="w-full bg-gray-900 hover:bg-black text-white py-2.5 sm:py-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 transform active:scale-95 flex items-center justify-center mt-auto shadow-md hover:shadow-xl"
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                      Lo Quiero
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 text-xl font-light">Pronto revelaremos nuestras nuevas creaciones.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bento Gallery Section */}
      <section className="py-32 bg-neutral/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 text-secondary">Inspiración Divina</h2>
            <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto">Nuestro proceso y las energías que guían el nacimiento de cada amuleto.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {pageData.gallery.map((img, index) => {
              if (!img) return null;
              
              // Create dynamic bento layout classes based on index
              let gridClasses = "relative rounded-3xl overflow-hidden group ";
              if (index === 0) gridClasses += "md:col-span-2 md:row-span-2"; // Large primary
              else if (index === 3) gridClasses += "md:col-span-2 md:row-span-1"; // Wide secondary
              else gridClasses += "md:col-span-1 md:row-span-1"; // Standard squares

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                  className={gridClasses}
                >
                  <img 
                    src={img} 
                    alt={`Galería ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* High-Contrast Reviews Section */}
      <section className="py-32 bg-secondary text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <span className="uppercase tracking-[0.3em] text-xs font-bold mb-6 block text-white/50">Testimonios</span>
           <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-24 text-white">Comunidad KaliZen</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             {pageData.reviews.map((review, index) => (
               review.name && review.text ? (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                   className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors duration-500"
                 >
                   <div className="flex gap-1 mb-8 text-accent">
                     {[...Array(review.rating)].map((_, i) => (
                       <Star key={i} className="w-5 h-5 fill-current" />
                     ))}
                   </div>
                   <p className="text-white/80 mb-10 text-xl font-light leading-relaxed italic">"{review.text}"</p>
                   <div className="flex items-center gap-4 mt-auto">
                     <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                       {review.name.charAt(0)}
                     </div>
                     <p className="font-semibold text-white tracking-wide">{review.name}</p>
                   </div>
                 </motion.div>
               ) : null
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}