import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="pt-32 pb-20 text-center min-h-screen">Cargando...</div>;
  if (!post) return <div className="pt-32 pb-20 text-center min-h-screen">Publicación no encontrada</div>;

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 shadow-lg"
            referrerPolicy="no-referrer"
          />
          
          <div className="flex items-center text-gray-500 mb-4 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(post.date).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="prose prose-lg prose-primary max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
