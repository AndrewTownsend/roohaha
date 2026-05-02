import { Card, SectionLabel, AccentBar } from "./ui";
import ContactForm from "./ContactForm";

export default function ContactCard() {
  return (
    <Card id="contact" variant="contact">
      <SectionLabel>Contact</SectionLabel>
      <AccentBar />
      <ContactForm />
    </Card>
  );
}
