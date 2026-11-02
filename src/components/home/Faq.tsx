import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Shop policies shown to customers. Update them to match how the shop really works.
const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders in Lahore usually arrive in 2 - 3 working days. Other cities in Pakistan take 3 - 5 working days. Delivery is free on every order.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes. Every order is cash on delivery, so you only pay when the parcel is in your hands.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes, within 7 days if the item is unused and in its original packaging. Send us a message with your order number and we will arrange it.",
  },
  {
    q: "How do I choose the right bat size?",
    a: "Use the bat size chart above: choose by the player's height. If you are between two sizes, pick the smaller one for better control.",
  },
  {
    q: "Do I need to knock in a new bat?",
    a: "English willow bats should be knocked in for 4 - 6 hours with a bat mallet before playing with a hard ball. Kashmir willow and tape-ball bats are ready to play.",
  },
  {
    q: "How can I track my order?",
    a: "Log in and open My orders. You will see each order's status: Pending, Processing, Shipped or Delivered.",
  },
  {
    q: "Do you give discounts for teams and schools?",
    a: "Yes. For orders of 10 or more items (team kits, shirts, balls) send us a message and we will share a team price.",
  },
];

export function Faq() {
  return (
    <section className="section">
      <div className="container faq-layout">
        <div>
          <span className="eyebrow eyebrow-dark">Help</span>
          <h2>Frequently asked questions</h2>
          <p className="muted">Quick answers about delivery, payment, returns and choosing gear.</p>
          <p className="muted">
            Can&apos;t find your answer? <a href="#contact">Send us a message</a> or see your{" "}
            <Link to="/orders">orders</Link>.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>
                {f.q}
                <ChevronDown size={18} aria-hidden />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
