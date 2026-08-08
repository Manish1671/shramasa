export default function ProductDetailsLoading() {
  return (
    <main
      className="px-6 py-16 sm:py-20 lg:py-24"
      aria-label="Loading product"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="aspect-square rounded-3xl bg-muted" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>

          <div className="lg:py-8">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="mt-5 h-12 w-4/5 rounded-lg bg-muted" />
            <div className="mt-5 h-5 w-24 rounded bg-muted" />
            <div className="mt-8 h-8 w-28 rounded bg-muted" />
            <div className="mt-6 h-5 w-full rounded bg-muted" />
            <div className="mt-3 h-5 w-5/6 rounded bg-muted" />
            <div className="mt-10 h-16 w-32 rounded-lg bg-muted" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="h-9 rounded-lg bg-muted" />
              <div className="h-9 rounded-lg bg-muted" />
            </div>
            <div className="mt-12 space-y-px">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-16 border-y border-border bg-muted/30"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
