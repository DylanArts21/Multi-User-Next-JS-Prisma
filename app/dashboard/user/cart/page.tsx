"use client";

import { useSession, signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Cart, CartItem, ProductType } from "next-auth";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function CartPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (!res.ok) throw new Error("Gagal ambil cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function updateQty(item: CartItem, qty: number) {
    try {
      const res = await fetch(`/api/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error("Gagal update qty");
      const updated = await res.json();
      setCart((c) => {
        if (!c) return c;
        return {
          ...c,
          items: c.items.map((it) => (it.id === updated.id ? updated : it)),
        };
      });
    } catch (err) {
      console.error(err);
      alert("Error update quantity");
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Hapus item dari cart?")) return;
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal hapus item");
      setCart((c) => {
        if (!c) return c;
        return { ...c, items: c.items.filter((it) => it.id !== id) };
      });
    } catch (err) {
      console.error(err);
      alert("Error hapus item");
    }
  }

  if (!session) {
    return <p className="p-6">Please login first.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl text-white border-b">
          User Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard/user"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/user/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Product
          </a>
          <a
            href="/dashboard/user/cart"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Cart
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-black px-6 py-4">
          <h1 className="text-lg font-semibold text-white">My Cart</h1>
        </header>

        <main className="p-6 bg-black-100 flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : !cart || cart.items.length === 0 ? (
            <p className="text-white">Cart kosong</p>
          ) : (
            <div className="overflow-x-auto bg-black rounded shadow">
              <table className="w-full border-collapse">
                <thead className="bg-black">
                  <tr>
                    <th className="border p-2 text-white">No</th>
                    <th className="border p-2 text-white">Nama</th>
                    <th className="border p-2 text-white">Harga</th>

                    <th className="border p-2 text-white">Subtotal</th>
                    <th className="border p-2 text-white">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((it, idx) => {
                    const prod = it.product as ProductType;
                    const subtotal = prod ? prod.price * it.quantity : 0;
                    return (
                      <tr key={it.id} className="text-center text-white">
                        <td className="border p-2">{idx + 1}</td>
                        <td className="border p-2 text-left">{prod?.name}</td>
                        <td className="border p-2">
                          {rupiah.format(prod?.price || 0)}
                        </td>

                        <td className="border p-2">
                          {rupiah.format(subtotal)}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => removeItem(it.id)}
                            className="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer role="user" />
      </div>
    </div>
  );
}
