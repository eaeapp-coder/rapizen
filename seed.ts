import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const posts = [
  {
    title: "El poder de la Lavanda para conciliar el sueño",
    excerpt: "Descubrí cómo el aroma a lavanda puede ayudarte a relajar la mente y mejorar la calidad de tu descanso nocturno.",
    content: "La lavanda es una de las plantas más utilizadas en aromaterapia debido a sus propiedades calmantes y relajantes. Numerosos estudios han demostrado que inhalar su aroma antes de dormir puede disminuir el ritmo cardíaco y la presión arterial, preparándonos para un sueño profundo y reparador.\n\nPara aprovechar sus beneficios, podés encender un sahumerio de lavanda unos 30 minutos antes de acostarte, o utilizar un difusor con aceites esenciales en tu habitación. También es ideal para acompañar una sesión de meditación o un baño de inmersión relajante.",
    image: "https://images.unsplash.com/photo-1600511553313-057088b3f27f?auto=format&fit=crop&q=80&w=800",
    date: new Date().toISOString()
  },
  {
    title: "Cómo crear un ambiente Zen en tu hogar",
    excerpt: "Transformá tu espacio en un refugio de paz y armonía utilizando aromas, iluminación y elementos naturales.",
    content: "Crear un ambiente Zen en casa no requiere de grandes reformas, sino de pequeños detalles que inviten a la relajación. El primer paso es mantener el orden y la limpieza, ya que un espacio despejado ayuda a tener una mente clara.\n\nLa aromaterapia juega un papel fundamental: aromas como el sándalo, el jazmín o el incienso son perfectos para purificar el ambiente y elevar la energía. Combiná estos aromas con luz cálida o velas, música suave y elementos naturales como plantas o piedras. Dedicá un pequeño rincón de tu casa exclusivamente para relajarte, leer o meditar.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800",
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    title: "Beneficios de los sahumerios artesanales",
    excerpt: "Por qué elegir sahumerios naturales y artesanales hace la diferencia en tu práctica de relajación.",
    content: "A diferencia de los sahumerios industriales, que suelen contener químicos y fragancias sintéticas, los sahumerios artesanales están elaborados con resinas naturales, hierbas, maderas y aceites esenciales puros.\n\nAl encender un sahumerio natural, no solo estás perfumando el ambiente, sino que estás liberando las propiedades terapéuticas de las plantas. El humo es más limpio, el aroma es más sutil y duradero, y no produce dolores de cabeza ni irritación. Además, al elegirlos, estás apoyando el trabajo artesanal y el cuidado del medio ambiente.",
    image: "https://images.unsplash.com/photo-1608994781440-2e0a291f08f8?auto=format&fit=crop&q=80&w=800",
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

async function seed() {
  try {
    for (const post of posts) {
      await addDoc(collection(db, 'posts'), post);
      console.log(`Added post: ${post.title}`);
    }
    
    await setDoc(doc(db, 'settings', 'general'), {
      freeShippingThreshold: 15000,
      deliveryFee: 2500
    });
    console.log("Added default settings");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
