"use client";
import { signOut } from "next-auth/react";
import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 font-bold text-xl border-b text-black">
          Admin Panel
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
            Users
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
          <h1 className="text-lg font-semibold text-black">Dashboard</h1>
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
              Admin Dashboard
            </h2>
            <p className="text-black">
              Hanya pengguna dengan role <strong>ADMIN</strong> yang bisa
              melihat halaman ini.
            </p>

            {/* Area konten admin */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-yellow-300 rounded p-4">
                <h3 className="font-semibold text-black">Total Users</h3>
                <p className="text-2xl mt-2 text-gray-500">—</p>
              </div>
              <div className="border border-blue-800 rounded p-4">
                <h3 className="font-semibold text-black">Active Sessions</h3>
                <p className="text-2xl mt-2 text-gray-500">—</p>
              </div>
              <div className="border border-green-500 rounded p-4">
                <h3 className="font-semibold text-black">System Status</h3>
                <p className="text-2xl mt-2 text-black">OK</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
