'use client';

import { useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { createEquipment } from '@/lib/firebase/equipment';
import { SEED_EQUIPMENT } from '@/lib/seed-data';
import { AlertTriangle, CheckCircle, Loader2, Database, Trash2 } from 'lucide-react';

type Phase = 'idle' | 'clearing' | 'running' | 'done' | 'error';

export default function SeedPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentName, setCurrentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [addedCount, setAddedCount] = useState(0);

  async function deleteAll() {
    const snap = await getDocs(collection(db, 'equipment'));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'equipment', d.id));
    }
    return snap.size;
  }

  async function runSeed(withClear: boolean) {
    setPhase(withClear ? 'clearing' : 'running');
    setProgress(0);
    setTotal(SEED_EQUIPMENT.length);
    setAddedCount(0);

    try {
      if (withClear) {
        setCurrentName('Видалення старих записів...');
        await deleteAll();
        setPhase('running');
      }

      let added = 0;
      for (let i = 0; i < SEED_EQUIPMENT.length; i++) {
        const item = SEED_EQUIPMENT[i];
        setCurrentName(item.nameUk);
        await createEquipment(item);
        added++;
        setProgress(i + 1);
        setAddedCount(added);
        await new Promise((r) => setTimeout(r, 120));
      }
      setPhase('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }

  const seedTotal = SEED_EQUIPMENT.length;
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  const isRunning = phase === 'clearing' || phase === 'running';

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database size={22} className="text-[var(--color-accent)]" />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Заповнення каталогу</h1>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">
          Буде додано {seedTotal} одиниць техніки до бази Firestore.
        </p>
      </div>

      {/* Preview list */}
      {phase === 'idle' && (
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden mb-6">
          <div className="bg-[var(--color-surface-2)] px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
              Перелік техніки ({seedTotal} позицій)
            </p>
          </div>
          <ul className="divide-y divide-[var(--color-border)] max-h-72 overflow-y-auto">
            {SEED_EQUIPMENT.map((item, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-[var(--color-text)] font-medium truncate pr-4">{item.nameUk}</span>
                <span className="text-[var(--color-text-muted)] shrink-0 tabular-nums">
                  {item.pricePerDay.toLocaleString('uk-UA')} ₴/день
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress */}
      {isRunning && (
        <div className="border border-[var(--color-border)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 size={18} className="text-[var(--color-accent)] animate-spin shrink-0" />
            <p className="text-sm font-medium text-[var(--color-text)]">
              {phase === 'clearing'
                ? 'Видалення старих записів...'
                : `Додаємо ${progress} / ${total}`}
            </p>
          </div>
          {phase === 'running' && (
            <>
              <div className="w-full bg-[var(--color-surface-2)] rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{currentName}</p>
            </>
          )}
        </div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 mb-6 flex items-start gap-4">
          <CheckCircle size={22} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 mb-1">
              Успішно додано {addedCount} одиниць техніки
            </p>
            <div className="flex gap-4 mt-3">
              <a href="/catalog" className="text-sm underline underline-offset-2 text-green-700 font-medium">
                Відкрити каталог
              </a>
              <a href="/admin/equipment" className="text-sm underline underline-offset-2 text-green-700 font-medium">
                Адмін-панель
              </a>
              <a href="/booking" className="text-sm underline underline-offset-2 text-green-700 font-medium">
                Бронювання
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-6 mb-6 flex items-start gap-4">
          <AlertTriangle size={22} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 mb-1">
              Помилка ({addedCount}/{seedTotal} додано)
            </p>
            <p className="text-sm text-red-700 font-mono break-all">{errorMsg}</p>
            <p className="text-xs text-red-600 mt-2">
              Перевірте Firebase credentials у .env.local та правила Firestore (write: admin).
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isRunning && phase !== 'done' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => runSeed(false)}
            className="inline-flex items-center gap-2 px-6 h-11 text-sm font-semibold rounded-lg text-[var(--color-primary)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-all shadow-[0_2px_12px_0_rgba(244,184,21,0.35)]"
          >
            <Database size={16} />
            Додати {seedTotal} позицій
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Видалити ВСЮ існуючу техніку і залити нові дані?')) {
                runSeed(true);
              }
            }}
            className="inline-flex items-center gap-2 px-6 h-11 text-sm font-semibold rounded-lg border-2 border-[var(--color-destructive)] text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/5 transition-all"
          >
            <Trash2 size={16} />
            Очистити і перезаписати
          </button>
        </div>
      )}

      {phase === 'done' && (
        <button
          type="button"
          onClick={() => setPhase('idle')}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] underline underline-offset-2 transition-colors"
        >
          Запустити знову
        </button>
      )}
    </div>
  );
}
