"use client";

import { useStore } from "@/context/StoreContext";

export default function ChatWidget() {
  const { chatOpen, setChatOpen } = useStore();

  return (
    <>
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-dorado to-dorado-dark text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 active:scale-95">
        {chatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      {chatOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 glass-card overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-vino to-vino-light">
            <p className="text-[#fff] font-semibold text-sm">Soporte InnovaLink</p>
            <p className="text-xs text-[#ffffffb3]">Respondemos en minutos</p>
          </div>
          <div className="p-4 h-64 overflow-y-auto space-y-3 scrollbar-thin">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-dorado flex items-center justify-center text-black text-xs font-bold flex-shrink-0">IL</div>
              <div className="bg-white/10 rounded-xl rounded-tl-none px-3 py-2 max-w-[80%]">
                <p className="text-xs text-[#fff]">¡Hola! ¿En qué podemos ayudarte?</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input type="text" placeholder="Escribe tu mensaje..." className="flex-1 px-3 py-2 rounded-xl bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
            <button className="w-9 h-9 rounded-xl bg-dorado text-black flex items-center justify-center hover:bg-dorado-dark transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
