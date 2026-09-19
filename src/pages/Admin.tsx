import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import { isAdmin } from '../lib/telegram';
import type { Product } from '../types';

export default function Admin() {
  const { products, add, update, remove } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin()) {
    return <p className="center">Доступ запрещён 🔒</p>;
  }

  const closeForm = () => { setCreating(false); setEditing(null); setError(null); };

  return (
    <div>
      <div className="admin-header">
        <h2>Товары ({products.length})</h2>
        {!creating && !editing && (
          <button onClick={() => setCreating(true)} className="btn btn--primary btn--sm">
            + Добавить
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: 12, borderRadius: 12, marginBottom: 12, fontSize: 13 }}>
          <b>Ошибка:</b> {error}
        </div>
      )}

      {(creating || editing) && (
        <div className="form-card">
          <h3>{editing ? 'Редактировать' : 'Новый товар'}</h3>
          <ProductForm
            initial={editing ?? undefined}
            onCancel={closeForm}
            onSubmit={async (data) => {
              try {
                setError(null);
                if (editing) await update(editing.id, data);
                else await add(data);
                closeForm();
              } catch (e: any) {
                console.error('SAVE ERROR:', e);
                setError(e?.message ?? String(e));
              }
            }}
          />
        </div>
      )}

      <div className="admin-list">
        {products.map((p) => (
          <div key={p.id} className="admin-row">
            <div className="admin-row__photo">
              {p.photos[0] ? <img src={p.photos[0]} alt="" /> : <span>👔</span>}
            </div>
            <div className="admin-row__info">
              <p className="admin-row__title">{p.title}</p>
              <p className="admin-row__meta">
                {p.price} ₽{!p.inStock && ' · скрыт'}
              </p>
            </div>
            <button onClick={() => setEditing(p)} className="btn btn--ghost btn--sm">✏️</button>
            <button
              onClick={() => { if (confirm(`Удалить «${p.title}»?`)) remove(p.id); }}
              className="btn btn--danger btn--sm"
            >
              🗑
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <p className="center">Пока нет товаров. Нажмите «Добавить».</p>
        )}
      </div>
    </div>
  );
}