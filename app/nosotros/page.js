"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Nosotros</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Nuestra historia</h2>
            <p>InnovaLink nació en 2020 con la misión de democratizar el acceso a la tecnología de calidad en México. Lo que empezó como una pequeña tienda en línea, hoy es un referente en la venta de componentes, periféricos y accesorios tecnológicos.</p>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Misión</h2>
            <p>Ofrecer productos tecnológicos de alta calidad a precios competitivos, con un servicio al cliente excepcional y entregas rápidas en todo México.</p>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Visión</h2>
            <p>Ser la tienda de tecnología más confiable y querida de México, reconocida por nuestra calidad, servicio y compromiso con la innovación.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { number: "5000+", label: "Productos vendidos" },
              { number: "2000+", label: "Clientes satisfechos" },
              { number: "48hrs", label: "Tiempo promedio de entrega" },
            ].map(({ number, label }) => (
              <div key={label} className="glass-card p-6 text-center">
                <p className="text-2xl font-bold text-dorado">{number}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
