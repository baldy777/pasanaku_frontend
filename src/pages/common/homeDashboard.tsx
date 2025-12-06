import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import {
  type Grupo,
  type Aporte,
  EstadoAporte,
} from "../../types/grupos.types";

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [misAportes, setMisAportes] = useState<Aporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const gruposRes = await fetch("http://localhost:3000/grupos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (gruposRes.ok) {
        const gruposData = await gruposRes.json();
        setGrupos(gruposData);
      }

      const aportesRes = await fetch("http://localhost:3000/grupos/aportes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (aportesRes.ok) {
        const aportesData = await aportesRes.json();
        setMisAportes(aportesData);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const gruposActivos = grupos.filter((g) => g.estado === "activo").length;

  const aportesPendientes = misAportes.filter(
    (a) =>
      a.estado === EstadoAporte.PENDIENTE || a.estado === EstadoAporte.ATRASADO
  );

  const proximoAporte = aportesPendientes.sort(
    (a, b) =>
      new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()
  )[0];

  const totalAportado = misAportes
    .filter((a) => a.estado === EstadoAporte.PAGADO)
    .reduce((sum, a) => sum + parseFloat(a.monto.toString()), 0);

  const aportesAtrasados = misAportes.filter(
    (a) => a.estado === EstadoAporte.ATRASADO
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-gray-600">Aquí tienes un resumen de tus pasanakus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FiUsers size={24} />
            </div>
            <FiTrendingUp className="text-white/50" size={20} />
          </div>
          <p className="text-white/80 text-sm mb-1">Grupos Activos</p>
          <p className="text-4xl font-bold">{gruposActivos}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FiCalendar size={24} />
            </div>
            {aportesAtrasados > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {aportesAtrasados}
              </span>
            )}
          </div>
          <p className="text-white/80 text-sm mb-1">Próximo Aporte</p>
          {proximoAporte ? (
            <>
              <p className="text-2xl font-bold">Bs. {proximoAporte.monto}</p>
              <p className="text-white/70 text-xs mt-1">
                {new Date(proximoAporte.fechaLimite).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-xl font-semibold">Sin aportes pendientes</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FiDollarSign size={24} />
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Total Aportado</p>
          <p className="text-4xl font-bold">Bs. {totalAportado.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FiCalendar size={24} />
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Aportes Pendientes</p>
          <p className="text-4xl font-bold">{aportesPendientes.length}</p>
        </div>
      </div>

      {aportesAtrasados > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold">¡Atención!</span> Tienes{" "}
                {aportesAtrasados} aporte{aportesAtrasados > 1 ? "s" : ""}{" "}
                atrasado{aportesAtrasados > 1 ? "s" : ""}.{" "}
                <button
                  onClick={() => navigate("/app/mis-grupos")}
                  className="underline font-semibold"
                >
                  Ver ahora
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mis Grupos</h2>
          <button
            onClick={() => navigate("/app/mis-grupos")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            Ver todos →
          </button>
        </div>

        {grupos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tienes grupos todavía</p>
            <button
              onClick={() => navigate("/app/mis-grupos")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Crear mi primer grupo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupos.slice(0, 3).map((grupo) => (
              <div
                key={grupo.id}
                onClick={() => navigate(`/app/grupos/${grupo.id}`)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300"
              >
                <h3 className="font-bold text-gray-900 mb-2">{grupo.nombre}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {grupo.miembros.length}/{grupo.cantidadMiembros} miembros
                  </span>
                  <span className="text-green-600 font-semibold">
                    Bs. {grupo.montoAporte}
                  </span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      grupo.estado === "activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {grupo.estado === "activo" ? "Activo" : "Finalizado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {aportesPendientes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Aportes Pendientes
          </h2>
          <div className="space-y-3">
            {aportesPendientes.slice(0, 5).map((aporte) => (
              <div
                key={aporte.id}
                className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                  aporte.estado === EstadoAporte.ATRASADO
                    ? "bg-red-50 border-red-300"
                    : "bg-yellow-50 border-yellow-300"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Periodo #{aporte.numeroPeriodo} - Bs. {aporte.monto}
                  </p>
                  <p className="text-sm text-gray-600">
                    Vence: {new Date(aporte.fechaLimite).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      aporte.estado === EstadoAporte.ATRASADO
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {aporte.estado === EstadoAporte.ATRASADO
                      ? "Atrasado"
                      : "Pendiente"}
                  </span>
                  <button
                    onClick={() => navigate("/app/mis-grupos")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Pagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
