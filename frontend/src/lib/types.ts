export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients?: string | null;
  howToUse?: string | null;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  isActive: boolean;
  category: ProductCategory;
  images: ProductImage[];
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  lineTotal: string;
  product: Product;
};

export type Cart = {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: string;
  shipping: string;
  discount: string;
  total: string;
};

export type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
};

export type Wishlist = {
  id: string;
  itemCount: number;
  items: WishlistItem[];
};

export type Address = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethod = "COD" | "RAZORPAY";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  lineTotal: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
  };
};

export type Order = {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: string;
  shipping: string;
  discount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  items: OrderItem[];
};
