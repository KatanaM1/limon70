import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="card">
      <div className="card__photo">
        {product.photos[0] ? (
          <img src={product.photos[0]} alt={product.title} />
        ) : (
          <span>👕</span>
        )}
        {discount > 0 && <span className="badge">−{discount}%</span>}
        {!product.inStock && <span className="card__overlay">Нет в наличии</span>}
      </div>
      <div className="card__info">
        <p className="card__title">{product.title}</p>
        <div className="card__price">
          <span className="card__price-main">{product.price} ₽</span>
          {product.oldPrice && (
            <span className="card__price-old">{product.oldPrice} ₽</span>
          )}
        </div>
      </div>
    </Link>
  );
}