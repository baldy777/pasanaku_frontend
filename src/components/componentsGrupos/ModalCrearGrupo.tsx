import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FrecuenciaGrupo } from "../../types/grupos.types";
import { useAuth } from "../../hooks/useAuth";

interface ModalCrearGrupoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCrearGrupo = ({
  isOpen,
  onClose,
  onSuccess,
}: ModalCrearGrupoProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    montoAporte: "",
    frecuencia: FrecuenciaGrupo.MENSUAL,
    cantidadMiembros: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/grupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || undefined,
          montoAporte: parseFloat(formData.montoAporte),
          frecuencia: formData.frecuencia,
          cantidadMiembros: parseInt(formData.cantidadMiembros),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear grupo");
      }

      setFormData({
        nombre: "",
        descripcion: "",
        montoAporte: "",
        frecuencia: FrecuenciaGrupo.MENSUAL,
        cantidadMiembros: "",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Grupo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Grupo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Amigos del trabajo"
              required
              minLength={3}
              maxLength={100}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe el propósito del grupo..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto de Aporte (Bs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.montoAporte}
              onChange={(e) =>
                setFormData({ ...formData, montoAporte: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 100"
              required
              min="1"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Aportes <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.frecuencia}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frecuencia: e.target.value as FrecuenciaGrupo,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value={FrecuenciaGrupo.SEMANAL}>Semanal</option>
              <option value={FrecuenciaGrupo.QUINCENAL}>Quincenal</option>
              <option value={FrecuenciaGrupo.MENSUAL}>Mensual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Miembros <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.cantidadMiembros}
              onChange={(e) =>
                setFormData({ ...formData, cantidadMiembros: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 5"
              required
              min="2"
              max="50"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Incluye al creador del grupo (mínimo 2, máximo 50)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Grupo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
