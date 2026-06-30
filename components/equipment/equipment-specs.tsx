import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { EquipmentStatus } from '@/types';

interface EquipmentSpecsProps {
  specs: Record<string, string>;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  status: EquipmentStatus;
}

function statusInfo(status: EquipmentStatus): { label: string; variant: 'green' | 'red' | 'muted' } {
  if (status === 'available') return { label: 'Доступна', variant: 'green' };
  if (status === 'rented') return { label: 'Орендовано', variant: 'red' };
  return { label: 'На обслуговуванні', variant: 'muted' };
}

export function EquipmentSpecs({ specs, pricePerDay, pricePerWeek, pricePerMonth, status }: EquipmentSpecsProps) {
  const specEntries = Object.entries(specs);
  const { label, variant } = statusInfo(status);

  return (
    <div className="flex flex-col gap-6">
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-text-muted)]">Статус:</span>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">День</p>
          <p className="text-xl font-bold text-[var(--color-accent)]">{formatPrice(pricePerDay)}</p>
        </div>

        {pricePerWeek ? (
          <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-light,#fff7ed)] p-4 text-center relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Вигідно
            </span>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Тиждень</p>
            <p className="text-xl font-bold text-[var(--color-accent)]">{formatPrice(pricePerWeek)}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2,#f1f5f9)] p-4 text-center opacity-50">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Тиждень</p>
            <p className="text-sm text-[var(--color-text-muted)]">—</p>
          </div>
        )}

        {pricePerMonth ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Місяць</p>
            <p className="text-xl font-bold text-[var(--color-accent)]">{formatPrice(pricePerMonth)}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2,#f1f5f9)] p-4 text-center opacity-50">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Місяць</p>
            <p className="text-sm text-[var(--color-text-muted)]">—</p>
          </div>
        )}
      </div>

      {/* Specs table */}
      {specEntries.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-4 py-3 bg-[var(--color-primary)] text-white">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Технічні характеристики</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {specEntries.map(([key, value], i) => (
                <tr
                  key={key}
                  className={i % 2 === 0 ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-surface-2,#f1f5f9)]'}
                >
                  <td className="px-4 py-3 text-[var(--color-text-muted)] font-medium w-1/2 border-b border-[var(--color-border)]">
                    {key}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)] font-semibold border-b border-[var(--color-border)]">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
