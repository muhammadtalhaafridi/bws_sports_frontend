import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { EmptyState, ErrorState, Spinner } from "../components/ui";
import { useCart } from "../hooks/useCart";
import { api, getErrorMessage } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";
import { AxiosError } from "axios";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await api.get<{ product: Product; related: Product[] }>(`/products/${id}`)).data,
    retry: (count, err) => !(err instanceof AxiosError && err.response?.status === 404) && count < 2,
  });

  // Reset the quantity when moving to another product.
  const [lastId, setLastId] = useState(id);
  if (lastId !== id) {
    setLastId(id);
    setQuantity(1);
  }

  if (isLoading) return <Spinner label="Loading product..." />;
  if (isError) {
    const notFound = error instanceof AxiosError && error.response?.status === 404;
    return (
      <div className="container section">
        {notFound ? (
          <EmptyState
            title="Product not found"
            text="It may have been removed."
            action={<Link to="/products" className="btn btn-primary">Browse products</Link>}
          />
        ) : (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        )}
      </div>
    );
  }
  if (!data) return null;

  const { product, related } = data;
  const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
  const available = Math.max(0, product.stock - inCart);
  const qty = Math.min(quantity, Math.max(1, available));

  const onAdd = (goToCart = false) => {
    const added = addItem(product, qty);
    if (added === 0) {
      toast.error(product.stock === 0 ? "This item is out of stock" : "You already have all available stock in your cart");
      return;
    }
    toast.success(`${added} × ${product.name} added to cart`);
    setQuantity(1);
    if (goToCart) navigate("/cart");
  };

  const details = [
    ["Category", product.category.name],
    ["Size", product.size],
    ["Weight", product.weight],
    ["Willow", product.willow],
  ].filter(([, value]) => value) as [string, string][];

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <ChevronRight size={14} />
        <Link to="/products">Products</Link> <ChevronRight size={14} />
        <Link to={`/products?category=${product.categoryId}`}>{product.category.name}</Link> <ChevronRight size={14} />
        <span>{product.name}</span>
      </nav>

      <div className="details-layout">
        <div className="details-image">
          <ProductImage src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <span className="product-card-category">{product.category.name}</span>
          <h1>{product.name}</h1>
          <p className="details-price">{formatPrice(product.price)}</p>

          <ul className="details-list">
            {details.map(([label, value]) => (
              <li key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
            <li>
              <span>Stock</span>
              {product.stock === 0 ? (
                <strong className="text-danger">Out of stock</strong>
              ) : product.stock <= 5 ? (
                <strong className="text-warn">Only {product.stock} left</strong>
              ) : (
                <strong className="text-success">In stock</strong>
              )}
            </li>
          </ul>

          <div className="details-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="add-row">
              <div className="qty-input" aria-label="Quantity">
                <button onClick={() => setQuantity(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Less">
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, available)}
                  value={qty}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  aria-label="Quantity"
                />
                <button onClick={() => setQuantity(qty + 1)} disabled={qty >= available} aria-label="More">
                  <Plus size={16} />
                </button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => onAdd()} disabled={available === 0}>
                <ShoppingCart size={20} /> Add to cart
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onAdd(true)} disabled={available === 0}>
                Buy now
              </button>
            </div>
          )}
          {inCart > 0 && (
            <p className="muted small">
              You have {inCart} in your <Link to="/cart">cart</Link>.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
