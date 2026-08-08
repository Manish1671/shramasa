export default function ShopLoading() {
  return (
    <main
      className="px-6 py-16 sm:py-20 lg:py-24"
      aria-label="Loading products"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-12 w-72 rounded-lg bg-muted" />
        <div className="mt-4 h-6 w-full max-w-xl rounded bg-muted" />

        <div className="mt-12 flex items-center justify-between border-y border-border py-4">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="h-9 w-40 rounded-lg bg-muted" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[14rem_1fr] xl:gap-14">
          <aside className="hidden space-y-8 lg:block" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index}>
                <div className="h-5 w-24 rounded bg-muted" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 3 }, (_, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="h-4 w-32 rounded bg-muted"
                    />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <div className="aspect-4/5 rounded-xl bg-muted" />
                <div className="mt-5 h-5 w-3/4 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-4/5 rounded bg-muted" />
                <div className="mt-8 h-8 w-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
