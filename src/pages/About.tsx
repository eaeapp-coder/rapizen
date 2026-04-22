import { motion } from 'motion/react';
import { Bike, MapPin, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">Nuestra Historia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            RapiZen nació con la misión de llevar bienestar y armonía a los hogares salteños, combinando la calidad de los mejores aromas con un compromiso real por el medio ambiente.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800" 
              alt="Bicicleta en la ciudad" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-md text-secondary p-6 rounded-2xl flex items-center">
                <Bike className="w-10 h-10 text-primary mr-4" />
                <div>
                  <p className="font-bold text-lg">Cero Emisiones</p>
                  <p className="text-gray-600">Entregas 100% a pedal en Salta Capital</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                Sustentabilidad
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">Pedaleamos por tu bienestar</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Creemos que el cuidado personal y del hogar no debe estar reñido con el cuidado del planeta. Por eso, elegimos la bicicleta como nuestro único medio de transporte para las entregas. 
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-secondary mb-3">Calidad Garantizada</h3>
              <p className="text-gray-600 leading-relaxed">
                Trabajamos exclusivamente con productos de primera calidad, destacando la línea Saphirus. Nos aseguramos de que cada sahumerio, difusor o aromatizante que llega a tus manos cumpla con los más altos estándares.
              </p>
            </div>
          </motion.div>
        </div>

        {/* KaliZen Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-neutral/30 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent rounded-full opacity-5 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <Heart className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">Conocé KaliZen</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              RapiZen es la evolución digital de nuestro emprendimiento físico. Si preferís elegir tus aromas en persona o buscar complementos únicos, te invitamos a visitarnos.
            </p>
            
            <div className="bg-white rounded-2xl p-6 inline-flex flex-col sm:flex-row items-center gap-4 text-left shadow-sm border border-neutral">
              <div className="bg-primary/10 p-4 rounded-full">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-lg">Plaza Güemes, Salta</h4>
                <p className="text-gray-600">Todos los fines de semana</p>
                <p className="text-sm text-gray-500 mt-1">Aromas, artesanías, porta sahumerios y macramé.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
