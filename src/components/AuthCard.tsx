import type { ReactNode } from "react";
import { MdSportsCricket } from "react-icons/md";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-head">
          <span className="auth-icon">
            <MdSportsCricket size={28} />
          </span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
