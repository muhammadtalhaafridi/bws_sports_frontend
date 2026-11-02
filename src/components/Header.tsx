import { ChevronDown, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdSportsCricket } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { DASHBOARD_URL } from "../lib/api";
import { imageUrl } from "../lib/format";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus when the page changes.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
    setUserOpen(false);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onLogout = () => {
    logout();
    toast.success("You have been logged out");
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <MdSportsCricket size={28} />
          <span>
            BWS <em>Sports</em>
          </span>
        </Link>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <ShoppingCart size={22} />
            {count > 0 && <span className="cart-count">{count > 99 ? "99+" : count}</span>}
          </Link>

          {user ? (
            <div className="user-menu" ref={userRef}>
              <button className="user-button" onClick={() => setUserOpen((o) => !o)} aria-expanded={userOpen}>
                {user.image ? (
                  <img src={imageUrl(user.image)} alt="" className="avatar" />
                ) : (
                  <span className="avatar avatar-letter">{user.name.charAt(0).toUpperCase()}</span>
                )}
                <span className="user-name">{user.name.split(" ")[0]}</span>
                <ChevronDown size={16} />
              </button>
              {userOpen && (
                <div className="dropdown">
                  <div className="dropdown-head">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/orders">
                    <Package size={16} /> My orders
                  </Link>
                  <Link to="/profile">
                    <User size={16} /> My profile
                  </Link>
                  {user.role === "ADMIN" && (
                    <a href={DASHBOARD_URL} target="_blank" rel="noreferrer">
                      <LayoutDashboard size={16} /> Admin dashboard
                    </a>
                  )}
                  <button onClick={onLogout}>
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-accent btn-sm">
              Login
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
