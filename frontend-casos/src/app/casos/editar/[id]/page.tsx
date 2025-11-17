"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { API_URL, getToken } from "@/lib/api";
import { Spinner } from "@/components";

type Caso = {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  prioridad: 'baja' | 'media' | 'alta';
  responsable?: string;
};

export default function EditCasoPage() {
  const router = useRouter();
  const params = useParams();
  const casoId = params.id as string;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("nuevo");
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>("media");
  const [responsable, setResponsable] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCaso = async () => {
      const token = getToken();
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_URL}/casos`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Error al obtener casos");
        const casos: Caso[] = await res.json();
        const caso = casos.find(c => c.id === casoId);
        if (!caso) throw new Error("Caso no encontrado");

        setNombre(caso.nombre || "");
        setDescripcion(caso.descripcion || "");
        setEstado(caso.estado || "nuevo");
        setPrioridad(caso.prioridad || "media");
        setResponsable(caso.responsable || "");
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCaso();
  }, [casoId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!estado) {
      setError("El estado es obligatorio");
      return;
    }
    if (!prioridad) {
      setError("La prioridad es obligatoria");
      return;
    }

    setSaving(true);
    const token = getToken();
    if (!token) return router.push("/login");

    try {
      const res = await fetch(`${API_URL}/casos/${casoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre, descripcion, estado, prioridad, responsable })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar");
      router.push("/casos");
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push("/casos")}
          className="mb-6 text-purple-700 dark:text-purple-300 font-semibold hover:underline"
        >
          ← Volver a Casos
        </button>

        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-8 border border-purple-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-8">Editar Caso</h1>

          {error && (
            <div className="mb-6 flex items-center bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-3 rounded-lg font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Nombre *</label>
              <input
                placeholder="Nombre del caso"
                className="w-full border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Descripción</label>
              <textarea
                placeholder="Descripción del caso"
                className="w-full border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition resize-none"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                disabled={saving}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Estado *</label>
                <select
                  className="w-full border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                  required
                  disabled={saving}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Prioridad *</label>
                <select
                  className="w-full border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
                  value={prioridad}
                  onChange={e => setPrioridad(e.target.value as 'baja' | 'media' | 'alta')}
                  required
                  disabled={saving}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Responsable</label>
              <input
                placeholder="Nombre del responsable (opcional)"
                className="w-full border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
                value={responsable}
                onChange={e => setResponsable(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold p-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center disabled:opacity-60"
                disabled={saving}
              >
                {saving ? <Spinner className="h-6 w-6" /> : "✓ Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/casos")}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold p-3 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
