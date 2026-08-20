import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Customer Care",
  description:
    "Shipping, returns, payments, and order help for Shramasa orders across India.",
};

function CareLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="underline underline-offset-4">
      {children}
    </Link>
  );
}

const FAQS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "How do I place an order?",
    answer: (
      <>
        Create an account, add products to your cart, and checkout with a
        delivery address in India. You can pay online with Razorpay (cards, UPI,
        net banking) or choose Cash on Delivery. Wishlist and order history also
        need an account.
      </>
    ),
  },
  {
    question: "How do I follow an order?",
    answer: (
      <>
        Open{" "}
        <CareLink href="/orders">your orders</CareLink> while signed in. Status
        updates there as we pack and ship. We do not send automatic tracking
        emails yet. For a courier update, use the{" "}
        <CareLink href="/contact">contact form</CareLink> with your order
        number.
      </>
    ),
  },
  {
    question: "What if I paid online but the order still says pending?",
    answer: (
      <>
        Online orders stay pending until Razorpay confirms payment. If the
        amount left your account and the order is still unpaid after a short
        wait, write to us with the order number from the{" "}
        <CareLink href="/contact">contact form</CareLink>.
      </>
    ),
  },
  {
    question: "Can I change or cancel an order?",
    answer: (
      <>
        If the order has not been packed, we can often help. Send the order
        number through the contact form as soon as you can. Once a parcel is
        with the courier, we cannot redirect it.
      </>
    ),
  },
  {
    question: "Do you issue GST invoices?",
    answer: (
      <>
        Yes, on request. Write to us from the contact form with your order
        number and billing details. Invoices are not generated automatically in
        checkout yet.
      </>
    ),
  },
  {
    question: "I forgot my password.",
    answer: (
      <>
        Use{" "}
        <CareLink href="/forgot-password">forgot password</CareLink>. If you
        signed in with Google, return to login and continue with Google. If
        email reset is not active, the same page will point you to contact us.
      </>
    ),
  },
  {
    question: "Are the products medical treatments?",
    answer: (
      <>
        No. Shramasa products are cosmetics and personal care. Follow on-pack
        directions and patch-test if you have sensitive skin. For routine or
        ingredient questions, use the contact form — we do not give medical
        advice.
      </>
    ),
  },
];

export default function CarePage() {
  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl border-b border-border pb-12">
          <p className="eyebrow">Customer care</p>
          <h1 className="type-h2 mt-4 text-balance">
            Shipping, returns, and answers
          </h1>
          <p className="type-body mt-6">
            Practical policies for how we ship, take returns, and help with
            orders across India.
          </p>
        </div>

        <div className="mt-4 max-w-2xl">
          <article
            id="shipping"
            className="scroll-mt-28 border-b border-border py-10 sm:py-12"
          >
            <h2 className="type-h3">Shipping</h2>
            <div className="editorial-rule mt-4" />
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                We ship only within India, to a full address with a 6-digit
                pincode. Shipping is complimentary on every order — the amount
                you see at checkout is the product total, with shipping shown as
                free.
              </p>
              <p>
                We aim to pack and dispatch within 1–2 business days after an
                order is confirmed (online payment received, or Cash on Delivery
                accepted). Delivery after that depends on your pincode and the
                courier.
              </p>
              <p>
                There is no live tracking number inside the shop yet. Your
                order status lives in{" "}
                <CareLink href="/orders">your account</CareLink>. When you need
                a parcel update, send the order number through the{" "}
                <CareLink href="/contact">contact form</CareLink>.
              </p>
            </div>
          </article>

          <article
            id="returns"
            className="scroll-mt-28 border-b border-border py-10 sm:py-12"
          >
            <h2 className="type-h3">Returns</h2>
            <div className="editorial-rule mt-4" />
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Unopened products in original packaging may be returned within 7
                days of delivery. Opened or used items cannot be returned for
                hygiene reasons, unless the product arrived damaged or
                incorrect.
              </p>
              <p>
                To start a return, write from the{" "}
                <CareLink href="/contact">contact page</CareLink> with your
                order number and a short note. There is no self-serve return
                button in the order history. We will confirm the next step
                before you send anything back.
              </p>
              <p>
                Once we receive an approved unused return, online payments are
                refunded to the original method. For Cash on Delivery, we
                arrange a UPI or bank transfer. Shipping stays complimentary, so
                there is no shipping charge to refund.
              </p>
            </div>
          </article>

          <article
            id="faq"
            className="scroll-mt-28 border-b border-border py-10 sm:py-12"
          >
            <h2 className="type-h3">FAQs</h2>
            <div className="editorial-rule mt-4" />
            <dl className="mt-6 space-y-8">
              {FAQS.map((item) => (
                <div key={item.question}>
                  <dt className="text-sm font-medium text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          Still need help?{" "}
          <CareLink href="/contact">Send a message</CareLink>
          . Related:{" "}
          <CareLink href="/terms">Terms of Use</CareLink> and{" "}
          <CareLink href="/privacy">Privacy Policy</CareLink>.
        </p>
      </div>
    </main>
  );
}
