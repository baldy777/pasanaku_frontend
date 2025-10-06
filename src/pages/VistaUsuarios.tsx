import { useState } from "react";
import Modal from "react-modal";
import "../App.css";

Modal.setAppElement("#root");

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  aporte: string;
}

const VistaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Carlos",
      apellido: "Pérez",
      telefono: "123456789",
      aporte: "100",
    },
    {
      id: 2,
      nombre: "Ana",
      apellido: "López",
      telefono: "987654321",
      aporte: "150",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editarUsuario, setEditarUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    aporte: "",
  });

  const abrirAgregar = () => {
    setEditarUsuario(null);
    setFormData({ nombre: "", apellido: "", telefono: "", aporte: "" });
    setModalIsOpen(true);
  };

  const abrirEditar = (usuario: Usuario) => {
    setEditarUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono,
      aporte: usuario.aporte,
    });
    setModalIsOpen(true);
  };

  const guardarUsuario = () => {
    if (editarUsuario) {
      // Editar
      setUsuarios(
        usuarios.map((u) =>
          u.id === editarUsuario.id ? { ...u, ...formData } : u
        )
      );
    } else {
      // Agregar
      const nuevo: Usuario = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        ...formData,
      };
      setUsuarios([...usuarios, nuevo]);
    }
    setModalIsOpen(false);
  };

  // Eliminar usuario
  const eliminarUsuario = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
        Vista de Usuarios
      </h1>
      <button
        onClick={abrirAgregar}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Agregar Usuario
      </button>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aporte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.telefono}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.aporte}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => abrirEditar(u)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      /* modals */
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Usuario Modal"
        className="bg-white rounded-lg max-w-md mx-auto mt-20 p-6 outline-none shadow-lg"
        overlayClassName="fixed inset-0  bg-opacity-50 flex items-start justify-center"
      >
        <h2 className="text-xl font-bold mb-4 text-black">
          {editarUsuario ? "Editar Usuario" : "Agregar Usuario"}
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            className="border w-full px-2 py-1 rounded text-black"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={(e) =>
              setFormData({ ...formData, apellido: e.target.value })
            }
            className="border w-full px-2 py-1 rounded text-black"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            className="border w-full px-2 py-1 rounded text-black"
          />
          <input
            type="text"
            placeholder="Aporte"
            value={formData.aporte}
            onChange={(e) =>
              setFormData({ ...formData, aporte: e.target.value })
            }
            className="border w-full px-2 py-1 rounded text-black"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={guardarUsuario}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            {editarUsuario ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VistaUsuarios;
