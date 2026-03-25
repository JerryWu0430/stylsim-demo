import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SimulationProvider } from '@/context/SimulationContext';
import Link from 'next/link';
import Image from 'next/image';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StyleSim - Fashion Demand Simulation',
  description: 'AI-powered fashion demand forecasting for brands',
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav className="flex items-center gap-1 rounded-full bg-zinc-950/90 backdrop-blur-xl px-2 py-2 ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <Link
          href="/"
          className="flex items-center pl-3 pr-4"
        >
          <div className="relative h-6 w-24">
            <Image
              src="/StyleSimLogo.png"
              alt="StyleSim"
              fill
              className="object-contain invert brightness-100"
            />
          </div>
        </Link>

        <div className="h-4 w-px bg-white/20" />

        <Link
          href="/"
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          Upload
        </Link>
        <Link
          href="/simulation"
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          Simulate
        </Link>
        <Link
          href="/results"
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          Results
        </Link>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">
        <SimulationProvider>
          <Header />
          <main className="flex-1 pt-24">{children}</main>
        </SimulationProvider>
      </body>
    </html>
  );
}
