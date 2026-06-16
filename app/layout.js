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
    <html lang="es" className="h-full dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed] antialiased">
        <StoreProvider>
          {children}
          <FloatingButtons />
        </StoreProvider>
      </body>
    </html>
  );
}
