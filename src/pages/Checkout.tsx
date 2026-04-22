import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [shippingSettings, setShippingSettings] = useState({ freeShippingThreshold: 15000, deliveryFee: 2500 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          setShippingSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    reference: '',
    paymentMethod: 'efectivo'
  });

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-secondary mb-4">Tu carrito está vacío</h2>
        <button 
          onClick={() => navigate('/productos')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const hasFreeShipping = subtotal >= shippingSettings.freeShippingThreshold;
  const shippingCost = hasFreeShipping ? 0 : shippingSettings.deliveryFee;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `*NUEVO PEDIDO - RapiZen* 🚲\n\n`;
    message += `*Cliente:* ${formData.name}\n`;
    message += `*Dirección:* ${formData.address}\n`;
    if (formData.reference) message += `*Referencia:* ${formData.reference}\n`;
    message += `*Pago:* ${formData.paymentMethod === 'efectivo' ? 'Efectivo (Contra entrega)' : 'Transferencia'}\n\n`;
    
    message += `*Detalle del pedido:*\n`;
    items.forEach(item => {
      const aromaText = item.selectedAroma ? ` (Aroma: ${item.selectedAroma})` : '';
      message += `- ${item.quantity}x ${item.name}${aromaText} ($${(item.price * item.quantity).toLocaleString('es-AR')})\n`;
    });
    
    message += `\n*Subtotal:* $${subtotal.toLocaleString('es-AR')}\n`;
    message += `*Envío:* ${hasFreeShipping ? 'GRATIS 🎉' : `$${shippingCost.toLocaleString('es-AR')}`}\n`;
    message += `*TOTAL:* $${total.toLocaleString('es-AR')}\n\n`;
    message += `¡Muchas gracias!`;

    const link = generateWhatsAppLink(message);
    window.open(link, '_blank');
    clearCart();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-20 bg-neutral/30 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-neutral bg-primary/5">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Finalizar Pedido</h1>
            <p className="text-gray-600 mt-2">Completá tus datos para coordinar la entrega.</p>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-xl font-bold text-secondary mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Datos de Entrega
              </h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                  <input 
                    required
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ej: Av. Belgrano 1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referencia (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ej: Casa rejas negras, timbre 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'efectivo' ? 'border-primary bg-primary/5' : 'border-neutral hover:bg-neutral/50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="efectivo" 
                        checked={formData.paymentMethod === 'efectivo'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <span className="block font-medium text-secondary text-center">Efectivo</span>
                      <span className="block text-xs text-gray-500 text-center mt-1">Contra entrega</span>
                    </label>
                    <label className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'transferencia' ? 'border-primary bg-primary/5' : 'border-neutral hover:bg-neutral/50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="transferencia" 
                        checked={formData.paymentMethod === 'transferencia'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <span className="block font-medium text-secondary text-center">Transferencia</span>
                      <span className="block text-xs text-gray-500 text-center mt-1">Alias / CVU</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div className="bg-neutral/30 rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-bold text-secondary mb-6">Resumen</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      {item.selectedAroma && (
                        <span className="text-xs text-gray-400 ml-4">Aroma: {item.selectedAroma}</span>
                      )}
                    </div>
                    <span className="font-medium text-secondary">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-neutral pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-secondary">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Truck className="w-4 h-4 mr-1" /> Envío
                  </span>
                  <span className={`font-medium ${hasFreeShipping ? 'text-accent' : 'text-secondary'}`}>
                    {hasFreeShipping ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-neutral mt-4">
                  <span className="text-lg font-bold text-secondary">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full mt-8 bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-accent/30"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Pedido
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                Serás redirigido a WhatsApp para confirmar tu pedido con nosotros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
