// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** fields default: name, email, image */
      id?: string; // add id
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // tambahan:
      role?: string;
      username?: string;
      createdAt?: string | Date;
      [key: string]: any;
    };
  }

  interface JWT {
    createdAt?: string | Date;
    [key: string]: any;
  }

  interface ProductType {
    id: string; // cuid from Prisma
    name: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt?: string;
  }

  type CartStatus = "ACTIVE" | "CHECKOUT" | "COMPLETED" | "CANCELLED";

  interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product?: ProductType;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface Cart {
    id: string;
    userId: string;
    status: CartStatus;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
    user?: Session["user"];
  }
}