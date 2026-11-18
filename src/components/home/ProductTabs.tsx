import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../api/product/queries";
import { getErrorMessage } from "../../lib/api";
import { ProductGrid } from "../ProductCard";
import { EmptyState, ErrorState, Spinner } from "../ui";

const tabs = [
  { id: "new", label: "New arrivals", params: { sort: "newest" }, link: "/products" },
  { id: "budget", label: "Under Rs 5,000", params: { sort: "price_asc", maxPrice: 5000 }, link: "/products?maxPrice=5000&sort=price_asc" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductTabs() {
  const [active, setActive] = useState<TabId>("new");
  const tab = tabs.find((t) => t.id === active)!;

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({ ...tab.params, limit: 8 });

  return (
    <section className="section section-muted">
      <div className="container">
        <div className="section-head">
          <h2>Trending now</h2>
          <Link to={tab.link} className="link-arrow">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="pill-tabs" role="tablist" aria-label="Product lists">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls="trending-panel"
              className={active === t.id ? "active" : ""}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="trending-panel" role="tabpanel" aria-labelledby={`tab-${active}`} style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity .2s" }}>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          ) : data?.products.length ? (
            <ProductGrid products={data.products} />
          ) : (
            <EmptyState title="Nothing here yet" />
          )}
        </div>
      </div>
    </section>
  );
}
