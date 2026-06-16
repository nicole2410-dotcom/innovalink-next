import { StoreProvider } from "@/context/StoreContext";
import FloatingButtons from "@/components/FloatingButtons";
import "./globals.css";

export const metadata = {
  title: "InnovaLink - Tienda de Tecnología",
  description: "Tu tienda de tecnología con los mejores productos y precios. Envíos a toda Venezuela.",
  icons: { icon: "/Images/innovalink - Editado.png" },
  openGraph: { title: "InnovaLink - Tienda de Tecnología", description: "Tu tienda de tecnología con los mejores productos y precios.", type: "website", image: "/Images/innovalink - Editado.png" },
};

export const viewport = { themeColor: "#6a060c" };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("innovalink_theme");if(!t){var m=window.matchMedia("(prefers-color-scheme:light)");t=m.matches?"light":"dark"}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("dark")}})()`
        }} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <StoreProvider>
          {children}
          <FloatingButtons />
        </StoreProvider>
      </body>
    </html>
  );
}
