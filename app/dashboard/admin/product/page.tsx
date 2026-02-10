"use client";

import { useSession, signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { ProductType } from "next-auth";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function Product() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  //   const id = session?.produ

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal ambil products");
        // console.log("Gagal ambil products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Gagal ambil products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus product");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl text-white border-b">
          Admin Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard/admin"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/admin/product"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Product
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Settings
          </a>
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
        {/* Navbar */}
        <header className="bg-black px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-white"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-white">Daftar Product</h1>
        </header>

        {/* Content */}
        <main className="p-6 bg-black-100 flex-1">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>Belum ada data</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Harga</th>
                    <th className="border p-2">Dibuat</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p.id} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2 text-left">{p.name}</td>
                      <td className="border p-2">{rupiah.format(p.price)}</td>
                      <td className="border p-2">
                        {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/dashboard/products/edit?id=${p.id}`)
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
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
