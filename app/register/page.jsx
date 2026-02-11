"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "../styles/login.module.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registrasi Berhasil!");
      router.push("/");
    } else {
      alert("Registrasi Gagal!");
    }
  };

  return (
    <div
      className={`min-h-screen ${style.bgImg} flex items-center justify-center`}
    >
      <div
        className={`w-full max-w-md ${style.formTransparent} shadow rounded-lg p-8 border border-2`}
      >
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-200">Register</h1>
          <p className="text-sm text-gray-500 mt-1">Buat akun baru</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-white text-white "
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-white text-white "
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-white text-white "
            />
          </div>

          <button
            type="submit"
            aria-describedby="tier-company"
            className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-white hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a href="/" className="text-white hover:underline font-medium">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
