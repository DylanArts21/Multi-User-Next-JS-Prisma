"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Login Gagal! Cek email dan password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="p-8 border rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Sign In
        </button>
        <a
          href="/register"
          className="w-full bg-blue-500 text-white p-2 rounded block text-center mt-2"
        >
          Sign Up
        </a>
      </form>
    </div>
  );
}
