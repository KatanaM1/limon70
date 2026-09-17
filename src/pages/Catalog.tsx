import { useMemo, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Все', 'Футболки', 'Штаны', 'Куртки', 'Аксессуары'];

export default function Catalog() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState('Все');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== 'Все' && p.category !== cat) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, cat, search]);

  return (
    <div>
      <input
        className="search"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chips">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`chip ${cat === c ? 'active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="center">Загрузка...</p>
      ) : filtered.length === 0 ? (
        <p className="center">Товары не найдены</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}