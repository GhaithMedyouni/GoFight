import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GoFight Admin",
  description: "Espace d'administration GoFight",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/GoFight.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0B0B] text-white`}
      >
        {children}

        {/* Golden blurred background effect */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-yellow-500 opacity-10 blur-[180px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400 opacity-10 blur-[220px]" />
        </div>
      </body>
    </html>
  );
}
