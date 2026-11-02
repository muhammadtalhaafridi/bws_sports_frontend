import { ArrowLeft, RefreshCw, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ProductImage } from "../components/ProductImage";
import { EmptyState, PageHeader } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../lib/format";

export function Cart() {
  const { items, total, count, updateQuantity, removeItem } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Quantities are edited here first and saved with "Update cart".
  const [draft, setDraft] = useState<Record<number, string>>({});
  const changed = items.some((i) => draft[i.id] !== undefined && Number(draft[i.id]) !== i.quantity);

  const onUpdate = () => {
    let limited = false;
    for (const item of items) {
      const value = draft[item.id];
      if (value === undefined) continue;
      const qty = Math.max(1, Math.floor(Number(value)) || 1);
      if (qty > item.stock) limited = true;
      updateQuantity(item.id, qty);
    }
    setDraft({});
    if (limited) toast("Some quantities were lowered to the stock available", { icon: "ℹ️" });
    else toast.success("Cart updated");
  };

  const onCheckout = () => {
    if (changed) onUpdate();
    navigate(isLoggedIn ? "/checkout" : "/login?redirect=%2Fcheckout");
  };

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your cart" />
        <div className="container section">
          <EmptyState
            title="Your cart is empty"
            text="Browse our cricket gear and add items to your cart."
            action={
              <Link to="/products" className="btn btn-primary">
                <ShoppingBag size={18} /> Start shopping
              </Link>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your cart" subtitle={`${count} ${count === 1 ? "item" : "items"} in your cart`} />
      <div className="container section cart-layout">
        <div className="card">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/products/${item.id}`} className="cart-item">
                      <ProductImage src={item.image} alt={item.name} className="cart-thumb" />
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.category} · {formatPrice(item.price)} each
                        </small>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <input
                      className="input qty-small"
                      type="number"
                      min={1}
                      max={item.stock}
                      value={draft[item.id] ?? item.quantity}
                      onChange={(e) => setDraft((d) => ({ ...d, [item.id]: e.target.value }))}
                      aria-label={`Quantity for ${item.name}`}
                    />
                  </td>
                  <td className="nowrap">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </td>
                  <td>
                    <button
                      className="btn-link danger"
                      onClick={() => {
                        removeItem(item.id);
                        toast.success(`${item.name} removed`);
                      }}
                    >
                      <Trash2 size={16} /> <span className="hide-sm">Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-actions">
            <Link to="/products" className="btn-link">
              <ArrowLeft size={16} /> Continue shopping
            </Link>
            <button className="btn btn-outline" onClick={onUpdate} disabled={!changed}>
              <RefreshCw size={16} /> Update cart
            </button>
          </div>
        </div>

        <aside className="card summary">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="text-success">Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {changed && <p className="muted small">You have changed quantities. They will be saved when you continue.</p>}
          <button className="btn btn-primary btn-block btn-lg" onClick={onCheckout}>
            Checkout
          </button>
          {!isLoggedIn && <p className="muted small center">You will be asked to log in before checkout.</p>}
        </aside>
      </div>
    </>
  );
}
