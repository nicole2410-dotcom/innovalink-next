"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  { q: "¿Cuánto tarda el envío?", a: "El tiempo de entrega es de 3 a 7 días hábiles en toda la República Mexicana, dependiendo de tu ubicación." },
  { q: "¿Cómo puedo rastrear mi pedido?", a: "Una vez enviado tu pedido, recibirás un número de guía por correo electrónico para rastrearlo en la página de la paquetería." },
  { q: "¿Cuál es la política de devoluciones?", a: "Aceptamos devoluciones dentro de los primeros 30 días posteriores a la compra. El producto debe estar en su empaque original y sin señales de uso." },
  { q: "¿Ofrecen garantía en los productos?", a: "Todos nuestros productos cuentan con garantía directa del fabricante. Los tiempos varían según la marca y el tipo de producto." },
  { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard, American Express), transferencia bancaria y pagos en efectivo en tiendas de conveniencia." },
  { q: "¿Cómo puedo contactar a soporte?", a: "Puedes escribirnos a contacto@innovalink.mx, llamarnos al +52 (555) 123-4567, o usar nuestro chat en vivo de lunes a viernes de 9am a 6pm." },
  { q: "¿Hacen envíos internacionales?", a: "Por el momento solo realizamos envíos dentro de la República Mexicana. Pronto estaremos expandiendo nuestros servicios." },
  { q: "¿Puedo cancelar mi pedido?", a: "Sí, puedes cancelar tu pedido siempre que no haya sido enviado aún. Escríbenos a contacto@innovalink.mx para procesar la cancelación." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Preguntas frecuentes</h1>
        <p className="text-gray-400 mb-8">Resolvemos tus dudas</p>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${open === i ? "max-h-40" : "max-h-0"}`}>
                <p className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
