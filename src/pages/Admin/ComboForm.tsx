import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { X } from 'lucide-react';

interface ComboFormProps {
  combo?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ComboForm({ combo, onClose, onSave }: ComboFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (combo) {
      setFormData({
        name: combo.name,
        description: combo.description,
        price: combo.price.toString(),
        originalPrice: combo.originalPrice.toString(),
        image: combo.image
      });
    }
  }, [combo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dataToSave = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice)
    };

    try {
      if (combo) {
        await updateDoc(doc(db, 'combos', combo.id), dataToSave);
      } else {
        await addDoc(collection(db, 'combos'), dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving combo:", error);
      alert("Hubo un error al guardar el combo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral shrink-0">
          <h2 className="text-xl font-bold text-secondary">
            {combo ? 'Editar Combo' : 'Nuevo Combo'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Oferta ($)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Normal ($)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
            <input 
              required
              type="url" 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
              placeholder="https://..."
            />
          </div>
          </div>

          <div className="p-6 border-t border-neutral bg-gray-50 shrink-0 flex justify-end gap-3 mt-auto">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-neutral rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
