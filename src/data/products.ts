export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'sahumerios' | 'perfumes' | 'difusores' | 'aromatizantes' | 'accesorios';
}

export const products: Product[] = [
  { id: '1', name: 'Sahumerios Saphirus (Caja x6)', description: 'Aromas intensos y duraderos para armonizar tu espacio.', price: 3500, image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=600', category: 'sahumerios' },
  { id: '2', name: 'Perfume Textil Saphirus 250ml', description: 'Ideal para ropa, sillones y cortinas. Fragancia fresca.', price: 4200, image: 'https://images.unsplash.com/photo-1616604426203-518e73399870?auto=format&fit=crop&q=80&w=600', category: 'perfumes' },
  { id: '3', name: 'Difusor Aromático con Varillas', description: 'Aromatización continua y elegante para tu hogar.', price: 5500, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600', category: 'difusores' },
  { id: '4', name: 'Aromatizante en Aerosol Saphirus', description: 'Fragancia instantánea para renovar el aire.', price: 3800, image: 'https://images.unsplash.com/photo-1595535373192-fc8938bc5c76?auto=format&fit=crop&q=80&w=600', category: 'aromatizantes' },
  { id: '5', name: 'Esencia Pura Saphirus 10ml', description: 'Para hornillos y humidificadores. Alta concentración.', price: 2500, image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=600', category: 'aromatizantes' },
  { id: '6', name: 'Sahumerios Tibetanos', description: 'Aromas exóticos para meditación y relax profundo.', price: 4000, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600', category: 'sahumerios' },
  { id: '7', name: 'Porta Sahumerio de Madera', description: 'Artesanía exclusiva de KaliZen. Diseño minimalista.', price: 3000, image: 'https://images.unsplash.com/photo-1616604426203-518e73399870?auto=format&fit=crop&q=80&w=600', category: 'accesorios' },
  { id: '8', name: 'Aromatizante para Auto Saphirus', description: 'Tu vehículo siempre con olor a nuevo.', price: 2800, image: 'https://images.unsplash.com/photo-1595535373192-fc8938bc5c76?auto=format&fit=crop&q=80&w=600', category: 'aromatizantes' },
  { id: '9', name: 'Velas Aromáticas de Soja', description: 'Velas ecológicas de larga duración. Varios aromas.', price: 6500, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600', category: 'accesorios' },
  { id: '10', name: 'Bombitas Defumadoras', description: 'Limpieza energética profunda para tus espacios.', price: 3200, image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=600', category: 'sahumerios' },
  { id: '11', name: 'Perfume Textil Mini 60ml', description: 'Tamaño ideal para llevar en la cartera o mochila.', price: 2000, image: 'https://images.unsplash.com/photo-1616604426203-518e73399870?auto=format&fit=crop&q=80&w=600', category: 'perfumes' },
  { id: '12', name: 'Difusor de Auto', description: 'Pequeño difusor colgante para el espejo retrovisor.', price: 3500, image: 'https://images.unsplash.com/photo-1595535373192-fc8938bc5c76?auto=format&fit=crop&q=80&w=600', category: 'difusores' },
  { id: '13', name: 'Hornillo de Cerámica', description: 'Diseño elegante para usar con esencias puras.', price: 7000, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600', category: 'accesorios' },
  { id: '14', name: 'Aceite Esencial de Lavanda', description: 'Relajante natural, ideal para antes de dormir.', price: 4500, image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=600', category: 'aromatizantes' },
  { id: '15', name: 'Pack x3 Aerosoles Saphirus', description: 'Llevá 3 aerosoles a elección a un precio especial.', price: 10500, image: 'https://images.unsplash.com/photo-1595535373192-fc8938bc5c76?auto=format&fit=crop&q=80&w=600', category: 'aromatizantes' },
];

export const combos = [
  { id: 'c1', name: 'Combo Zen Básico', description: '1 Perfume Textil + 2 Cajas de Sahumerios', price: 10500, originalPrice: 11200, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600' },
  { id: 'c2', name: 'Combo Armonía Total', description: '1 Difusor + 1 Perfume Textil + 1 Aerosol. ¡Envío Gratis!', price: 15000, originalPrice: 16500, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600' },
  { id: 'c3', name: 'Combo Auto Impecable', description: '1 Aromatizante Auto + 1 Difusor Colgante', price: 5800, originalPrice: 6300, image: 'https://images.unsplash.com/photo-1595535373192-fc8938bc5c76?auto=format&fit=crop&q=80&w=600' },
  { id: 'c4', name: 'Combo Meditación', description: '1 Hornillo + 1 Esencia Pura + 1 Caja Sahumerios Tibetanos', price: 12500, originalPrice: 13500, image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?auto=format&fit=crop&q=80&w=600' },
  { id: 'c5', name: 'Combo Hogar Dulce Hogar', description: '3 Aerosoles + 1 Perfume Textil 250ml. ¡Envío Gratis!', price: 15500, originalPrice: 16800, image: 'https://images.unsplash.com/photo-1616604426203-518e73399870?auto=format&fit=crop&q=80&w=600' },
];
