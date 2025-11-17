"use client";
import { useState } from "react";
import { Spinner } from "@/components";
import { useRouter } from "next/navigation";
import { API_URL, setToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@demo.com");
  const [password, setPassword] = useState("Demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) return setError("Contraseña o usuario incorrecto");
        return setError(data.error || "Error de login");
      }
      setToken(data.token);
      router.push("/casos");
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md z-10">
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-4 py-2 rounded-lg font-semibold shadow text-center w-full">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
            Si no puedes iniciar sesión, espera unos segundos: el backend se está iniciando.
          </span>
        </div>
      </div>
      <form onSubmit={submit} className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 backdrop-blur">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 dark:text-purple-300 text-center drop-shadow">Iniciar sesión</h1>
        {error && (
          <div className="mb-4 flex items-center justify-center">
            <span className="inline-flex items-center bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-2 rounded-lg font-semibold shadow">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
              {error}
            </span>
          </div>
        )}
        <label className="block mb-4 font-semibold text-gray-700 dark:text-gray-200">Email
          <input
            className="w-full mt-1 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            autoComplete="username"
            disabled={loading}
          />
        </label>
        <label className="block mb-6 font-semibold text-gray-700 dark:text-gray-200">Contraseña
          <input
            type="password"
            className="w-full mt-1 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            disabled={loading}
          />
        </label>
        <button
          className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold p-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <Spinner className="h-6 w-6" /> : "Entrar"}
        </button>
      </form>
    </div>
  );
}
