// Receptionist on the phone, Unsplash+ photo (premium_photo-1682089280163-3fb875715a5d), used under the owner's Unsplash+ licence.
// This is the 900px web version; replace it with the full-size download from the Unsplash+ account for sharper large screens.
import heroImage from "../assets/contact-hero.jpg";
import { ContactForm, ShopDetails } from "../components/ContactForm";
import { ImageHero } from "../components/ImageHero";

export function Contact() {
  return (
    <>
      <ImageHero
        image={heroImage}
        position="65% 30%"
        eyebrow="Get in touch"
        title="Contact us"
        subtitle="Questions about gear, sizes or an order? We are happy to help."
      />
      <div className="container section contact-layout">
        <ContactForm />
        <ShopDetails />
      </div>
    </>
  );
}
