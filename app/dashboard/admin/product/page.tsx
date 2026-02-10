"use client";

import { signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";

type ProductType = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function ProductPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/product", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal ambil product");

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal hapus product");

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Gagal menghapus product");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative w-64 bg-black h-full shadow">
            <div className="p-6 font-bold text-xl  flex justify-between text-white">
              Admin Panel
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="p-4 space-y-2">
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded bg-gray-200  text-black transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Dashboard
              </a>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Profile
              </a>

              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Settings
              </a>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="
        w-full text-left block px-4 py-2 rounded
        text-red-500 hover:bg-red-500 hover:text-white
        transition-colors
      "
              >
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}
      {/* Sidebar */}
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
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Product
          </Link>

          <Link
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Settings
          </Link>

          <Link
            href="/dashboard/admin/product/create"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Tambah Product
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-black  px-6 py-4 flex justify-between items-center">
          {/* Burger button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          {/* <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button> */}
        </header>

        <main className="p-6 flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-white">Belum ada data</p>
          ) : (
            <div className="overflow-x-auto bg-black rounded shadow">
              <table className="w-full border-collapse">
                <thead className="bg-black">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Harga</th>
                    <th className="border p-2">Stok</th>
                    <th className="border p-2">Dibuat</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="text-center">
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2 text-left">{p.name}</td>
                      <td className="border p-2">{rupiah.format(p.price)}</td>
                      <td className="border p-2">{p.stock}</td>
                      <td className="border p-2">
                        {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="border p-2 space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded">
                          <Link
                            href={`/dashboard/admin/product/edit?id=${p.id}`}
                          >
                            Edit
                          </Link>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Hapus
                        </button>
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
