import { Ruler, Scale, TreeDeciduous } from "lucide-react";

// Standard junior and senior bat sizes, chosen by the player's height.
const sizes = [
  { size: "Size 1", age: "4 - 5", height: "Under 4'0\" (122 cm)" },
  { size: "Size 2", age: "5 - 6", height: "4'0\" - 4'3\" (122 - 130 cm)" },
  { size: "Size 3", age: "6 - 8", height: "4'3\" - 4'6\" (130 - 137 cm)" },
  { size: "Size 4", age: "8 - 9", height: "4'6\" - 4'9\" (137 - 145 cm)" },
  { size: "Size 5", age: "9 - 11", height: "4'9\" - 4'11\" (145 - 150 cm)" },
  { size: "Size 6", age: "11 - 13", height: "4'11\" - 5'3\" (150 - 160 cm)" },
  { size: "Harrow", age: "13 - 15", height: "5'3\" - 5'6\" (160 - 168 cm)" },
  { size: "Short handle", age: "15+", height: "5'6\" - 6'2\" (168 - 188 cm)" },
  { size: "Long handle", age: "Adult", height: "Over 6'2\" (188 cm)" },
];

const tips = [
  { Icon: Ruler, title: "Size by height", text: "Pick the size that matches the player's height, not their age. The bat should reach the top of the thigh when standing." },
  { Icon: Scale, title: "Weight you can control", text: "A lighter bat means faster bat speed. Most adults play best with 1.1 - 1.2 kg; juniors should go lighter." },
  { Icon: TreeDeciduous, title: "The right willow", text: "English willow for leather-ball matches, Kashmir willow for practice and value, and poplar bats for tape-ball cricket." },
];

export function SizeGuide() {
  return (
    <section className="section">
      <div className="container guide-layout">
        <div>
          <span className="eyebrow eyebrow-dark">Buying guide</span>
          <h2>Find the right bat size</h2>
          <p className="muted">A bat that is too big or too heavy slows you down. Use this chart to choose the right size.</p>
          <ul className="tips">
            {tips.map(({ Icon, title, text }) => (
              <li key={title}>
                <span className="tip-icon">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{title}</strong>
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-outline">
            Still not sure? Ask our team
          </a>
        </div>

        <div className="card size-table-card">
          <table className="size-table">
            <caption>Cricket bat size chart</caption>
            <thead>
              <tr>
                <th scope="col">Bat size</th>
                <th scope="col">Age</th>
                <th scope="col">Player height</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s) => (
                <tr key={s.size}>
                  <th scope="row">{s.size}</th>
                  <td>{s.age}</td>
                  <td>{s.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
