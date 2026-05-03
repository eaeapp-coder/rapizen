import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Checkout() {
  const { items, getCartTotal, getDiscountedTotal, appliedPromo, clearCart } = useCartStore();
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

  const [debouncedAddress, setDebouncedAddress] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAddress(formData.address);
    }, 1000);

    return () => clearTimeout(handler);
  }, [formData.address]);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center px-4 bg-[#F8F9FA]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu bolsa está vacía</h2>
        <button 
          onClick={() => navigate('/productos')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const discountedSubtotal = getDiscountedTotal();
  const hasFreeShipping = discountedSubtotal >= shippingSettings.freeShippingThreshold;
  const shippingCost = hasFreeShipping ? 0 : shippingSettings.deliveryFee;
  const total = discountedSubtotal + shippingCost;
  const shippingPercent = Math.min((discountedSubtotal / shippingSettings.freeShippingThreshold) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `*NUEVO PEDIDO - RapiZen* 🚲\n\n`;
    message += `*👤 Cliente:* ${formData.name}\n`;
    message += `*📍 Dirección:* ${formData.address}\n`;
    if (formData.reference) message += `*🏠 Referencia:* ${formData.reference}\n`;
    
    const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(formData.address)}`;
    message += `*🗺️ Ubicación:* ${mapsLink}\n\n`;
    
    message += `*💳 Pago:* ${formData.paymentMethod === 'efectivo' ? 'Efectivo (Contra entrega)' : 'Transferencia'}\n\n`;
    
    message += `*📦 Detalle del pedido:*\n`;
    items.forEach(item => {
      const aromaText = item.selectedAroma ? ` (${item.selectedAroma})` : '';
      message += `• ${item.quantity}x ${item.name}${aromaText} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    });
    
    message += `\n*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*Subtotal:* $${subtotal.toLocaleString('es-AR')}\n`;
    if (appliedPromo) {
      const discountAmount = subtotal - discountedSubtotal;
      message += `*Cupon (${appliedPromo.code}):* -$${discountAmount.toLocaleString('es-AR')}\n`;
    }
    message += `*Envío:* ${hasFreeShipping ? 'GRATIS 🎉' : `$${shippingCost.toLocaleString('es-AR')}`}\n`;
    message += `*TOTAL:* $${total.toLocaleString('es-AR')}\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n\n`;
    message += `¡Muchas gracias! 🙏`;

    const link = generateWhatsAppLink(message);
    window.open(link, '_blank');
    clearCart();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-20 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-primary mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm p-6 sm:p-10 border border-gray-100">
              <header className="mb-10">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Finalizar Pedido</h1>
                <p className="text-gray-400 text-sm mt-1">Ingresá tus datos para coordinar el envío por WhatsApp.</p>
              </header>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    Entrega
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-800"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Dirección Exacta</label>
                      <input 
                        required
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-800"
                        placeholder="Av. 9 de Julio 1234, CABA"
                      />
                      {debouncedAddress && (
                        <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-gray-100 h-40 relative">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            title="google-maps"
                          ></iframe>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Referencias (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.reference}
                        onChange={(e) => setFormData({...formData, reference: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-gray-800"
                        placeholder="Piso, departamento o color de casa"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Pago</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: 'efectivo'})}
                      className={`p-4 rounded-2xl border transition-all text-left ${formData.paymentMethod === 'efectivo' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                    >
                      <span className="block font-bold text-gray-900 text-sm">Efectivo</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">Contra entrega</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: 'transferencia'})}
                      className={`p-4 rounded-2xl border transition-all text-left ${formData.paymentMethod === 'transferencia' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                    >
                      <span className="block font-bold text-gray-900 text-sm">Transferencia</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">CBU / Alias</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-[350px] space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-100 h-fit">
              <h2 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Tu Pedido</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-1">
                      <img src={item.image} alt={item.name} className="max-h-full mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-400">Can: {item.quantity} {item.selectedAroma && `· ${item.selectedAroma}`}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-900 font-bold">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 flex items-center">Envío</span>
                  <span className={`font-bold ${hasFreeShipping ? 'text-accent' : 'text-gray-900'}`}>
                    {hasFreeShipping ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>
                
                {!hasFreeShipping && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-primary font-bold">Faltan ${(shippingSettings.freeShippingThreshold - subtotal).toLocaleString('es-AR')} para envío GRATIS</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${shippingPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                  <span className="text-sm font-bold text-gray-900 uppercase">Total</span>
                  <span className="text-xl font-bold text-primary">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full mt-8 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center shadow-lg shadow-[#25D366]/20 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Comprar
              </button>
              
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center active:scale-[0.98]"
              >
                Seguir comprando
              </button>
              
              <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                Al confirmar, se abrirá un chat de WhatsApp con el detalle de tu pedido para coordinar el pago y envío.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
