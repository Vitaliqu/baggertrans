'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Star, Truck } from 'lucide-react';
import { getEquipment, deleteEquipment } from '@/lib/firebase/equipment';
import type { Equipment, EquipmentCategory, EquipmentStatus } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { EquipmentStatusBadge } from '@/components/admin/status-badge';
import { EquipmentForm } from '@/components/admin/equipment-form';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');

  const [editTarget, setEditTarget] = useState<Equipment | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getEquipment();
      setEquipment(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.nameUk.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !categoryFilter || e.category === categoryFilter;
      const matchStatus = !statusFilter || e.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [equipment, search, categoryFilter, statusFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEquipment(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  }

  const fieldClass = 'h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all';

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Техніка</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {equipment.length} одиниць у базі
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="h-11 px-5">
          <Plus size={16} />
          Додати техніку
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук техніки..."
            className={`${fieldClass} pl-9 w-full`}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as EquipmentCategory | '')}
          className={fieldClass}
        >
          <option value="">Всі категорії</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | '')}
          className={fieldClass}
        >
          <option value="">Всі статуси</option>
          <option value="available">Доступна</option>
          <option value="rented">Орендована</option>
          <option value="maintenance">Обслуговування</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-[var(--color-text-muted)] text-sm">
          Нічого не знайдено
        </div>
      ) : (
        <>
          {/* ─── Mobile card list ─── */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm"
              >
                <div className="flex gap-3 mb-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.images[0] ? (
                      <img src={item.images[0]} alt={item.nameUk} className="w-full h-full object-cover" />
                    ) : (
                      <Truck size={22} className="text-[var(--color-text-muted)]" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-[var(--color-text)] text-sm leading-snug line-clamp-2 flex-1">
                        {item.nameUk}
                      </p>
                      {item.featured && (
                        <Star size={14} className="text-yellow-500 shrink-0 mt-0.5" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {CATEGORY_LABELS[item.category]}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <EquipmentStatusBadge status={item.status} />
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {formatPrice(item.pricePerDay)}/день
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTarget(item)}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] active:scale-[0.98] transition-all"
                  >
                    <Pencil size={14} />
                    Редагувати
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex items-center justify-center w-11 h-11 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all shrink-0"
                    aria-label="Видалити"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Desktop table ─── */}
          <div className="hidden sm:block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Техніка
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden md:table-cell">
                      Категорія
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Статус
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden lg:table-cell">
                      Ціна/день
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden lg:table-cell">
                      Featured
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt={item.nameUk} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-[var(--color-text-muted)]">Фото</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-text)] truncate max-w-[160px]">{item.nameUk}</p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[160px]">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                        {CATEGORY_LABELS[item.category]}
                      </td>
                      <td className="px-4 py-3">
                        <EquipmentStatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--color-text)] hidden lg:table-cell">
                        {formatPrice(item.pricePerDay)}
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        {item.featured && <Star size={16} className="text-yellow-500 inline" fill="currentColor" />}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                          >
                            <Pencil size={12} />
                            Редагувати
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Додати техніку</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <EquipmentForm
              onSuccess={async () => {
                setShowAddDialog(false);
                await load();
              }}
              onCancel={() => setShowAddDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редагувати техніку</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            {editTarget && (
              <EquipmentForm
                equipment={editTarget}
                onSuccess={async () => {
                  setEditTarget(null);
                  await load();
                }}
                onCancel={() => setEditTarget(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Видалити техніку?</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 pt-4">
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Ви впевнені, що хочете видалити{' '}
              <span className="font-semibold text-[var(--color-text)]">{deleteTarget?.nameUk}</span>?
              {' '}Цю дію не можна скасувати.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1 h-12">
                Скасувати
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-12 rounded-md bg-[var(--color-destructive)] text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {deleting ? <Spinner size="sm" color="white" /> : null}
                Видалити
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
