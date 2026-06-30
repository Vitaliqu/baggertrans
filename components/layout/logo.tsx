import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import logo from "../../public/images/logo.jpg"
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: 28, text: 'text-base', sub: 'text-[9px]' },
  md: { img: 36, text: 'text-xl',   sub: 'text-[10px]' },
  lg: { img: 56, text: 'text-3xl',  sub: 'text-xs' },
};

function LogoContent({ size = 'md' }: { size?: LogoProps['size'] }) {
  const s = sizes[size ?? 'md'];
  return (
    <span className="flex items-center gap-2.5">
      {/* white pill keeps the JPG readable on any background */}
      <Image width={48} height={48} alt="Logo" src={logo} className="rounded object-contain" />

      <span className="flex flex-col leading-none">
        <span className={cn('font-black tracking-tight', s.text)}>
          <span style={{ color: '#F5C300' }}>BAGGER</span>
          <span className="text-slate-400">TRANS</span>
        </span>
        <span className={cn('font-medium tracking-[0.16em] uppercase text-slate-500 mt-0.5', s.sub)}>
          Оренда техніки
        </span>
      </span>
    </span>
  );
}

export function Logo({ size = 'md', asLink = true, className }: LogoProps) {
  if (!asLink) {
    return (
      <span className={className}>
        <LogoContent size={size} />
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Baggertrans — на головну"
      className={cn(
        'inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded',
        className,
      )}
    >
      <LogoContent size={size} />
    </Link>
  );
}
