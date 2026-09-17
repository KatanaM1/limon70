import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { tg, haptic } from '../lib/telegram';

const SHOP_USERNAME = 'limon70';

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products } = useProducts();
  const [photoIdx, setPhotoIdx] = useState(0);

  const product = products.find((p) => p.id === id);
  if (!product) return <p className="center">Товар не найден</p>;

  const order = () => {
    haptic('medium');
    const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${product.title} (${product.price} ₽)`);
    const url = `https://t.me/${SHOP_USERNAME}?text=${text}`;
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, '_blank');
  };

  return (
    <div>
      <button onClick={() => nav(-1)} className="back">← Назад</button>

      <div className="gallery">
        {product.photos[photoIdx] ? (
          <img src={product.photos[photoIdx]} alt={product.title} />
        ) : (
          <span>👕</span>
        )}
      </div>

      {product.photos.length > 1 && (
        <div className="thumbs">
          {product.photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              onClick={() => setPhotoIdx(i)}
              className={`thumb ${i === photoIdx ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      <h2 className="product-title">{product.title}</h2>
      <div className="product-price">
        <span className="product-price-main">{product.price} ₽</span>
        {product.oldPrice && (
          <span className="product-price-old">{product.oldPrice} ₽</span>
        )}
      </div>
      <p className="product-desc">{product.description}</p>

      {product.sizes.length > 0 && (
        <>
          <p className="sizes-label">Размеры</p>
          <div className="sizes">
            {product.sizes.map((s) => (
              <span key={s} className="size-pill">{s}</span>
            ))}
          </div>
        </>
      )}

      <button
        onClick={order}
        disabled={!product.inStock}
        className="btn btn--primary mb-4"
      >
        {product.inStock ? 'Заказать в Telegram' : 'Нет в наличии'}
      </button>
    </div>
  );
}