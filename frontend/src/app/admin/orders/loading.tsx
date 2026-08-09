export default function AdminOrdersLoading() {
  return (
    <main
      className="px-6 py-10 sm:px-8 lg:px-10"
      aria-label="Loading orders"
      aria-busy="true"
    >
      <div className="h-8 w-36 rounded-lg bg-muted" />
      <div className="mt-8 h-20 rounded-xl bg-muted/70" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-14 rounded-lg bg-muted/60" />
        ))}
      </div>
    </main>
  );
}
