import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { X } from 'lucide-react';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSave: () => void;
}

const AVAILABLE_AROMAS = [
  'Adventure', 'Amour', 'Ángel', 'Antitabaco', 'Apolo', 'Apple', 'Bad Man', 'Bamboo', 
  'Beauty', 'Bebé', 'Bella', 'Bergamota y Cedro', 'Black', 'Blue', 'Breeze', 
  'Bubblegum (Chicle)', 'Cereza Malbec', 'Citrus', 'Coco Vai', 'Cony', 'Cristóbal', 
  'Daniel', 'Due', 'Duvet', 'Entre Ríos', 'Erba', 'Etiqueta', 'Fama', 'Faren', 
  'Flores Blancas', 'Flores Silvestres', 'Flowers', 'Fresias y Bergamota', 'Frutilla', 
  'Frutos Patagónicos', 'Ghost', 'Good Woman', 'Green', 'Guaraná', 'Hawai', 
  'Hypnotic Scent', 'Indiana', 'Invicto', 'Invicto Legend', 'Jazmín', 'Lady', 
  'Lavanda', 'Lilas', 'Limón', 'Limón Dulce y Vainilla', 'Linah', 'Lola', 'Lucy', 
  'Magnolia y Fresias', 'Male', 'Man', 'Maracuyá', 'Marino', 'Mery', 'Mix Tropical', 
  'Naranja y Pimienta', 'New York', 'Nina', 'Olympic', 'One Million', 'Opium', 
  'Palace', 'Papaya', 'Patio', 'Paula', 'Peonías y Cedro', 'Pétalos de Orquídeas', 
  'Pink', 'Pistacho Caramel', 'Pitanga', 'Polo', 'Pomelo Rosado', 'Rocío', 'Rosas', 
  'Salvaje', 'Sándalo y Violetas', 'Scandal Fem', 'Scandal Man', 'Teakwood', 'Tokyo', 
  'Tropical', 'Uva', 'Vainilla', 'Verbena', 'Violetas', 'Wanted', 'XS', 'Yourself'
];

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    images: ['', '', ''] as string[],
    category: 'sahumerios',
    aromas: [] as string[],
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<number | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      setUploadLoading(index);
      const file = e.target.files[0];
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setFormData(prev => {
          const newImages = [...prev.images];
          newImages[index] = url;
          return {...prev, images: newImages};
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al subir la imagen");
      } finally {
        setUploadLoading(null);
      }
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        images: product.images || (product.image ? [product.image, '', ''] : ['', '', '']),
        category: product.category,
        aromas: product.aromas || [],
        featured: product.featured || false
      });
    }
  }, [product]);

  const handleAromaToggle = (aroma: string) => {
    setFormData(prev => {
      const newAromas = prev.aromas.includes(aroma)
        ? prev.aromas.filter(a => a !== aroma)
        : [...prev.aromas, aroma];
      return { ...prev, aromas: newAromas };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const validImages = formData.images.filter(url => url.trim() !== '');
    const dataToSave: any = {
      ...formData,
      image: validImages[0] || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
      images: validImages,
      price: Number(formData.price),
      updatedAt: Date.now()
    };

    if (!product) {
      dataToSave.createdAt = Date.now();
    }

    if (formData.originalPrice) {
      dataToSave.originalPrice = Number(formData.originalPrice);
    } else {
      delete dataToSave.originalPrice;
    }

    try {
      if (product) {
        await updateDoc(doc(db, 'products', product.id), dataToSave);
      } else {
        await addDoc(collection(db, 'products'), dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral shrink-0">
          <h2 className="text-xl font-bold text-secondary">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Actual ($)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Anterior ($) - Opcional</label>
              <input 
                type="number" 
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
                placeholder="Para mostrar oferta"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Producto Destacado en Portada</span>
            </label>
            <p className="text-xs text-gray-500 ml-7">Si está marcado, se mostrará en la sección "Productos Destacados" del inicio.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            >
              <option value="sahumerios">Sahumerios</option>
              <option value="perfumes">Perfumes</option>
              <option value="difusores">Difusores</option>
              <option value="aromatizantes">Aromatizantes</option>
              <option value="accesorios">Accesorios</option>
              <option value="artesanal">Artesanal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (hasta 3)</label>
            <div className="space-y-4">
              {formData.images.map((img, index) => (
                <div key={index} className="p-3 border border-neutral rounded-xl bg-gray-50/50 space-y-2">
                  <p className="text-xs font-semibold text-gray-500">Imagen {index + 1}</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    disabled={uploadLoading === index}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50"
                  />
                  {uploadLoading === index && <p className="text-xs text-primary">Subiendo...</p>}
                  <input 
                    type="url" 
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({...formData, images: newImages});
                    }}
                    className="w-full px-3 py-2 border border-neutral rounded-lg text-sm"
                    placeholder="URL de imagen..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Aromas Disponibles ({formData.aromas.length} seleccionados) (Opcional)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, aromas: AVAILABLE_AROMAS})}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Seleccionar todos
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, aromas: []})}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border border-neutral rounded-xl bg-gray-50">
              {AVAILABLE_AROMAS.map(aroma => (
                <label key={aroma} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.aromas.includes(aroma)}
                    onChange={() => handleAromaToggle(aroma)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{aroma}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Si seleccionás aromas, el cliente deberá elegir uno al comprar.</p>
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
