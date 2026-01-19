"use client";

import { useRouter } from "next/navigation";
import "../globals.css";
export default function ForbiddenPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined") {
      if (document.referrer && document.referrer !== "") {
        window.location.href = document.referrer;
        return;
      }

      if (window.history.length > 1) {
        router.back();
        return;
      }
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">Akses Ditolak</h1>

        {/* Description */}
        <p className="mt-2 text-gray-600">
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>

        {/* Action */}
        <button
          onClick={handleBack}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    </main>
  );
}
