export default function AdminProductsLoading() {
  return (
    <main
      className="px-6 py-10 sm:px-8 lg:px-10"
      aria-label="Loading products"
      aria-busy="true"
    >
      <div className="h-8 w-40 rounded-lg bg-muted" />
      <div className="mt-8 h-16 rounded-xl bg-muted/70" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-16 rounded-lg bg-muted/60" />
        ))}
      </div>
    </main>
  );
}
