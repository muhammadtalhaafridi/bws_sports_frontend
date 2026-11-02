import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ProductImage } from "../components/ProductImage";
import { FieldError, PageHeader } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { api, getErrorMessage } from "../lib/api";
import { formatPrice } from "../lib/format";
import { phoneField } from "../lib/schemas";
import type { Order } from "../lib/types";

const schema = z.object({
  phone: phoneField,
  address: z.string().trim().min(5, "Please enter your full delivery address"),
  description: z.string().trim().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

export function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Set once the order is placed so the emptied cart does not bounce us back to /cart.
  const [placed, setPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: user?.phone ?? "", address: user?.address ?? "", description: "" },
  });

  const placeOrder = useMutation({
    mutationFn: async (values: FormValues) =>
      (
        await api.post<{ order: Order }>("/orders", {
          ...values,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        })
      ).data.order,
    onSuccess: (order) => {
      setPlaced(true);
      clear();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      navigate(`/orders/${order.id}?placed=1`, { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not place your order")),
  });

  if (items.length === 0 && !placed) return <Navigate to="/cart" replace />;

  return (
    <>
      <PageHeader title="Checkout" subtitle="Check your details and place your order" />
      <div className="container section checkout-layout">
        <form className="card form" onSubmit={handleSubmit((v) => placeOrder.mutate(v))} noValidate>
          <h3>Delivery details</h3>

          <div className="account-box">
            <div>
              <small>Name</small>
              <strong>{user?.name}</strong>
            </div>
            <div>
              <small>Email</small>
              <strong>{user?.email}</strong>
            </div>
          </div>
          <p className="muted small">Name and email come from your account.</p>

          <label className="field">
            <span>Phone</span>
            <input className="input" type="tel" placeholder="+92 300 1234567" {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </label>

          <label className="field">
            <span>Address</span>
            <textarea className="input" rows={3} placeholder="House, street, area, city" {...register("address")} />
            <FieldError message={errors.address?.message} />
          </label>

          <label className="field">
            <span>
              Description <em className="muted">(optional)</em>
            </span>
            <textarea
              className="input"
              rows={3}
              placeholder="Delivery notes, e.g. call before coming"
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </label>

          <div className="payment-box">
            <strong>Payment method</strong>
            <label className="radio">
              <input type="radio" checked readOnly /> Cash on delivery
            </label>
          </div>

          <button className="btn btn-primary btn-lg btn-block" disabled={placeOrder.isPending}>
            <Lock size={18} /> {placeOrder.isPending ? "Placing order..." : `Place order · ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="card summary">
          <h3>Order summary</h3>
          <ul className="summary-items">
            {items.map((i) => (
              <li key={i.id}>
                <ProductImage src={i.image} alt={i.name} className="summary-thumb" />
                <span>
                  <strong>{i.name}</strong>
                  <small>
                    {i.quantity} × {formatPrice(i.price)}
                  </small>
                </span>
                <strong>{formatPrice(i.price * i.quantity)}</strong>
              </li>
            ))}
          </ul>
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
          <Link to="/cart" className="btn-link">
            Edit cart
          </Link>
        </aside>
      </div>
    </>
  );
}
