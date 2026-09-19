import { useMemo, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search]);

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red', fontFamily: 'monospace', fontSize: 12 }}>
        <h3>Ошибка загрузки:</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
      </div>
    );
  }

  return (
    <div>
      <input
        className="search"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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