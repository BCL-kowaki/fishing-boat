"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("パスワードが正しくありません");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px]">
      <h1 className="text-white text-xl font-bold tracking-[0.1em] text-center mb-8">
        管理者ログイン
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-white/30"
          autoFocus
        />
        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white text-sm font-bold tracking-[0.1em] hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
