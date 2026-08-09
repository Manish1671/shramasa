/**
 * Canonical storefront image path: exact product slug → local PNG.
 * Prefer this over DB image URLs so mapping cannot drift by order/index.
 */
export function productImagePath(slug: string): string {
  return `/products/${slug}.png`;
}
