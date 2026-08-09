import { apiFetch, getAccessToken, getCurrentUser } from "@/lib/api";
import type { Cart } from "@/lib/types";

import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const token = await getAccessToken();
  const user = token ? await getCurrentUser() : null;

  let cartCount = 0;
  if (user) {
    try {
      const cart = await apiFetch<Cart>("/cart");
      cartCount = cart.itemCount;
    } catch {
      cartCount = 0;
    }
  }

  return (
    <NavbarClient
      isAuthenticated={Boolean(user)}
      isAdmin={user?.role === "ADMIN"}
      cartCount={cartCount}
    />
  );
}
