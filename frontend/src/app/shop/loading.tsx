export default function ShopLoading() {
  return (
    <main
      className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      aria-label="Loading products"
      aria-busy="true"
    >
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl pb-12 sm:pb-16">
          <div className="h-3 w-24 bg-secondary" />
          <div className="mt-5 h-10 w-72 max-w-full bg-secondary" />
          <div className="mt-6 h-4 w-full max-w-xl bg-secondary/70" />
        </div>

        <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:pt-12">
          <aside className="hidden lg:block" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className={index > 0 ? "mt-10" : undefined}>
                <div className="h-3 w-20 bg-secondary" />
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }, (_, optionIndex) => (
                    <div key={optionIndex} className="h-4 w-32 bg-secondary/70" />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div>
            <div className="mb-10 h-4 w-24 bg-secondary/70" />
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index}>
                  <div className="product-frame bg-secondary/70" />
                  <div className="mt-5 h-3 w-20 bg-secondary/70" />
                  <div className="mt-3 h-5 w-3/4 bg-secondary" />
                  <div className="mt-5 h-4 w-20 bg-secondary/70" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
