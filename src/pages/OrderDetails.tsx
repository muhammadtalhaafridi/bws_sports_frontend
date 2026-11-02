import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ProductImage } from "../components/ProductImage";
import { EmptyState, ErrorState, Spinner, StatusBadge } from "../components/ui";
import { api, getErrorMessage } from "../lib/api";
import { formatDateTime, formatPrice, orderNumber } from "../lib/format";
import type { Order } from "../lib/types";

const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

/** Order details. After checkout (?placed=1) it is the payment confirmation page. */
export function OrderDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const placed = params.get("placed") === "1";
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => (await api.get<{ order: Order }>(`/orders/${id}`)).data.order,
    retry: false,
  });

  const cancel = useMutation({
    mutationFn: async () => (await api.patch<{ order: Order }>(`/orders/${id}/cancel`)).data.order,
    onSuccess: (updated) => {
      queryClient.setQueryData(["orders", id], updated);
      queryClient.invalidateQueries({ queryKey: ["orders", "mine"] });
      toast.success("Order cancelled");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <Spinner label="Loading order..." />;
  if (isError || !order) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;
    return (
      <div className="container section">
        {status === 404 || status === 403 ? (
          <EmptyState title="Order not found" action={<Link to="/orders" className="btn btn-primary">My orders</Link>} />
        ) : (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        )}
      </div>
    );
  }

  const stepIndex = steps.indexOf(order.status as (typeof steps)[number]);

  return (
    <div className="container section narrow">
      {placed ? (
        <div className="confirmation">
          <CheckCircle2 size={56} />
          <h1>Thank you for your order!</h1>
          <p>
            Your order number is <strong>{orderNumber(order.id)}</strong>. We will call you on {order.phone} to confirm
            delivery.
          </p>
        </div>
      ) : (
        <Link to="/orders" className="btn-link">
          <ChevronLeft size={16} /> My orders
        </Link>
      )}

      <div className="card order-card">
        <div className="order-head">
          <div>
            <h2>Order {orderNumber(order.id)}</h2>
            <span className="muted">Placed on {formatDateTime(order.orderDate)}</span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {order.status !== "CANCELLED" && (
          <ol className="progress">
            {steps.map((s, i) => (
              <li key={s} className={i <= stepIndex ? "done" : ""}>
                <span className="dot" />
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </li>
            ))}
          </ol>
        )}

        <h3>Order summary</h3>
        <ul className="summary-items">
          {order.items.map((item) => (
            <li key={item.id}>
              <ProductImage src={item.product.image} alt={item.product.name} className="summary-thumb" />
              <span>
                <Link to={`/products/${item.product.id}`}>
                  <strong>{item.product.name}</strong>
                </Link>
                <small>
                  {item.quantity} × {formatPrice(item.price)}
                </small>
              </span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </li>
          ))}
        </ul>
        <div className="summary-row">
          <span>Delivery</span>
          <span className="text-success">Free</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <div className="order-info">
          <div>
            <h4>Delivery to</h4>
            <p>
              {order.user.name}
              <br />
              {order.address}
              <br />
              {order.phone}
            </p>
          </div>
          <div>
            <h4>Payment</h4>
            <p>{order.paymentMethod}</p>
            {order.description && (
              <>
                <h4>Notes</h4>
                <p>{order.description}</p>
              </>
            )}
          </div>
        </div>

        <div className="order-actions">
          {order.status === "PENDING" && (
            <button
              className="btn btn-outline danger"
              disabled={cancel.isPending}
              onClick={() => {
                if (confirm("Cancel this order?")) cancel.mutate();
              }}
            >
              {cancel.isPending ? "Cancelling..." : "Cancel order"}
            </button>
          )}
          <Link to="/products" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
