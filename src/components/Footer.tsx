import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { MdSportsCricket } from "react-icons/md";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export function Footer() {
  const { data: categories } = useCategories();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo logo-light">
            <MdSportsCricket size={28} />
            <span>
              BWS <em>Sports</em>
            </span>
          </Link>
          <p className="footer-about">
            Cricket gear for every player: bats, balls, protection, clothing and bags, chosen by people who love the game.
          </p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All products</Link></li>
            {categories?.map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>BWS Sports</h4>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/orders">My orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li><MapPin size={16} /> Main Boulevard, Gulberg III, Lahore</li>
            <li><Phone size={16} /> +92 300 1234567</li>
            <li><Mail size={16} /> info@bwssports.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} BWS Sports. All rights reserved.</span>
          <span>
            <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> | BWS Sports
          </span>
        </div>
      </div>
    </footer>
  );
}
