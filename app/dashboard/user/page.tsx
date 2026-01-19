"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function UserDashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative w-64 bg-white h-full shadow">
            <div className="p-6 font-bold text-xl border-b flex justify-between text-black">
              User Panel
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="p-4 space-y-2">
              <a className="block px-4 py-2 rounded bg-gray-200 text-black">
                Dashboard
              </a>
              <a className="block px-4 py-2 rounded hover:bg-gray-100">
                Profile
              </a>
              <a className="block px-4 py-2 rounded hover:bg-gray-100">
                Settings
              </a>
            </nav>
          </aside>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 font-bold text-xl border-b text-black">
          User Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded bg-gray-200 text-gray-900 font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Burger button */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-gray-700"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-black">
              User Dashboard
            </h2>
            <p className="text-gray-600">
              Hanya pengguna dengan role <strong>USER</strong> yang bisa melihat
              halaman ini.
            </p>

            {/* Konten user */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-black rounded p-4">
                <h3 className="font-semibold text-black">Akun Saya</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Kelola informasi akun
                </p>
              </div>
              <div className="border border-black rounded p-4">
                <h3 className="font-semibold text-black">Aktivitas</h3>
                <p className="text-sm text-gray-500 mt-2">Riwayat penggunaan</p>
              </div>
              <div className="border border-black rounded p-4">
                <h3 className="font-semibold text-black">Status</h3>
                <p className="text-2xl mt-2 text-green-600">Aktif</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
