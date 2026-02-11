"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import style from "../../styles/login.module.css";

export default function AdminDashboardPage() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const username = session?.user?.name ?? "Admin";
  const email = session?.user?.email ?? "admin@example.com";

  return (
    <div className={`min-h-screen bg-gray-900 flex`}>
      {/* Sidebar */}
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
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl  text-white border-b">
          Admin Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/admin/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Product
          </a>

          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Settings
          </a>
          <Link
            href="/dashboard/admin/product/create"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Tambah Product
          </Link>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
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

        {/* Content */}
        <main className="p-6">
          <div className="bg-black rounded shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-white">
              Selamat datang "{username}"
            </h2>
            <p className="text-text-gray-400">
              <strong>{email}</strong>
            </p>

            {/* Area konten admin */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-yellow-300 rounded p-4">
                <h3 className="font-semibold text-white">Total Product</h3>
                <p className="text-2xl mt-2 text-gray-500">—</p>
              </div>
              <div className="border lue-800 rounded p-4">
                <h3 className="font-semibold text-white">Active Sessions</h3>
                <p className="text-2xl mt-2 text-gray-500">—</p>
              </div>
              <div className="border border-green-500 rounded p-4">
                <h3 className="font-semibold text-white">System Status</h3>
                <p className="text-2xl mt-2 text-white">OK</p>
              </div>
            </div>
          </div>
        </main>
        <Footer role="admin" />
      </div>
    </div>
  );
}
