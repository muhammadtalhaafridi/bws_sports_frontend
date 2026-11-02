import { ContactForm, ShopDetails } from "../components/ContactForm";
import { PageHeader } from "../components/ui";

export function Contact() {
  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions about gear, sizes or an order? We are happy to help." />
      <div className="container section contact-layout">
        <ContactForm />
        <ShopDetails />
      </div>
    </>
  );
}
