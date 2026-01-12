"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Selamat Datang, {session.user.name}!
      </h1>
      <p>Email: {session.user.email}</p>
      <p>
        Role Anda:{" "}
        <span className="font-bold text-blue-600">{session.user.role}</span>
      </p>
      <button
        onClick={() => signOut()}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
