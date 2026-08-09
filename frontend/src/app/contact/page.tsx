import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Shramasa for product questions, order support, or partnership enquiries.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Contact
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            We would love to hear from you
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Reach out for product guidance, order help, or brand collaborations
            using the form. We will respond as soon as we can.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside className="space-y-8 rounded-sm border border-border bg-muted/30 p-6 sm:p-8">
            <div>
              <h2 className="text-sm font-semibold tracking-wide">How to reach us</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the contact form for product questions, order support, or
                partnership enquiries. A public mailbox will be listed here once
                it is configured.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">Response time</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We aim to reply within 1–2 business days.
              </p>
            </div>
          </aside>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
