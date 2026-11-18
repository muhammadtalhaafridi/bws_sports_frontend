import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../api/category/queries";
import type { ProductListParams } from "../api/product/fetcher";
import { useProducts } from "../api/product/queries";
import { ProductGrid } from "../components/ProductCard";
import { EmptyState, ErrorState, Pager, Spinner } from "../components/ui";
import { getErrorMessage } from "../lib/api";
import { formatPrice } from "../lib/format";

export function Products() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const maxPrice = params.get("maxPrice") ?? "";
  const page = Number(params.get("page") ?? 1);

  const [searchText, setSearchText] = useState(search);
  const { data: categories } = useCategories();

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  // Keep the box in sync when the URL changes (e.g. back button).
  const [lastSearch, setLastSearch] = useState(search);
  if (lastSearch !== search) {
    setLastSearch(search);
    setSearchText(search);
  }

  // Search as the customer types (after a short pause).
  useEffect(() => {
    if (searchText.trim() === search) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (searchText.trim()) next.set("search", searchText.trim());
      else next.delete("search");
      next.delete("page");
      setParams(next, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText, search, params, setParams]);

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({
    search,
    category,
    maxPrice,
    sort: sort as ProductListParams["sort"],
    page,
    limit: 12,
  });

  const activeCategory = categories?.find((c) => String(c.id) === category);
  const title = activeCategory ? activeCategory.name : "All products";

  return (
    <div className="container section">
      <div className="products-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search products"
          />
          {searchText && (
            <button onClick={() => setSearchText("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        <label className="select-wrap">
          <span>Filter:</span>
          <select value={category} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="products-heading">
        <h1>{title}</h1>
        {data && (
          <span className="muted">
            {data.pagination.total} {data.pagination.total === 1 ? "product" : "products"}
            {search && <> for “{search}”</>}
          </span>
        )}
        {maxPrice && (
          <button className="chip" onClick={() => update({ maxPrice: "" })} aria-label="Remove price filter">
            Under {formatPrice(Number(maxPrice))} <X size={14} />
          </button>
        )}
      </div>

      {isLoading ? (
        <Spinner label="Loading products..." />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : data && data.products.length > 0 ? (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity .2s" }}>
          <ProductGrid products={data.products} />
          <Pager
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onChange={(p) => {
              update({ page: String(p) });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      ) : (
        <EmptyState
          title="No products found"
          text="Try a different search word or category."
          action={
            <button className="btn btn-outline" onClick={() => setParams(new URLSearchParams())}>
              Show all products
            </button>
          }
        />
      )}
    </div>
  );
}
