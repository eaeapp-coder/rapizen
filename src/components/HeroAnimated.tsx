import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98] // OutExpo
    }
  }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

export default function HeroAnimated() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f0] pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            className="text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-semibold tracking-widest uppercase mb-8 border border-[#5A5A40]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A5A40] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A5A40]"></span>
              </span>
              Nuevo: Delivery en Bicicleta
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#1a1a1a] mb-6 leading-[1.05] tracking-tight"
            >
              Aromas que <br className="hidden sm:block" />
              <span className="italic text-[#5A5A40]">transforman</span> tu hogar.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[#5A5A40] mb-10 max-w-lg leading-relaxed font-light"
            >
              Aromatización artesanal ecológica. Rápido, consciente y directo a tu puerta. Descubre tu fragancia ideal y crea un refugio de paz.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/productos" 
                className="group flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#333] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
              >
                Explorar Colección
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/kalizen" 
                className="flex items-center gap-2 bg-transparent hover:bg-black/5 text-[#1a1a1a] px-8 py-4 rounded-full font-medium transition-colors"
              >
                Nuestra Filosofía
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className="relative h-[450px] sm:h-[600px] lg:h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
            
            <img 
              src="https://www.gesell.gob.ar/image/16715/ARTESANOS%204.jpg" 
              alt="Aromaterapia RapiZen" 
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
            />
            
            {/* Glassmorphism Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-8 left-8 right-8 sm:right-auto sm:left-8 z-20 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/40 max-w-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f0] flex items-center justify-center shrink-0">
                  <span className="text-xl">🌿</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">100% Artesanal</p>
                  <p className="text-xs text-[#5A5A40] mt-0.5">Ingredientes naturales seleccionados para tu bienestar mental y físico.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
