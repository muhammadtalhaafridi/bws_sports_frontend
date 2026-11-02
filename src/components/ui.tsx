import { ChevronLeft, ChevronRight, Loader2, PackageOpen } from "lucide-react";
import type { ReactNode } from "react";
import type { OrderStatus } from "../lib/types";
import { statusLabel } from "../lib/format";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <Loader2 className="spin" size={28} />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <PackageOpen size={48} strokeWidth={1.5} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="empty-state error">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{statusLabel[status]}</span>;
}

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="field-error">{message}</p> : null;
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pages">
      <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} /> Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
