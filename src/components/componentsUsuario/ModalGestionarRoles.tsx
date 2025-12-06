interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

interface ModalGestionarRolesProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: () => void;
  usuario: Usuario | null;
  roles: Rol[];
  rolesSeleccionados: number[];
  toggleRol: (rolId: number) => void;
}

const ModalGestionarRoles: React.FC<ModalGestionarRolesProps> = ({
  isOpen,
  onClose,
  onGuardar,
  usuario,
  roles,
  rolesSeleccionados,
  toggleRol,
}) => {
  if (!isOpen || !usuario) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestionar Roles
        </h2>
        <p className="text-gray-600 mb-6">
          {usuario.nombre} {usuario.apellidoPaterno}
        </p>

        <div className="space-y-3">
          {roles.map((rol) => (
            <label
              key={rol.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={rolesSeleccionados.includes(rol.id)}
                onChange={() => toggleRol(rol.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900">{rol.nombre}</p>
                <p className="text-sm text-gray-500">{rol.descripcion}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onGuardar}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Guardar Roles
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGestionarRoles;
