export default function ProductDetailsLoading() {
  return (
    <main
      className="px-6 py-10 sm:py-14 lg:py-20"
      aria-label="Loading product"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-3 w-64 max-w-full rounded-sm bg-muted/80" />

        <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-20">
          <div>
            <div className="aspect-[4/5] rounded-sm bg-[linear-gradient(165deg,oklch(0.955_0.014_95)_0%,oklch(0.92_0.02_145)_100%)] ring-1 ring-border/40" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-sm bg-muted/70 ring-1 ring-border/40"
                />
              ))}
            </div>
          </div>

          <div className="lg:py-1">
            <div className="h-3 w-24 rounded-sm bg-muted/80" />
            <div className="mt-4 h-12 w-4/5 max-w-md rounded-sm bg-muted" />
            <div className="mt-6 h-8 w-28 rounded-sm bg-muted/90" />
            <div className="mt-5 h-4 w-20 rounded-sm bg-muted/70" />
            <div className="mt-8 h-px w-12 bg-primary/20" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded-sm bg-muted/70" />
              <div className="h-4 w-11/12 rounded-sm bg-muted/60" />
              <div className="h-4 w-4/5 rounded-sm bg-muted/50" />
            </div>
            <div className="mt-10 h-11 w-32 rounded-sm bg-muted/70" />
            <div className="mt-8 space-y-3">
              <div className="h-12 w-full rounded-sm bg-muted" />
              <div className="h-12 w-full rounded-sm bg-muted/70" />
              <div className="h-11 w-full rounded-sm bg-muted/55" />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 border-t border-border/40 pt-8">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-4 rounded-sm bg-muted/55" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/45 pt-16 sm:mt-20">
          <div className="h-3 w-24 rounded-sm bg-muted/70" />
          <div className="mt-3 h-9 w-56 rounded-sm bg-muted/80" />
          <div className="mt-12 space-y-8">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="space-y-4 border-t border-border/40 pt-8"
              >
                <div className="h-7 w-36 rounded-sm bg-muted/75" />
                <div className="h-px w-12 bg-primary/15" />
                <div className="h-4 w-full rounded-sm bg-muted/55" />
                <div className="h-4 w-5/6 rounded-sm bg-muted/45" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
