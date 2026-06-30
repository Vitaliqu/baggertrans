'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { uploadEquipmentImage } from '@/lib/firebase/storage';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const slotsLeft = maxImages - images.length - uploading.length;

  async function processFiles(files: FileList | File[]) {
    const arr = Array.from(files).slice(0, slotsLeft);
    if (!arr.length) return;

    const valid = arr.filter((f) => {
      if (!ACCEPTED.includes(f.type)) return false;
      if (f.size > MAX_BYTES) return false;
      return true;
    });

    const stubs: UploadingFile[] = valid.map((f) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      progress: 0,
    }));

    setUploading((prev) => [...prev, ...stubs]);

    await Promise.all(
      valid.map(async (file, i) => {
        const id = stubs[i].id;
        try {
          const url = await uploadEquipmentImage(file, (pct) => {
            setUploading((prev) =>
              prev.map((u) => (u.id === id ? { ...u, progress: pct } : u)),
            );
          });
          onChange([...images, url]);
          setUploading((prev) => prev.filter((u) => u.id !== id));
        } catch {
          setUploading((prev) =>
            prev.map((u) => (u.id === id ? { ...u, error: 'Помилка завантаження' } : u)),
          );
        }
      }),
    );
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function dismissError(id: string) {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (slotsLeft > 0) processFiles(e.dataTransfer.files);
    },
    [slotsLeft, images],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const totalCount = images.length + uploading.length;
  const canAdd = totalCount < maxImages;

  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail grid */}
      {(images.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((url, idx) => (
            <div key={url + idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-border)] group bg-[var(--color-surface-2)]">
              <Image
                src={url}
                alt={`Фото ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, 20vw"
                className="object-cover"
              />
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-wider bg-black/50 text-white py-0.5 select-none">
                  Головне
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Видалити фото"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {uploading.map((u) => (
            <div key={u.id} className="relative aspect-square rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col items-center justify-center gap-1 p-2">
              {u.error ? (
                <>
                  <span className="text-[10px] text-red-500 text-center leading-tight">{u.error}</span>
                  <button
                    type="button"
                    onClick={() => dismissError(u.id)}
                    className="text-[10px] text-[var(--color-accent)] hover:underline"
                  >
                    Закрити
                  </button>
                </>
              ) : (
                <>
                  <Loader2 size={16} className="text-[var(--color-accent)] animate-spin" />
                  <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">{u.progress}%</span>
                  <div className="w-full h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-200"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone — hidden when full */}
      {canAdd && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors py-6',
            dragging
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
              : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-2)]',
          )}
        >
          {dragging ? (
            <Upload size={22} className="text-[var(--color-accent)]" />
          ) : (
            <ImagePlus size={22} className="text-[var(--color-text-muted)]" />
          )}
          <p className="text-xs text-[var(--color-text-muted)] text-center leading-relaxed">
            Перетягніть фото або <span className="text-[var(--color-accent)] font-medium">оберіть файл</span>
            <br />
            JPG, PNG, WebP · до 10 МБ · залишилось {slotsLeft} із {maxImages}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            multiple
            className="sr-only"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
