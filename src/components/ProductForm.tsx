import { useState } from 'react';
import { uploadImageToImgBB } from '../lib/imgbb';
import type { Product, ProductInput } from '../types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

type Props = {
  initial?: Product;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
};

export default function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [oldPrice, setOldPrice] = useState<number | ''>(initial?.oldPrice ?? '');
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleUpload = async (files: FileList | null) => {
    console.log('🔥 handleUpload, файлов:', files?.length ?? 0);
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 5)) {
        console.log('📤 Загружаю:', file.name);
        const url = await uploadImageToImgBB(file);
        console.log('✅ Готово:', url);
        urls.push(url);
      }
      setPhotos((p) => [...p, ...urls].slice(0, 5));
    } catch (e) {
      console.error('❌ Ошибка загрузки в ImgBB:', e);
      alert('Не удалось загрузить фото: ' + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        title,
        description,
        price: Number(price),
        oldPrice: oldPrice === '' ? undefined : Number(oldPrice),
        category: 'Костюмы',
        sizes,
        photos,
        inStock,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Название</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="field">
        <label>Описание</label>
        <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="row-2">
        <div className="field">
          <label>Цена</label>
          <input className="input" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>
        <div className="field">
          <label>Старая цена</label>
          <input className="input" type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
      </div>

      <div className="field">
        <label>Размеры</label>
        <div className="sizes">
          {SIZES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleSize(s)}
              className={`size-toggle ${sizes.includes(s) ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Фото (до 5)</label>
        <input type="file" accept="image/*" multiple onChange={(e) => handleUpload(e.target.files)} />
        {uploading && <p className="muted">Загрузка...</p>}
        <div className="photo-list">
          {photos.map((url, i) => (
            <div key={i} className="photo-item">
              <img src={url} alt="" />
              <button type="button" onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}>×</button>
            </div>
          ))}
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        В наличии
      </label>

      <div className="form-actions">
        <button type="submit" disabled={saving} className="btn btn--primary">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn--ghost">
          Отмена
        </button>
      </div>
    </form>
  );
}