import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Banknote, Headphones, Truck } from "lucide-react";
import type { IconType } from "react-icons";
import { GiAmericanFootballHelmet, GiCricketBat, GiTennisBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { CategoryIcon } from "../components/CategoryIcon";
import { ContactForm, ShopDetails } from "../components/ContactForm";
import { Faq } from "../components/home/Faq";
import { ProductTabs } from "../components/home/ProductTabs";
import { PromoBanners } from "../components/home/PromoBanners";
import { SizeGuide } from "../components/home/SizeGuide";
import { Testimonials } from "../components/home/Testimonials";
import { ProductGrid } from "../components/ProductCard";
import { EmptyState, ErrorState, Spinner } from "../components/ui";
import { useCategories } from "../hooks/useCategories";
import { api, getErrorMessage } from "../lib/api";
import type { Pagination, Product } from "../lib/types";

const slides: { title: string; text: string; to: string; category?: string; cta: string; Icon: IconType; tone: string }[] = [
  {
    title: "Cricket gear for every player",
    text: "Bats, balls, protection, clothing and bags for street, school and club cricket.",
    to: "/products",
    cta: "Shop now",
    Icon: GiCricketBat,
    tone: "green",
  },
  {
    title: "English willow, hand picked",
    text: "Grade 1 and Grade 2 English willow bats with big sweet spots and perfect balance.",
    to: "/products?search=willow",
    cta: "Shop bats",
    Icon: GiCricketBat,
    tone: "amber",
  },
  {
    title: "Play fearless",
    text: "Helmets, pads and gloves that protect you without slowing you down.",
    to: "/products",
    category: "Protection",
    cta: "Shop protection",
    Icon: GiAmericanFootballHelmet,
    tone: "navy",
  },
];

const features = [
  { Icon: BadgeCheck, title: "Genuine gear", text: "Quality checked before it ships" },
  { Icon: Truck, title: "Free delivery", text: "Across Pakistan on every order" },
  { Icon: Banknote, title: "Cash on delivery", text: "Pay when your order arrives" },
  { Icon: Headphones, title: "Expert advice", text: "Ask us about sizes and willow" },
];

export function Home() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const featured = useQuery({
    queryKey: ["products", { featured: true }],
    queryFn: async () =>
      (await api.get<{ products: Product[]; pagination: Pagination }>("/products", { params: { featured: true, limit: 8 } })).data,
  });

  // Category slides link straight to that category once categories have loaded.
  const slideLink = (to: string, categoryName?: string) => {
    const match = categories?.find((c) => c.name === categoryName);
    return match ? `/products?category=${match.id}` : to;
  };

  return (
    <>
      <section className="hero">
        <Slider dots arrows={false} autoplay autoplaySpeed={5000} infinite speed={600} pauseOnHover>
          {slides.map((s) => (
            <div key={s.title}>
              <div className={`hero-slide hero-${s.tone}`}>
                <div className="container hero-inner">
                  <div className="hero-text">
                    <span className="eyebrow">BWS Sports</span>
                    <h1>{s.title}</h1>
                    <p>{s.text}</p>
                    <Link to={slideLink(s.to, s.category)} className="btn btn-accent btn-lg">
                      {s.cta} <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="hero-art" aria-hidden>
                    <s.Icon className="hero-icon" />
                    <GiTennisBall className="hero-ball" />
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
                <Link key={c.id} to={`/products?category=${c.id}`} className="category-tile">
                  <span className="category-icon">
                    <CategoryIcon name={c.name} />
                  </span>
                  <strong>{c.name}</strong>
                  <small>{c.productCount ?? 0} products</small>
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
            <ErrorState message={getErrorMessage(featured.error)} onRetry={() => featured.refetch()} />
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
            <p className="muted">Ask about sizes, team orders or an order you placed. We usually reply within a few hours.</p>
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
