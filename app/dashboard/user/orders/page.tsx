"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>Belum ada pesanan</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-black p-4 rounded">
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
              {order.note && (
                <div className="mt-2 bg-blue-500/10 border border-blue-500/30 p-2 rounded">
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
    </div>
  );
}
