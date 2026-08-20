import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for shopping at Shramasa — accounts, orders, payments, shipping, and returns.",
};

const SECTIONS = [
  {
    title: "The shop",
    body: "These terms govern use of the Shramasa website and purchase of products from us in India. By creating an account or placing an order you agree to them. If you do not agree, please do not use the shop.",
  },
  {
    title: "Accounts",
    body: "Checkout, wishlist, and order history require an account. You are responsible for keeping your login details safe. You may register with email or Google. You must provide accurate contact and delivery information. Email accounts can reset a password from the forgot-password page, or by contacting us if reset email is not yet active. Google accounts sign in with Google.",
  },
  {
    title: "Products and pricing",
    body: "Product descriptions, images, and prices (in Indian rupees, inclusive of applicable taxes unless stated otherwise) are shown on each product page. We may correct errors, update stock, or withdraw a product. If an item cannot be fulfilled after you pay, we will refund the affected amount.",
  },
  {
    title: "Orders and payment",
    body: "An order is an offer to buy. We accept it when we confirm it in your account. You may pay online through Razorpay or choose Cash on Delivery where offered. Online payments are processed by Razorpay under their terms. Until payment is confirmed (or COD is accepted), we may cancel the order.",
  },
  {
    title: "Shipping",
    body: "We ship across India, with complimentary shipping on every order. Dispatch timing, how to follow a parcel, and returns are described on the Customer Care page and may vary by courier and location. Risk in the goods passes on delivery to the address you provided. Please check the parcel on arrival.",
  },
  {
    title: "Returns",
    body: "Unopened products may be returned within 7 days of delivery as set out on the Customer Care page. Opened or used items cannot be returned for hygiene reasons, except where the product arrived damaged or incorrect. Contact us with your order number to start a return.",
  },
  {
    title: "Use of the site",
    body: "You may not misuse the shop, attempt unauthorised access, scrape content at scale, or use our name, product photography, or trademarks except as needed to use the site as a customer.",
  },
  {
    title: "Liability",
    body: "Products are cosmetics and personal care, not medicine. Follow on-pack directions and patch-test if you have sensitive skin. To the extent permitted by Indian consumer law, we are not liable for indirect or consequential loss. Nothing in these terms limits rights you have under applicable consumer protection law.",
  },
  {
    title: "Changes",
    body: "We may update these terms. The date below is the latest version. Continued use after a change means you accept the updated terms. Indian law applies. Disputes are subject to the courts of competent jurisdiction in India.",
  },
] as const;

export default function TermsPage() {
  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl border-b border-border pb-12">
          <p className="eyebrow">Legal</p>
          <h1 className="type-h2 mt-4 text-balance">Terms of Use</h1>
          <p className="type-body mt-6">
            Last updated 20 August 2026. Have these terms reviewed before you
            take live payments.
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
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/care" className="underline underline-offset-4">
            Shipping &amp; returns
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
