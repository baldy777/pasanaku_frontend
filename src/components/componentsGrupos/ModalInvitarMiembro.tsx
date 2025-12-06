import { useState, useEffect } from "react";
import { FiX, FiSearch, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

interface ModalInvitarMiembroProps {
  isOpen: boolean;
  onClose: () => void;
  grupoId: number;
  miembrosActuales: number[];
  onSuccess: () => void;
}

export const ModalInvitarMiembro = ({
  isOpen,
  onClose,
  grupoId,
  miembrosActuales,
  onSuccess,
}: ModalInvitarMiembroProps) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      cargarUsuarios();
    }
  }, [isOpen]);

  const cargarUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar usuarios");

      const data = await response.json();
      const usuariosFiltrados = data.filter(
        (u: Usuario) => !miembrosActuales.includes(u.id)
      );
      setUsuarios(usuariosFiltrados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellidoPaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellidoMaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleInvitar = async () => {
    if (!usuarioSeleccionado) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/grupos/${grupoId}/invitar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuarioId: usuarioSeleccionado.id,
            mensaje: mensaje || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al enviar invitación");
      }

      setUsuarioSeleccionado(null);
      setMensaje("");
      setBusqueda("");
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
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Invitar Miembro</h2>
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

        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar usuario por nombre o correo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {loadingUsuarios ? (
            <div className="text-center py-8 text-gray-500">
              Cargando usuarios...
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios disponibles
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                onClick={() => setUsuarioSeleccionado(usuario)}
                className={`p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                  usuarioSeleccionado?.id === usuario.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {usuario.nombre} {usuario.apellidoPaterno}{" "}
                      {usuario.apellidoMaterno}
                    </p>
                    <p className="text-sm text-gray-600">{usuario.correo}</p>
                  </div>
                  {usuarioSeleccionado?.id === usuario.id && (
                    <FiUserPlus className="text-blue-500" size={20} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {usuarioSeleccionado && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de invitación (opcional)
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje para acompañar tu invitación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleInvitar}
            disabled={!usuarioSeleccionado || loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar Invitación"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
