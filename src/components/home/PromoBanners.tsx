import { ArrowRight } from "lucide-react";
import type { IconType } from "react-icons";
import { GiAmericanFootballHelmet, GiCricketBat } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

const promos: { eyebrow: string; title: string; text: string; cta: string; to: string; category?: string; Icon: IconType; tone: string }[] = [
  {
    eyebrow: "Bats",
    title: "English willow bats",
    text: "Grade 1 and Grade 2 English willow with straight grains, big edges and a sweet spot that carries.",
    cta: "Shop willow bats",
    to: "/products?search=english%20willow",
    Icon: GiCricketBat,
    tone: "green",
  },
  {
    eyebrow: "Protection",
    title: "Complete protection kit",
    text: "Helmets, pads and gloves that fit well and feel light, so you can play your shots without fear.",
    cta: "Shop protection",
    to: "/products",
    category: "Protection",
    Icon: GiAmericanFootballHelmet,
    tone: "navy",
  },
];

export function PromoBanners() {
  const { data: categories } = useCategories();
  const link = (to: string, name?: string) => {
    const match = categories?.find((c) => c.name === name);
    return match ? `/products?category=${match.id}` : to;
  };

  return (
    <section className="section">
      <div className="container promo-grid">
        {promos.map(({ eyebrow, title, text, cta, to, category, Icon, tone }) => (
          <Link key={title} to={link(to, category)} className={`promo promo-${tone}`}>
            <div className="promo-text">
              <span className="eyebrow">{eyebrow}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="promo-cta">
                {cta} <ArrowRight size={16} />
              </span>
            </div>
            <Icon className="promo-icon" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}
