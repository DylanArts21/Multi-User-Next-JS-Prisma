"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Footer from "@/components/Footer";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  note?: string;
  items: OrderItem[];
  payment?: {
    status: string;
    method: string;
  };
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

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

          <a
            href="/dashboard/user/orders"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Orders
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
          <h1 className="text-lg font-semibold text-white">Order History</h1>
        </header>

        <main className="p-6 flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-white">Belum ada pesanan</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-black p-4 rounded text-white">
                  {/* HEADER */}
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="font-semibold">Order ID:</p>
                      <p className="text-sm text-gray-400">{order.id}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm">{order.status}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-2 border-t border-gray-700 pt-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {rupiah.format(item.price)} x {item.quantity}
                          </p>

                          {item.note && (
                            <p className="text-sm text-yellow-400">
                              Note: {item.note}
                            </p>
                          )}
                        </div>

                        <div>{rupiah.format(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  {/* NOTE GLOBAL */}
                  {order.note && (
                    <div className="mt-3 bg-blue-500/10 border border-blue-500/30 p-2 rounded">
                      <p className="text-sm text-blue-300">Catatan Pesanan:</p>
                      <p className="text-sm text-white">{order.note}</p>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
                    <div>
                      {order.payment && (
                        <p className="text-sm text-gray-400">
                          {order.payment.method} - {order.payment.status}
                        </p>
                      )}
                    </div>

                    <div className="font-bold">
                      {rupiah.format(order.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer role="user" />
      </div>
    </div>
  );
}
