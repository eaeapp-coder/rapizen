import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';

export default function WhatsAppButton() {
  return (
    <a
      href={generateWhatsAppLink("Hola RapiZen, tengo una consulta antes de comprar.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-110 transition-transform flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
