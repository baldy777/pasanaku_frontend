import { useEffect, useState } from "react";
import "../../index.css";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import ModalEditarUsuario from "../../components/componentsUsuario/ModalEditarUsuario";
import ModalGestionarRoles from "../../components/componentsUsuario/ModalGestionarRoles";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono?: string;
  ci?: string;
  correo: string;
  verificado: boolean;
  roles: Array<{
    id: number;
    rol: {
      id: number;
      nombre: string;
    };
  }>;
}

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

const VistaUsuarios = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalRolesIsOpen, setModalRolesIsOpen] = useState(false);
  const [editarUsuario, setEditarUsuario] = useState<Usuario | null>(null);
  const [usuarioParaRoles, setUsuarioParaRoles] = useState<Usuario | null>(
    null
  );
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    ci: "",
  });

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar usuarios");

      const data = await response.json();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch("http://localhost:3000/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar roles");

      const data = await response.json();
      setRoles(data);
    } catch (err: any) {
      console.error("Error al cargar roles:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const abrirEditar = (usuario: Usuario) => {
    setEditarUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      telefono: usuario.telefono || "",
      ci: usuario.ci || "",
    });
    setModalIsOpen(true);
  };

  const guardarUsuario = async () => {
    if (!editarUsuario) return;

    try {
      const response = await fetch(
        `http://localhost:3000/usuarios/${editarUsuario.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar usuario");

      await cargarUsuarios();
      setModalIsOpen(false);
      setEditarUsuario(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!window.confirm("¿Estás seguro de desactivar este usuario?")) return;

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar usuario");

      await cargarUsuarios();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const abrirModalRoles = (usuario: Usuario) => {
    setUsuarioParaRoles(usuario);
    setRolesSeleccionados(usuario.roles.map((r) => r.rol.id));
    setModalRolesIsOpen(true);
  };

  const guardarRoles = async () => {
    if (!usuarioParaRoles) return;

    try {
      const rolesActuales = usuarioParaRoles.roles.map((r) => r.rol.id);

      const rolesAgregar = rolesSeleccionados.filter(
        (id) => !rolesActuales.includes(id)
      );

      const rolesQuitar = rolesActuales.filter(
        (id) => !rolesSeleccionados.includes(id)
      );

      for (const rolId of rolesAgregar) {
        await fetch(
          `http://localhost:3000/usuarios/${usuarioParaRoles.id}/roles/${rolId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      for (const rolId of rolesQuitar) {
        await fetch(
          `http://localhost:3000/usuarios/${usuarioParaRoles.id}/roles/${rolId}/quitar`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await cargarUsuarios();
      setModalRolesIsOpen(false);
      setUsuarioParaRoles(null);
    } catch (err: any) {
      alert("Error al actualizar roles: " + err.message);
    }
  };

  const toggleRol = (rolId: number) => {
    setRolesSeleccionados((prev) =>
      prev.includes(rolId)
        ? prev.filter((id) => id !== rolId)
        : [...prev, rolId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50 p-4">
      {/* Título */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full max-w-[95vw] mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">
          Gestión de Usuarios
        </h1>
      </div>

      {error && (
        <div className="w-full max-w-[95vw] mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="w-full h-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-auto">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  CI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {u.nombre} {u.apellidoPaterno} {u.apellidoMaterno}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.correo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.ci || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.telefono || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.verificado
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {u.verificado ? "Verificado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {r.rol.nombre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex gap-3">
                      <button
                        onClick={() => abrirEditar(u)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        title="Editar usuario"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => abrirModalRoles(u)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        title="Gestionar roles"
                      >
                        <FaUserPlus className="text-xl" />
                      </button>
                      {/* <button
                        onClick={() => eliminarUsuario(u.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Eliminar usuario"
                      >
                        <RiDeleteBinFill className="text-xl" />
                      </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ModalEditarUsuario
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onGuardar={guardarUsuario}
        formData={formData}
        setFormData={setFormData}
      />

      <ModalGestionarRoles
        isOpen={modalRolesIsOpen}
        onClose={() => setModalRolesIsOpen(false)}
        onGuardar={guardarRoles}
        usuario={usuarioParaRoles}
        roles={roles}
        rolesSeleccionados={rolesSeleccionados}
        toggleRol={toggleRol}
      />
    </div>
  );
};

export default VistaUsuarios;
