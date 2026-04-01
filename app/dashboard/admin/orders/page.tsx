"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import Link from "next/link";

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
  user?: {
    name?: string;
    email?: string;
  };
};

const statusOptions = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Gagal ambil orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar pesanan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, status: string) {
    try {
      setError(null);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message ?? "Gagal update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal update status");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-64 bg-black h-full shadow">
            <div className="p-6 font-bold text-xl flex justify-between text-white">
              Admin Panel
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="p-4 space-y-2">
              <Link
                href="/dashboard/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded bg-gray-200 text-black"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/admin/product"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white hover:bg-gray-700"
              >
                Product
              </Link>
              <Link
                href="/dashboard/admin/product/create"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white hover:bg-gray-700"
              >
                Tambah Product
              </Link>
              <Link
                href="/dashboard/admin/orders"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded bg-gray-200 text-black"
              >
                Orders
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl text-white border-b">
          Admin Panel
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard/admin"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/admin/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Product
          </Link>
          <Link
            href="/dashboard/admin/product/create"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Tambah Product
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Orders
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-black px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-300"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-white">Orders</h1>
        </header>

        <main className="p-6 flex-1">
          {error && (
            <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-white">Belum ada pesanan</p>
          ) : (
            <div className="overflow-x-auto bg-black rounded shadow">
              <table className="w-full border-collapse text-white">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="border p-3">No</th>
                    <th className="border p-3">User</th>
                    <th className="border p-3">Total</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Created</th>
                    <th className="border p-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className="border-t border-gray-700">
                      <td className="border p-3 align-top">{index + 1}</td>
                      <td className="border p-3 align-top">
                        {order.user?.name || order.user?.email || "-"}
                      </td>
                      <td className="border p-3 align-top">
                        {rupiah.format(order.totalPrice)}
                      </td>
                      <td className="border p-3 align-top">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-1 text-white"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-3 align-top">
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="border p-3 align-top">
                        {order.payment ? `${order.payment.method}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer role="admin" />
      </div>
    </div>
  );
}
