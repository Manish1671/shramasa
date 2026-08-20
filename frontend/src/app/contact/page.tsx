import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Shramasa for product questions, order support, or partnership enquiries.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl border-b border-border pb-12">
          <p className="eyebrow">Contact</p>
          <h1 className="type-h2 mt-4 text-balance">
            We would love to hear from you
          </h1>
          <p className="type-body mt-6">
            Reach out for product guidance, order help, or brand collaborations
            using the form. We will respond as soon as we can.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <aside className="space-y-9 border-t border-border pt-8">
            <div>
              <h2 className="eyebrow">How to reach us</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Use the contact form for product questions, order support, or
                partnership enquiries. Messages reach the Shramasa team
                directly.
              </p>
            </div>
            <div>
              <h2 className="eyebrow">Response time</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
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
