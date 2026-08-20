import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Shramasa collects, uses, and protects personal information when you shop with us.",
};

const SECTIONS = [
  {
    title: "Who we are",
    body: "Shramasa is a premium Indian skincare and haircare brand. This policy explains how we handle personal information when you visit our website, create an account, place an order, or contact us. For questions, use the Contact page.",
  },
  {
    title: "Information we collect",
    body: "We collect the details you provide: name, email, phone number, delivery address, and account password (stored in hashed form). If you sign in with Google, we receive your name and verified email from Google. When you order, we keep product, payment method, and fulfilment records. Razorpay processes card, UPI, and net-banking payments; we store payment identifiers needed to confirm an order, not your full card number. If you write through the contact form, we store your name, email, and message so we can reply.",
  },
  {
    title: "How we use it",
    body: "We use this information to create and secure your account, process orders (including Cash on Delivery), deliver products, handle returns, respond to support messages, send a password-reset link when you request one, prevent fraud, and improve the shop. We do not sell your personal information.",
  },
  {
    title: "Legal basis and sharing",
    body: "We process data to fulfil your order and operate the store. We share information only with services required to run the business — for example Razorpay for online payments, and courier partners for delivery. Google receives data only if you choose Google sign-in, according to Google’s own terms.",
  },
  {
    title: "Cookies and account sessions",
    body: "We use an essential session cookie to keep you signed in so you can use cart, wishlist, checkout, and orders. We do not use advertising trackers on the storefront at this time.",
  },
  {
    title: "Retention and security",
    body: "Order and account records are kept as long as needed for fulfilment, returns, accounting, and legal requirements. We protect data with industry-standard measures, including encrypted connections in production and hashed passwords. No method of transmission is completely secure.",
  },
  {
    title: "Your choices",
    body: "You may update your name, phone, and addresses from your account. You may ask us to correct or delete personal data that we are not required to keep, via the Contact page. Google sign-in can be disconnected by using email sign-in instead, where an email password already exists.",
  },
  {
    title: "Children",
    body: "The shop is intended for adults. We do not knowingly collect personal information from children.",
  },
  {
    title: "Updates",
    body: "We may update this policy as the store or the law changes. The date below reflects the latest revision. Continued use of the site after an update means you accept the revised policy.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl border-b border-border pb-12">
          <p className="eyebrow">Legal</p>
          <h1 className="type-h2 mt-4 text-balance">Privacy Policy</h1>
          <p className="type-body mt-6">
            Last updated 20 August 2026. This is a working policy for the
            Shramasa storefront. Have a qualified advisor review it before you
            rely on it for live payments.
          </p>
        </div>

        <div className="mt-4 max-w-2xl">
          {SECTIONS.map((section) => (
            <article
              key={section.title}
              className="scroll-mt-28 border-b border-border py-10 sm:py-12"
            >
              <h2 className="type-h3">{section.title}</h2>
              <div className="editorial-rule mt-4" />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          Related:{" "}
          <Link href="/terms" className="underline underline-offset-4">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/care" className="underline underline-offset-4">
            Customer Care
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
