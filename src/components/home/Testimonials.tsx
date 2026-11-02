import { Quote, Star } from "lucide-react";

const stats = [
  { value: "10,000+", label: "Happy players" },
  { value: "500+", label: "Teams supplied" },
  { value: "4.8/5", label: "Customer rating" },
  { value: "100+", label: "Cities delivered" },
];

// Sample reviews for the demo shop. Replace them with real customer reviews before going live.
const reviews = [
  {
    name: "Usman Tariq",
    role: "Club batter, Lahore",
    rating: 5,
    text: "My English willow bat came well pressed and ready to knock in. The team helped me choose the right weight on WhatsApp.",
  },
  {
    name: "Sara Ahmed",
    role: "Team captain, Karachi",
    rating: 5,
    text: "We ordered shirts and caps for the whole team. Everything arrived on time and the quality is great for the price.",
  },
  {
    name: "Bilal Hussain",
    role: "Parent of a junior player, Islamabad",
    rating: 4,
    text: "The size chart made it easy to pick a bat for my son. Cash on delivery and free delivery were a big plus.",
  },
];

export function Testimonials() {
  return (
    <section className="section trust-band">
      <div className="container">
        <div className="stats-row">
          {stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="section-intro center">
          <span className="eyebrow">Reviews</span>
          <h2>What players say about us</h2>
        </div>

        <div className="review-grid">
          {reviews.map((r) => (
            <figure key={r.name} className="review">
              <Quote size={28} className="review-quote" aria-hidden />
              <div className="stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} className={i < r.rating ? "on" : ""} aria-hidden />
                ))}
              </div>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className="avatar avatar-letter">{r.name.charAt(0)}</span>
                <span>
                  <strong>{r.name}</strong>
                  <small>{r.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
