import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Restricted
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Access forbidden
          </h1>
          <p className="mt-4 text-muted-foreground">
            This area is available only to Shramasa administrators.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-8" })}>
            Return home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-muted/20 lg:flex-row">
      <aside className="border-b border-border bg-background lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="px-5 py-6 lg:sticky lg:top-0 lg:px-6 lg:py-8">
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Admin
          </p>
          <p className="mt-2 font-heading text-xl font-semibold tracking-tight">
            Shramasa
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.name}
          </p>
          <div className="mt-6">
            <AdminNav />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
