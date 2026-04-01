"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Footer from "@/components/Footer";

type CartItem = {
  id: string;
  quantity: number;
  note?: string;
  product: {
    name: string;
    price: number;
  };
};

type Cart = {
  items: CartItem[];
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  const total =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ) || 0;

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
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

  async function handleCheckout() {
    if (!cart || cart.items.length === 0) {
      alert("Cart kosong");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Checkout berhasil!");
      router.push("/dashboard/user/orders");
    } catch (err) {
      console.error(err);
      alert("Checkout gagal");
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) return <p className="p-6">Harus login</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* SIDEBAR */}
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
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="bg-black px-6 py-4">
          <h1 className="text-lg font-semibold text-white">Checkout</h1>
        </header>

        <main className="p-6 flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : !cart || cart.items.length === 0 ? (
            <p className="text-white">Cart kosong</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* LIST ITEM */}
              <div className="md:col-span-2 bg-black p-4 rounded">
                <h2 className="text-lg font-semibold mb-4 text-white">Item</h2>

                {cart.items.map((item) => {
                  const subtotal = item.product.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-700 py-3 text-white"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-400">
                            {rupiah.format(item.product.price)} x{" "}
                            {item.quantity}
                          </p>

                          {item.note && (
                            <p className="text-sm text-yellow-400 mt-1">
                              Note: {item.note}
                            </p>
                          )}
                        </div>

                        <div className="font-semibold">
                          {rupiah.format(subtotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAYMENT PANEL */}
              <div className="bg-black p-4 rounded text-white">
                <h2 className="text-lg font-semibold mb-4">Pembayaran</h2>

                {/* NOTE */}
                <div className="mb-4">
                  <label className="block text-sm mb-1">
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    placeholder="Contoh: Tolong kirim cepat"
                  />
                </div>

                {/* PAYMENT METHOD */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Metode Pembayaran
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  >
                    <option value="COD">COD</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="QRIS">QRIS</option>
                    <option value="E_WALLET">E-Wallet</option>
                  </select>
                </div>

                {/* TOTAL */}
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span>{rupiah.format(total)}</span>
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
                >
                  {submitting ? "Processing..." : "Bayar Sekarang"}
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer role="user" />
      </div>
    </div>
  );
}
