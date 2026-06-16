"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const posts = [
  { slug: "como-elegir-una-tarjeta-grafica", title: "Cómo elegir la tarjeta gráfica perfecta para tu PC", excerpt: "Guía completa para seleccionar la GPU ideal según tu presupuesto y necesidades.", date: "10 Jun 2026", image: "https://placehold.co/600x400/6a060c/dorado?text=GPU", category: "Componentes" },
  { slug: "guia-de-perifericos-gaming", title: "Guía de periféricos gaming: lo que necesitas saber", excerpt: "Teclados, mouse, audífonos y más. Todo lo que necesitas para tu setup gamer.", date: "5 Jun 2026", image: "https://placehold.co/600x400/6a060c/dorado?text=Gaming", category: "Periféricos" },
  { slug: "almacenamiento-ssd-vs-hdd", title: "SSD vs HDD: ¿cuál elegir en 2026?", excerpt: "Comparativa completa entre discos de estado sólido y discos duros tradicionales.", date: "1 Jun 2026", image: "https://placehold.co/600x400/6a060c/dorado?text=SSD", category: "Almacenamiento" },
  { slug: "consejos-para-mantener-tu-pc", title: "5 consejos para mantener tu PC en óptimas condiciones", excerpt: "Mantenimiento básico para alargar la vida útil de tu computadora.", date: "28 May 2026", image: "https://placehold.co/600x400/6a060c/dorado?text=PC+Care", category: "Tips" },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
        <p classname="text-gray-400 mb-8">Consejos, guías y novedades del mundo tech</p>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="glass-card overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-dorado">{post.category}</span>
                  <span className="text-[10px] text-gray-500">•</span>
                  <span className="text-[10px] text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-dorado transition-colors">{post.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
