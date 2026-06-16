"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const posts = {
  "como-elegir-una-tarjeta-grafica": {
    title: "Cómo elegir la tarjeta gráfica perfecta para tu PC",
    date: "10 Jun 2026", category: "Componentes",
    content: `Elegir la tarjeta gráfica adecuada es una de las decisiones más importantes al armar o actualizar tu PC. Aquí te guiamos paso a paso.

    **1. Define tu presupuesto**
    Las GPUs van desde los $3,000 hasta los $40,000+. Define cuánto estás dispuesto a invertir.

    **2. Resolución y frecuencia**
    Para 1080p, una GPU de gama media es suficiente. Para 1440p o 4K, necesitarás algo más potente.

    **3. Compatibilidad**
    Verifica que tu fuente de poder tenga suficiente wattaje y que la GPU quepa en tu gabinete.

    **4. Marca y modelo**
    NVIDIA y AMD son las principales opciones. Investiga benchmarks actualizados.

    **5. Dónde comprar**
    En InnovaLink tenemos las mejores ofertas en tarjetas gráficas de todas las marcas.`,
    image: "https://placehold.co/800x400/6a060c/dorado?text=GPU+Guide",
  },
  "guia-de-perifericos-gaming": {
    title: "Guía de periféricos gaming: lo que necesitas saber",
    date: "5 Jun 2026", category: "Periféricos",
    content: `Los periféricos adecuados pueden mejorar drásticamente tu experiencia gaming.

    **Teclados:** Mecánicos vs membrana. Los switches Cherry MX, Red, Blue y Brown ofrecen diferentes sensaciones.

    **Mouse:** La precisión del sensor es clave. Busca DPI ajustable y botones programables.

    **Audífonos:** El sonido envolvente 7.1 y la cancelación de ruido marcan la diferencia.

    **Monitores:** Tasa de refresco de al menos 144Hz y tiempo de respuesta de 1ms para gaming competitivo.`,
    image: "https://placehold.co/800x400/6a060c/dorado?text=Perifericos",
  },
  "almacenamiento-ssd-vs-hdd": {
    title: "SSD vs HDD: ¿cuál elegir en 2026?",
    date: "1 Jun 2026", category: "Almacenamiento",
    content: `El almacenamiento es uno de los componentes que más impacto tiene en el rendimiento general.

    **SSD NVMe:** Velocidades de hasta 7,000 MB/s. Ideales para sistema operativo y juegos.

    **SSD SATA:** Más lentos que NVMe pero mucho más rápidos que HDD. Buena relación calidad-precio.

    **HDD:** Mayor capacidad por menor costo. Perfectos para almacenamiento masivo de archivos.

    **Recomendación:** Usa un SSD NVMe para el sistema y juegos, y un HDD para almacenamiento secundario.`,
    image: "https://placehold.co/800x400/6a060c/dorado?text=SSD+vs+HDD",
  },
  "consejos-para-mantener-tu-pc": {
    title: "5 consejos para mantener tu PC en óptimas condiciones",
    date: "28 May 2026", category: "Tips",
    content: `Mantener tu PC en buen estado no requiere ser un experto. Estos consejos te ayudarán:

    **1. Limpieza física regular** - El polvo es el enemigo. Limpia cada 3 meses con aire comprimido.

    **2. Actualiza drivers** - Mantén los controladores de GPU, chipset y red actualizados.

    **3. Desfragmenta (solo HDD)** - Si usas disco duro, desfragmenta cada mes. No hagas esto en SSD.

    **4. Monitorea temperaturas** - Usa HWMonitor o MSI Afterburner para revisar que todo esté en rangos normales.

    **5. Backup regular** - Guarda tus archivos importantes en la nube o en un disco externo.`,
    image: "https://placehold.co/800x400/6a060c/dorado?text=PC+Care",
  },
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = posts[slug];

  if (!post) return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-xl text-gray-500">Post no encontrado</p>
          <a href="/blog" className="text-dorado hover:underline mt-2 inline-block">Volver al blog</a>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <a href="/blog" className="hover:text-dorado">Blog</a>
          <span>•</span>
          <span className="text-dorado">{post.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-6">{post.date}</p>
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-8" />
        <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line text-sm">
          {post.content}
        </div>
      </main>
      <Footer />
    </>
  );
}
