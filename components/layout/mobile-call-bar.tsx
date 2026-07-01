'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

export function MobileCallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = () => setVisible(window.scrollY > 240);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-50
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-[var(--color-primary)]/96 backdrop-blur-sm border-t border-white/8 px-4 pt-3 pb-3">
        <a
          href="tel:+420733777999"
          className="flex items-center justify-center gap-2.5 h-13 w-full bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-[15px] uppercase tracking-wide rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_20px_0_rgba(244,184,21,0.4)] active:scale-[0.99]"
        >
          <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
          Зателефонувати
        </a>
      </div>
    </div>
  );
}
