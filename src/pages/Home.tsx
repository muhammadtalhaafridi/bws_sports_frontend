import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Headphones,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useCategories } from "../api/category/queries";
import { useProducts } from "../api/product/queries";
// Slider photos from unsplash.com: stumps 1759733841123, batter 1776229705277, Adelaide Oval at dusk 1512719994953.
import batterImage from "../assets/hero/batter.jpg";
import ovalImage from "../assets/hero/oval.jpg";
import stumpsImage from "../assets/hero/stumps.jpg";
import { CategoryImage } from "../components/CategoryImage";
import { ContactForm, ShopDetails } from "../components/ContactForm";
import { Faq } from "../components/home/Faq";
import { ProductTabs } from "../components/home/ProductTabs";
import { PromoBanners } from "../components/home/PromoBanners";
import { SizeGuide } from "../components/home/SizeGuide";
import { Testimonials } from "../components/home/Testimonials";
import { ProductGrid } from "../components/ProductCard";
import { EmptyState, ErrorState, Spinner } from "../components/ui";
import { getErrorMessage } from "../lib/api";

const slides: {
  title: string;
  text: string;
  to: string;
  category?: string;
  cta: string;
  image: string;
}[] = [
  {
    title: "Cricket gear for every player",
    text: "Bats, balls, protection, clothing and bags for street, school and club cricket.",
    to: "/products",
    cta: "Shop now",
    image: stumpsImage,
  },
  {
    title: "English willow, hand picked",
    text: "Grade 1 and Grade 2 English willow bats with big sweet spots and perfect balance.",
    to: "/products?search=willow",
    cta: "Shop bats",
    image: batterImage,
  },
  {
    title: "Play fearless",
    text: "Helmets, pads and gloves that protect you without slowing you down.",
    to: "/products",
    category: "Protection",
    cta: "Shop protection",
    image: ovalImage,
  },
];

const features = [
  {
    Icon: BadgeCheck,
    title: "Genuine gear",
    text: "Quality checked before it ships",
  },
  {
    Icon: Truck,
    title: "Free delivery",
    text: "Across Pakistan on every order",
  },
  {
    Icon: Banknote,
    title: "Cash on delivery",
    text: "Pay when your order arrives",
  },
  {
    Icon: Headphones,
    title: "Expert advice",
    text: "Ask us about sizes and willow",
  },
];

export function Home() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const featured = useProducts({ featured: true, limit: 8 });

  // Category slides link straight to that category once categories have loaded.
  const slideLink = (to: string, categoryName?: string) => {
    const match = categories?.find((c) => c.name === categoryName);
    return match ? `/products?category=${match.id}` : to;
  };

  return (
    <>
      <section className="hero">
        <Slider
          dots
          arrows={false}
          autoplay
          autoplaySpeed={4000}
          infinite
          speed={1000}
          pauseOnHover
        >
          {slides.map((s) => (
            <div key={s.title}>
              <div
                className="hero-slide"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="container hero-inner">
                  <div className="hero-text">
                    <span className="eyebrow">BWS Sports</span>
                    <h1>{s.title}</h1>
                    <p>{s.text}</p>
                    <Link
                      to={slideLink(s.to, s.category)}
                      className="btn btn-accent btn-lg"
                    >
                      {s.cta} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="features-strip">
        <div className="container features-grid">
          {features.map(({ Icon, title, text }) => (
            <div key={title} className="feature">
              <Icon size={28} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by category</h2>
            <Link to="/products" className="link-arrow">
              All products <ArrowRight size={16} />
            </Link>
          </div>
          {loadingCategories ? (
            <Spinner />
          ) : (
            <div className="category-grid">
              {categories?.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.id}`}
                  className="category-tile"
                >
                  <span className="category-media">
                    <CategoryImage src={c.image} alt={c.name} />
                  </span>
                  <span className="category-body">
                    <strong>{c.name}</strong>
                    <small>
                      {c.productCount ?? 0}{" "}
                      {c.productCount === 1 ? "product" : "products"}
                    </small>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-head">
            <h2>Featured products</h2>
            <Link to="/products" className="link-arrow">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {featured.isLoading ? (
            <Spinner />
          ) : featured.isError ? (
            <ErrorState
              message={getErrorMessage(featured.error)}
              onRetry={() => featured.refetch()}
            />
          ) : featured.data?.products.length ? (
            <ProductGrid products={featured.data.products} />
          ) : (
            <EmptyState title="No featured products yet" />
          )}
        </div>
      </section>

      <PromoBanners />
      <ProductTabs />
      <SizeGuide />
      <Testimonials />
      <Faq />

      <section className="section section-muted home-contact" id="contact">
        <div className="container">
          <div className="section-intro center">
            <span className="eyebrow eyebrow-dark">Contact us</span>
            <h2>Have a question? Talk to us</h2>
            <p className="muted">
              Ask about sizes, team orders or an order you placed. We usually
              reply within a few hours.
            </p>
          </div>
          <div className="contact-layout">
            <ContactForm />
            <ShopDetails />
          </div>
        </div>
      </section>
    </>
  );
}
