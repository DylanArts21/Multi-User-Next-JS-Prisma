"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./styles/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || !res.ok) {
        alert("Login Gagal! Cek email dan password.");
        return;
      }

      let session = null;
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        session = await getSession();
        if (session?.user) break;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 250));
      }

      if (!session?.user) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const role = (session.user.role || "").toUpperCase();
      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "USER") router.push("/dashboard/user");
      else router.push("/dashboard");

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-200">Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Silakan masuk ke akun Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} autoComplete="on">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-white text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-green-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
