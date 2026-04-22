import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function KaliZenForm() {
  const [formData, setFormData] = useState({
    homeTitle: 'KaliZen',
    homeDescription: '',
    homeImage: '',
    description: '',
    gallery: ['', '', '', ''],
    reviews: [
      { name: '', text: '', rating: 5 },
      { name: '', text: '', rating: 5 },
      { name: '', text: '', rating: 5 }
    ],
    socials: {
      facebook: '',
      instagram: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'kalyzen'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            homeTitle: data.homeTitle || 'KaliZen',
            homeDescription: data.homeDescription || '',
            homeImage: data.homeImage || '',
            description: data.description || '',
            gallery: data.gallery || ['', '', '', ''],
            reviews: data.reviews || [
              { name: '', text: '', rating: 5 },
              { name: '', text: '', rating: 5 },
              { name: '', text: '', rating: 5 }
            ],
            socials: data.socials || { facebook: '', instagram: '' }
          });
        } else {
          // Default values if not exists
          setFormData({
            homeTitle: "KaliZen",
            homeDescription: "Descubrí nuestra línea exclusiva de creaciones artesanales. Pulseras de macramé, llamadores de ángeles, porta sahumerios y amuletos hechos a mano con intención y energía.",
            homeImage: "https://eaeapp.com/imagenes-ia/rapizen/ejemplo-2.jpg",
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
            socials: { facebook: '', instagram: '' }
          });
        }
      } catch (error) {
        console.error("Error fetching KaliZen settings:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'settings', 'kalyzen'), formData);
      setMessage('Configuración de KaliZen guardada correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving KaliZen settings:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleReviewChange = (index: number, field: string, value: string | number) => {
    const newReviews = [...formData.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setFormData({ ...formData, reviews: newReviews });
  };

  if (initialLoading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral overflow-hidden max-w-3xl">
      <div className="p-6 border-b border-neutral">
        <h2 className="text-xl font-bold text-secondary">Página KaliZen</h2>
        <p className="text-gray-600 text-sm mt-1">Editá el contenido de la página interna de KaliZen.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Bloque Portada */}
        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Sección en Portada</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                type="text" 
                value={formData.homeTitle}
                onChange={(e) => setFormData({...formData, homeTitle: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="KaliZen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
              <textarea 
                rows={3}
                value={formData.homeDescription}
                onChange={(e) => setFormData({...formData, homeDescription: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="Descubrí nuestra línea exclusiva..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Circular (URL)</label>
              <input 
                type="url" 
                value={formData.homeImage}
                onChange={(e) => setFormData({...formData, homeImage: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Concepto */}
        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Concepto / Descripción</h3>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            placeholder="KaliZen es una marca dedicada..."
          />
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Redes Sociales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (URL)</label>
              <input 
                type="url" 
                value={formData.socials.facebook}
                onChange={(e) => setFormData({...formData, socials: {...formData.socials, facebook: e.target.value}})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (URL)</label>
              <input 
                type="url" 
                value={formData.socials.instagram}
                onChange={(e) => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Galería */}
        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Galería de Fotos (URLs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.gallery.map((url, index) => (
              <div key={index}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Imagen {index + 1}</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => handleGalleryChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary text-sm"
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Reseñas</h3>
          <div className="space-y-6">
            {formData.reviews.map((review, index) => (
              <div key={index} className="p-4 border border-neutral rounded-xl bg-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-700">Reseña {index + 1}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      value={review.name}
                      onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Puntuación (1-5)</label>
                    <input 
                      type="number" 
                      min="1" max="5"
                      value={review.rating}
                      onChange={(e) => handleReviewChange(index, 'rating', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Comentario</label>
                  <textarea 
                    rows={2}
                    value={review.text}
                    onChange={(e) => handleReviewChange(index, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}