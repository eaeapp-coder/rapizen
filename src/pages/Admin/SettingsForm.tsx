import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save } from 'lucide-react';

export default function SettingsForm() {
  const [formData, setFormData] = useState({
    freeShippingThreshold: '',
    deliveryFee: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            freeShippingThreshold: data.freeShippingThreshold.toString(),
            deliveryFee: data.deliveryFee.toString()
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
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
      await setDoc(doc(db, 'settings', 'general'), {
        freeShippingThreshold: Number(formData.freeShippingThreshold),
        deliveryFee: Number(formData.deliveryFee)
      });
      setMessage('Configuración guardada correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral overflow-hidden max-w-2xl">
      <div className="p-6 border-b border-neutral">
        <h2 className="text-xl font-bold text-secondary">Configuración de Envíos</h2>
        <p className="text-gray-600 text-sm mt-1">Ajustá los montos para el delivery y envío gratis.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto para Envío Gratis ($)</label>
            <input 
              required
              type="number" 
              min="0"
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData({...formData, freeShippingThreshold: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
              placeholder="Ej: 15000"
            />
            <p className="text-xs text-gray-500 mt-1">Si la compra supera este monto, el envío es gratis.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo de Delivery ($)</label>
            <input 
              required
              type="number" 
              min="0"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
              placeholder="Ej: 2500"
            />
            <p className="text-xs text-gray-500 mt-1">Costo de envío si no supera el mínimo.</p>
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
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
