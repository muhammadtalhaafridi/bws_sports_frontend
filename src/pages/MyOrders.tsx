import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyOrders } from "../api/order/queries";
import { ProductImage } from "../components/ProductImage";
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from "../components/ui";
import { getErrorMessage } from "../lib/api";
import { formatDate, formatPrice, orderNumber } from "../lib/format";

export function MyOrders() {
  const { data, isLoading, isError, error, refetch } = useMyOrders();

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
