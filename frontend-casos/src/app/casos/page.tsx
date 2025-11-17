"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, getToken, clearToken } from "@/lib/api";
import { Caso } from "@/components";
import { Spinner, ConfirmModal } from "@/components";

export default function CasosPage() {
  const router = useRouter();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ id: string; nombre: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return router.push("/login");
    fetchCasos(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCasos(token: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/casos`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        if (res.status === 401) {
          clearToken();
          router.push("/login");
        }
        throw new Error("Error al obtener casos");
      }
      const data = await res.json();
      setCasos(data);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    const token = getToken();
    if (!token) return router.push("/login");
    try {
      await fetch(`${API_URL}/casos/${deleteModal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCasos(prev => prev.filter(c => c.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-purple-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">Gestión de Casos</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/casos/crear")}
              className="bg-linear-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-emerald-600 transition-colors font-semibold"
            >
              ➕ Agregar Caso
            </button>
            <button
              onClick={handleLogout}
              className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:from-pink-600 hover:to-purple-600 transition-colors font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && <Spinner className="my-12" />}
        {error && (
          <div className="mb-6 flex items-center justify-center">
            <span className="inline-flex items-center bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-3 rounded-lg font-semibold shadow">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
              {error}
            </span>
          </div>
        )}

        {casos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No hay casos aún</p>
            <button
              onClick={() => router.push("/casos/crear")}
              className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition-colors font-semibold"
            >
              Crear el primer caso
            </button>
          </div>
        )}

        {casos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casos.map(c => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="font-bold text-lg text-purple-800 dark:text-purple-200 mb-2 line-clamp-2">{c.nombre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{c.descripcion || "Sin descripción"}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 font-semibold">
                      {c.estado}
                    </span>
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-bold ${
                      c.prioridad === 'alta'
                        ? 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200'
                        : c.prioridad === 'media'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {c.prioridad}
                    </span>
                  </div>

                  {c.responsable && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">👤 {c.responsable}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/casos/editar/${c.id}`)}
                      className="flex-1 px-3 py-2 bg-linear-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => setDeleteModal({ id: c.id, nombre: c.nombre })}
                      className="flex-1 px-3 py-2 bg-linear-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-700 transition-colors text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <ConfirmModal
          title="Eliminar Caso"
          message={`¿Estás seguro de que deseas eliminar el caso "${deleteModal.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal(null)}
          isLoading={deleting}
        />
      )}
    </div>
  );
}
