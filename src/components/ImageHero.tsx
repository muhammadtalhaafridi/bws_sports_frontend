export function ImageHero({
  image,
  eyebrow,
  title,
  subtitle,
  position,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  position?: string;
}) {
  return (
    <section
      className="image-hero"
      style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
    >
      <div className="container">
        <div className="image-hero-text">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
