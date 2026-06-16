"use client";

import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { theme } = useStore();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-dark-800 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              src={theme === "light" ? "/Images/innovalink_claro.png" : "/Images/innovalink - Editado.png"}
              alt="InnovaLink"
              className="h-14 w-auto"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Tecnología premium con dropshipping en Venezuela.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/584129580968" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-vino hover:text-[#fff] transition-all duration-300" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-vino hover:text-[#fff] transition-all duration-300" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-vino hover:text-[#fff] transition-all duration-300" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-vino hover:text-[#fff] transition-all duration-300" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              {["Inicio", "Productos", "Ofertas", "Nosotros", "Contacto"].map((link) => (
                <li key={link}>
                  <a href={link === "Inicio" ? "/" : "#"} className="text-sm text-gray-400 hover:text-dorado transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              {["Componentes", "Periféricos", "Almacenamiento", "Redes", "Accesorios", "Audio"].map((cat) => (
                <li key={cat}>
                  <a href="/" className="text-sm text-gray-400 hover:text-dorado transition-colors">{cat}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              {[
                { icon: "fa-envelope", text: "contacto@innovalink.com" },
                { icon: "fa-phone", text: "+58 412-9580968" },
                { icon: "fa-location-dot", text: "Venezuela" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-sm text-gray-400">
                  <i className={`fas ${icon} w-4 mt-0.5 text-dorado`} />
                  {text}
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mb-3 mt-6">Pagos</h4>
            <div className="payment-icons">
              <i className="fab fa-cc-visa" title="Visa" />
              <i className="fab fa-cc-mastercard" title="Mastercard" />
              <i className="fab fa-cc-paypal" title="PayPal" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Zelle</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 InnovaLink. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-dorado transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-dorado transition-colors">Aviso de privacidad</a>
          </div>
          <button onClick={scrollToTop} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-dorado hover:text-black transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
