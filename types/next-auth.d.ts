// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** fields default: name, email, image */
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // tambahan:
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
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}
}