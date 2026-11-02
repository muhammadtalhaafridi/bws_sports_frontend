import { BadgeCheck, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { GiCricketBat, GiTennisBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui";

const reasons = [
  { Icon: BadgeCheck, title: "Genuine products", text: "Every bat, ball and pad is checked by our team before it is packed." },
  { Icon: ShieldCheck, title: "Fair prices", text: "Clear prices with no hidden charges, and free delivery on every order." },
  { Icon: Truck, title: "Reliable delivery", text: "Orders are packed with care and delivered across Pakistan." },
  { Icon: HeartHandshake, title: "Real advice", text: "We play cricket too. Ask us anything about sizes, weights and willow." },
];

export function About() {
  return (
    <>
      <PageHeader title="About BWS Sports" subtitle="Cricket gear for every player" />
      <div className="container section">
        <div className="about-layout">
          <div className="about-image" aria-hidden>
            <GiCricketBat className="about-bat" />
            <GiTennisBall className="about-ball" />
            <span>Since 2015</span>
          </div>
          <div className="about-text">
            <h2>Who we are</h2>
            <p>
              BWS Sports is a cricket equipment shop started by a group of club cricketers in Lahore. We began by
              supplying bats and balls to local teams, and today we serve players of every level, from kids playing
              tape-ball in the street to club and first-class cricketers.
            </p>
            <h2>What we sell</h2>
            <p>
              English and Kashmir willow bats, leather and tape balls, helmets, pads and gloves, playing clothing, shoes
              and kit bags. Everything a cricketer needs, in one place.
            </p>
            <h2>Why customers trust us</h2>
            <p>
              We only sell gear we would use ourselves. If something is not right, our team will help you exchange it.
              You can pay cash on delivery, so you only pay when your order is in your hands.
            </p>
            <div className="about-stats">
              <div>
                <strong>10,000+</strong>
                <span>Happy players</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Teams supplied</span>
              </div>
              <div>
                <strong>4.8/5</strong>
                <span>Customer rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reasons-grid">
          {reasons.map(({ Icon, title, text }) => (
            <div key={title} className="card reason">
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="cta-band">
          <div>
            <h2>Ready to gear up?</h2>
            <p>Find the right bat, ball and protection for your game.</p>
          </div>
          <Link to="/products" className="btn btn-accent btn-lg">
            Shop now
          </Link>
        </div>
      </div>
    </>
  );
}
