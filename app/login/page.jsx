"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/NewLogin.module.css";
import style from "../styles/login.module.css";
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
      <div className={styles.loginBox}>
        <p>Login</p>

        <form onSubmit={handleLogin} autoComplete="on">
          <div className={styles.userBox}>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className={styles.userBox}>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button type="submit" disabled={loading}>
            <a>
              <span className={styles.span}></span>
              <span className={styles.span}></span>
              <span className={styles.span}></span>
              <span className={styles.span}></span>
              {loading ? "Signing in..." : "Sign In"}
            </a>
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <a href="/register" className={styles.a2}>
            Sign up!
          </a>
        </p>
      </div>
    </div>
  );
}
