import { useNavigate } from "react-router-dom";
import { type Grupo, RolMiembro } from "../../types/grupos.types";
import { useAuth } from "../../hooks/useAuth";

interface CardGrupoProps {
  grupo: Grupo;
}

export const CardGrupo = ({ grupo }: CardGrupoProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const miMiembro = grupo.miembros.find((m) => m.usuarioId === user?.id);
  const miRol = miMiembro?.rol;

  const miembrosActuales = grupo.miembros.length;
  const progreso = (miembrosActuales / grupo.cantidadMiembros) * 100;
  const grupoCompleto = miembrosActuales === grupo.cantidadMiembros;

  return (
    <div
      onClick={() => navigate(`/app/grupos/${grupo.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-400"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {grupo.nombre}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {grupo.descripcion || "Sin descripción"}
          </p>
        </div>

        {miRol && (
          <span
            className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              miRol === RolMiembro.ENCARGADO
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {miRol}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Monto</p>
          <p className="text-lg font-bold text-green-600">
            Bs. {grupo.montoAporte}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Frecuencia</p>
          <p className="text-sm font-semibold text-gray-800 capitalize">
            {grupo.frecuencia}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-600">Miembros</p>
          <p className="text-xs font-semibold text-gray-700">
            {miembrosActuales}/{grupo.cantidadMiembros}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              grupoCompleto ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            grupo.estado === "activo"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {grupo.estado === "activo" ? "Activo" : "Finalizado"}
        </span>

        {grupo.turnosSorteados ? (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Turno {grupo.turnoActual} en curso
          </span>
        ) : grupoCompleto ? (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            Listo para sortear
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            Esperando miembros
          </span>
        )}
      </div>
    </div>
  );
};
