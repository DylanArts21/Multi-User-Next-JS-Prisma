"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
        setCurrentImage(data.imageUrl);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`/api/product/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/admin/product");
    } else {
      alert("Gagal update product");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Preview gambar lama */}
        {currentImage && !image && (
          <div>
            <p className="text-sm mb-2">Gambar Saat Ini:</p>
            <img
              src={currentImage}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        {/* Upload gambar baru */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* Preview gambar baru */}
        {image && (
          <div>
            <p className="text-sm mb-2">Preview Gambar Baru:</p>
            <img
              src={URL.createObjectURL(image)}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        <button className="bg-black text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
