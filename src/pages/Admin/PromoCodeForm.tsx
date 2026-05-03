import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, Save } from 'lucide-react';

interface PromoCodeFormProps {
  promo?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function PromoCodeForm({ promo, onClose, onSave }: PromoCodeFormProps) {
  const [formData, setFormData] = useState({
    code: promo?.code || '',
    discount: promo?.discount || 0,
    type: promo?.type || 'percent', // 'percent' or 'fixed'
    active: promo?.active ?? true,
    minPurchase: promo?.minPurchase || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        updatedAt: new Date().toISOString()
      };

      if (promo?.id) {
        await updateDoc(doc(db, 'promos', promo.id), data);
      } else {
        await addDoc(collection(db, 'promos'), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      onSave();
    } catch (error) {
      console.error("Error saving promo code:", error);
      alert("Error al guardar el código promocional");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{promo ? 'Editar Código' : 'Nuevo Código'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Definí los beneficios del cupón</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Código (Ej: BIENVENIDA)</label>
              <input 
                required
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-bold text-gray-900 tracking-wider"
                placeholder="PROMO20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tipo de Descuento</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'percent' | 'fixed'})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-900 font-medium"
                >
                  <option value="percent">Porcentaje (%)</option>
                  <option value="fixed">Monto Fijo ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Valor</label>
                <input 
                  required
                  type="number" 
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-900 font-bold"
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Compra Mínima (Opcional)</label>
              <input 
                type="number" 
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-900 font-medium"
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <input 
                type="checkbox" 
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="active" className="text-sm font-bold text-gray-700 cursor-pointer">Código Activo</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Código
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
