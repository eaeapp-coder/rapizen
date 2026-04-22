import { motion } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "¿Cuánto demora el envío?",
    answer: "Realizamos las entregas en el día, generalmente dentro de 1 a 2 horas desde que confirmás tu pedido por WhatsApp. Nuestro delivery es en bicicleta, asegurando rapidez y cuidado del medio ambiente."
  },
  {
    question: "¿Cuáles son los métodos de pago?",
    answer: "Podés pagar en efectivo al momento de recibir tu pedido (contra entrega) o mediante transferencia bancaria (Alias/CVU)."
  },
  {
    question: "¿Cuál es el costo de envío?",
    answer: "El costo de envío varía según la zona dentro de Salta Capital. Sin embargo, si tu compra supera los $15.000, ¡el envío es totalmente GRATIS!"
  },
  {
    question: "¿Tienen local físico?",
    answer: "Sí, nos podés encontrar los fines de semana en nuestro punto físico 'KaliZen' ubicado en la Plaza Güemes. Allí también ofrecemos artesanías, porta sahumerios y macramé."
  },
  {
    question: "¿Qué marcas trabajan?",
    answer: "Trabajamos principalmente con la línea de productos Saphirus, garantizando calidad y aromas duraderos para tu hogar."
  },
  {
    question: "¿Cómo realizo un pedido?",
    answer: "Es muy simple: agregá los productos o combos que te gusten al carrito, completá tus datos en el checkout y el sistema te redirigirá a WhatsApp con el detalle de tu pedido para que lo confirmemos."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-20 bg-neutral/30 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-4">Consultas Frecuentes</h1>
          <p className="text-gray-600 text-lg">Resolvemos tus dudas para que tu experiencia sea perfecta.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-neutral overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-secondary text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
