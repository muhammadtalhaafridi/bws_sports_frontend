import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock === 0;

  const onAdd = () => {
    const added = addItem(product, 1);
    if (added > 0) toast.success(`${product.name} added to cart`);
    else toast.error(`You already have all ${product.stock} in your cart`);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <ProductImage src={product.image} alt={product.name} />
        {outOfStock && <span className="badge badge-dark">Out of stock</span>}
        {!outOfStock && product.stock <= 5 && <span className="badge badge-warn">Only {product.stock} left</span>}
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category.name}</span>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button
            className="btn btn-primary btn-icon"
            onClick={onAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            title={outOfStock ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
