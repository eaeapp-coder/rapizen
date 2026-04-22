import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Package, Gift, FileText, Settings, Sparkles, Image as ImageIcon } from 'lucide-react';
import ProductForm from './ProductForm';
import ComboForm from './ComboForm';
import BlogForm from './BlogForm';
import SettingsForm from './SettingsForm';
import KaliZenForm from './KaliZenForm';
import HeroForm from './HeroForm';

export default function Dashboard() {
  const { isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'products' | 'combos' | 'posts' | 'settings' | 'kalizen' | 'hero'>('products');
  
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isComboFormOpen, setIsComboFormOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [itemToDelete, setItemToDelete] = useState<{id: string, collection: string} | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  const fetchData = async () => {
    try {
      if (activeTab === 'products') {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } else if (activeTab === 'combos') {
        const querySnapshot = await getDocs(collection(db, 'combos'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCombos(data);
      } else {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(sorted);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const handleDeleteClick = (id: string, collectionName: string) => {
    setItemToDelete({ id, collection: collectionName });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, itemToDelete.collection, itemToDelete.id));
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.collection}:`, error);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditCombo = (combo: any) => {
    setEditingCombo(combo);
    setIsComboFormOpen(true);
  };

  const handleAddNewCombo = () => {
    setEditingCombo(null);
    setIsComboFormOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsPostFormOpen(true);
  };

  const handleAddNewPost = () => {
    setEditingPost(null);
    setIsPostFormOpen(true);
  };

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral/30 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Panel de Administración</h1>
          <button 
            onClick={logout}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'products' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'combos' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <Gift className="w-5 h-5 mr-2" />
            Combos
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'posts' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Blog
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'hero' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            Carrusel
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <Settings className="w-5 h-5 mr-2" />
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('kalizen')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'kalizen' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            KaliZen
          </button>
        </div>

        {activeTab === 'settings' ? (
          <SettingsForm />
        ) : activeTab === 'kalizen' ? (
          <KaliZenForm />
        ) : activeTab === 'hero' ? (
          <HeroForm />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral overflow-hidden">
            <div className="p-6 border-b border-neutral flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary">
                {activeTab === 'products' && 'Catálogo de Productos'}
                {activeTab === 'combos' && 'Catálogo de Combos'}
                {activeTab === 'posts' && 'Publicaciones del Blog'}
              </h2>
              <button 
                onClick={
                  activeTab === 'products' ? handleAddNewProduct : 
                  activeTab === 'combos' ? handleAddNewCombo : 
                  handleAddNewPost
                }
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {activeTab === 'products' && 'Nuevo Producto'}
                {activeTab === 'combos' && 'Nuevo Combo'}
                {activeTab === 'posts' && 'Nueva Publicación'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral/30 text-gray-600 text-sm">
                    <th className="p-4 font-medium">Imagen</th>
                    <th className="p-4 font-medium">{activeTab === 'posts' ? 'Título' : 'Nombre'}</th>
                    {activeTab === 'products' && <th className="p-4 font-medium">Categoría</th>}
                    {activeTab === 'posts' && <th className="p-4 font-medium">Fecha</th>}
                    {activeTab !== 'posts' && <th className="p-4 font-medium">Precio</th>}
                    {activeTab !== 'posts' && <th className="p-4 font-medium">Oferta</th>}
                    <th className="p-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'products' ? products : activeTab === 'combos' ? combos : posts).map((item) => (
                    <tr key={item.id} className="border-b border-neutral hover:bg-neutral/10">
                      <td className="p-4">
                        <img src={item.image} alt={item.name || item.title} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      </td>
                      <td className="p-4 font-medium text-secondary">
                        <div className="flex items-center">
                          {item.name || item.title}
                          {activeTab === 'products' && item.featured && (
                            <span title="Producto Destacado en Portada" className="ml-2 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
                              Destacado
                            </span>
                          )}
                        </div>
                      </td>
                      {activeTab === 'products' && <td className="p-4 text-gray-600 capitalize">{item.category}</td>}
                      {activeTab === 'posts' && <td className="p-4 text-gray-600">{new Date(item.date).toLocaleDateString('es-AR')}</td>}
                      {activeTab !== 'posts' && <td className="p-4 text-primary font-bold">${item.price.toLocaleString('es-AR')}</td>}
                      {activeTab !== 'posts' && (
                        <td className="p-4 text-gray-500">
                          {item.originalPrice ? (
                            <span className="line-through text-sm">${item.originalPrice.toLocaleString('es-AR')}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                      )}
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            if (activeTab === 'products') handleEditProduct(item);
                            else if (activeTab === 'combos') handleEditCombo(item);
                            else handleEditPost(item);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-2"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item.id, activeTab)}
                          className="text-red-500 hover:text-red-700 p-2 ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === 'products' ? products : activeTab === 'combos' ? combos : posts).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No hay {activeTab === 'products' ? 'productos' : activeTab === 'combos' ? 'combos' : 'publicaciones'} cargados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isProductFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setIsProductFormOpen(false)} 
          onSave={() => {
            setIsProductFormOpen(false);
            fetchData();
          }} 
        />
      )}

      {isComboFormOpen && (
        <ComboForm 
          combo={editingCombo} 
          onClose={() => setIsComboFormOpen(false)} 
          onSave={() => {
            setIsComboFormOpen(false);
            fetchData();
          }} 
        />
      )}

      {isPostFormOpen && (
        <BlogForm 
          post={editingPost} 
          onClose={() => setIsPostFormOpen(false)} 
          onSave={() => {
            setIsPostFormOpen(false);
            fetchData();
          }} 
        />
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">¿Eliminar elemento?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. El {itemToDelete.collection === 'products' ? 'producto' : itemToDelete.collection === 'combos' ? 'combo' : 'post'} será eliminado permanentemente.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-neutral rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
