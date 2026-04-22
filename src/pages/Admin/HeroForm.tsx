import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function HeroForm() {
  const [slides, setSlides] = useState([
    { image: '', link: '' },
    { image: '', link: '' },
    { image: '', link: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.slides && data.slides.length > 0) {
            // Ensure we always have exactly 3 slides for the UI
            const loadedSlides = [...data.slides];
            while (loadedSlides.length < 3) {
              loadedSlides.push({ image: '', link: '' });
            }
            setSlides(loadedSlides.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'settings', 'hero'), { slides });
      setMessage('Carrusel guardado correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving hero settings:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: 'image' | 'link', value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  if (initialLoading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral overflow-hidden max-w-3xl">
      <div className="p-6 border-b border-neutral flex items-center">
        <ImageIcon className="w-6 h-6 text-primary mr-3" />
        <div>
          <h2 className="text-xl font-bold text-secondary">Carrusel Principal (Hero)</h2>
          <p className="text-gray-600 text-sm mt-1">Configurá las 3 imágenes que pasan en la portada.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="space-y-6">
          {slides.map((slide, index) => (
            <div key={index} className="p-5 border border-neutral rounded-xl bg-gray-50">
              <h3 className="font-bold text-secondary mb-4">Imagen {index + 1}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                  <input 
                    type="url" 
                    value={slide.image}
                    onChange={(e) => handleChange(index, 'image', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Recomendado: Imagen horizontal de alta calidad (ej. 1920x1080px).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link de destino (Opcional)</label>
                  <input 
                    type="text" 
                    value={slide.link}
                    onChange={(e) => handleChange(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="/producto/123 o https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">A dónde lleva al hacer click (ej: /productos, /kalizen, /combo/123)</p>
                </div>
                
                {slide.image && (
                  <div className="mt-4 rounded-lg overflow-hidden h-32 relative border border-neutral">
                    <img src={slide.image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Carrusel'}
          </button>
        </div>
      </form>
    </div>
  );
}
