import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { X } from 'lucide-react';

interface BlogFormProps {
  post?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function BlogForm({ post, onClose, onSave }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dataToSave = {
      ...formData,
      date: post ? post.date : new Date().toISOString()
    };

    try {
      if (post) {
        await updateDoc(doc(db, 'posts', post.id), dataToSave);
      } else {
        await addDoc(collection(db, 'posts'), dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Hubo un error al guardar la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-neutral shrink-0">
          <h2 className="text-xl font-bold text-secondary">
            {post ? 'Editar Publicación' : 'Nueva Publicación'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extracto (Resumen corto)</label>
            <textarea 
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea 
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-neutral rounded-xl focus:ring-primary focus:border-primary"
            />
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
