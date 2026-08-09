export default function AdminLoading() {
  return (
    <main
      className="px-6 py-10 sm:px-8 lg:px-10"
      aria-label="Loading admin"
      aria-busy="true"
    >
      <div className="h-8 w-48 rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-72 max-w-full rounded bg-muted" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl bg-muted/70 ring-1 ring-foreground/5"
          />
        ))}
      </div>
    </main>
  );
}
