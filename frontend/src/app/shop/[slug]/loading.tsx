export default function ProductDetailsLoading() {
  return (
    <main
      className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      aria-label="Loading product"
      aria-busy="true"
    >
      <div className="mx-auto max-w-[64rem]">
        <div className="h-3 w-64 max-w-full bg-secondary" />

        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-12">
          <div className="product-frame bg-secondary/70" />

          <div>
            <div className="h-3 w-24 bg-secondary" />
            <div className="mt-4 h-9 w-4/5 bg-secondary" />
            <div className="mt-5 space-y-2.5">
              <div className="h-4 w-full bg-secondary/70" />
              <div className="h-4 w-11/12 bg-secondary/60" />
            </div>
            <div className="mt-6 h-7 w-28 bg-secondary" />
            <div className="mt-8 h-12 w-full bg-secondary" />
            <div className="mt-2.5 h-12 w-full bg-secondary/70" />
          </div>
        </div>
      </div>
    </main>
  );
}
