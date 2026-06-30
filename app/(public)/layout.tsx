import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileCallBar } from '@/components/layout/mobile-call-bar';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main
        className="flex flex-col flex-1 pt-[72px] max-sm:pt-16"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
