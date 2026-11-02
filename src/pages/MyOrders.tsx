import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "../components/ProductImage";
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from "../components/ui";
import { api, getErrorMessage } from "../lib/api";
import { formatDate, formatPrice, orderNumber } from "../lib/format";
import type { Order } from "../lib/types";

export function MyOrders() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: async () => (await api.get<{ orders: Order[] }>("/orders/my")).data.orders,
  });

  return (
    <>
      <PageHeader title="My orders" subtitle="Track and manage your orders" />
      <div className="container section narrow">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : !data?.length ? (
          <EmptyState
            title="No orders yet"
            text="When you place an order it will show up here."
            action={<Link to="/products" className="btn btn-primary">Start shopping</Link>}
          />
        ) : (
          <div className="orders-list">
            {data.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card order-row">
                <div className="order-row-thumbs">
                  {order.items.slice(0, 3).map((i) => (
                    <ProductImage key={i.id} src={i.product.image} alt={i.product.name} className="summary-thumb" />
                  ))}
                </div>
                <div className="order-row-main">
                  <strong>{orderNumber(order.id)}</strong>
                  <small className="muted">
                    {formatDate(order.orderDate)} · {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </small>
                </div>
                <StatusBadge status={order.status} />
                <strong className="nowrap">{formatPrice(order.total)}</strong>
                <ChevronRight size={18} className="muted" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
