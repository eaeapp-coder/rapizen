import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function HeroStatic() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f0] py-24 sm:py-32 mt-[76px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-[#5A5A40] mb-4">
              Bienvenido a RapiZen
            </h2>
            <h1 className="text-4xl sm:text-6xl font-serif text-[#1a1a1a] mb-8 leading-tight">
              Aromas que transforman<br />tu hogar en un refugio de paz.
            </h1>
            <p className="text-lg text-[#5A5A40] mb-10 max-w-2xl mx-auto leading-relaxed">
              Delivery de aromatización artesanal en bicicleta. 
              Rápido, ecológico y consciente.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/productos" 
                className="bg-[#5A5A40] hover:bg-[#4a4a35] text-white px-8 py-4 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
              >
                Explorar Colección
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
