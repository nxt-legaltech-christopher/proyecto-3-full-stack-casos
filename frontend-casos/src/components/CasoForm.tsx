"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@/components";
import { API_URL, getToken } from "@/lib/api";

export type Caso = {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  prioridad: 'baja' | 'media' | 'alta';
  responsable?: string;
};

export default function CasoForm({ onCreated, editing, onUpdated, onFinishEdit }: {
  onCreated?: (c: Caso) => void;
  editing?: Caso | null;
  onUpdated?: (c: Caso) => void;
  onFinishEdit?: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("nuevo");
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>("media");
  const [responsable, setResponsable] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editing) {
      setNombre(editing.nombre || "");
      setDescripcion(editing.descripcion || "");
      setEstado(editing.estado || "nuevo");
      setPrioridad(editing.prioridad || "media");
      setResponsable(editing.responsable || "");
    } else {
      setNombre("");
      setDescripcion("");
      setEstado("nuevo");
      setPrioridad("media");
      setResponsable("");
    }
  }, [editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!nombre.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }
    if (!estado) {
      setFormError("El estado es obligatorio");
      return;
    }
    if (!prioridad) {
      setFormError("La prioridad es obligatoria");
      return;
    }
    setLoading(true);
    const token = getToken(); if (!token) return setFormError("No autorizado");

    try {
      if (editing && editing.id) {
        const res = await fetch(`${API_URL}/casos/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nombre, descripcion, estado, prioridad, responsable })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al actualizar");
        onUpdated && onUpdated(data);
        onFinishEdit && onFinishEdit();
      } else {
        const res = await fetch(`${API_URL}/casos`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nombre, descripcion, estado, prioridad, responsable })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al crear");
        onCreated && onCreated(data);
      }
      setNombre(""); setDescripcion(""); setEstado("nuevo"); setPrioridad("media"); setResponsable("");
    } catch (e: any) {
      setFormError(e.message || "Error inesperado");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg mb-6 border border-purple-100 dark:border-gray-700 backdrop-blur">
      <div className="grid grid-cols-1 gap-4">
        {formError && (
          <div className="mb-2 flex items-center justify-center">
            <span className="inline-flex items-center bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-2 rounded-lg font-semibold shadow">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
              {formError}
            </span>
          </div>
        )}
        <input
          placeholder="Nombre del caso"
          className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold transition"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          disabled={loading}
        />
        <input
          placeholder="Descripción"
          className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold transition"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          disabled={loading}
        />
        <div className="flex gap-4">
          <select
            className="flex-1 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
            value={estado}
            onChange={e => setEstado(e.target.value)}
            required
            disabled={loading}
          >
            <option value="nuevo">nuevo</option>
            <option value="en progreso">en progreso</option>
            <option value="cerrado">cerrado</option>
          </select>
          <select
            className="flex-1 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transition"
            value={prioridad}
            onChange={e => setPrioridad(e.target.value as 'baja' | 'media' | 'alta')}
            required
            disabled={loading}
          >
            <option value="baja">Prioridad baja</option>
            <option value="media">Prioridad media</option>
            <option value="alta">Prioridad alta</option>
          </select>
        </div>
        <input
          placeholder="Responsable (opcional)"
          className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold transition"
          value={responsable}
          onChange={e => setResponsable(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold p-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Spinner className="h-6 w-6" /> : (editing ? "Actualizar caso" : "Crear caso")}
        </button>
        {editing && (
          <button
            type="button"
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold p-3 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={onFinishEdit}
            disabled={loading}
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
