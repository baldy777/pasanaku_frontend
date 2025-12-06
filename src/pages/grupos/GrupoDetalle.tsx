import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUserPlus,
  FiEdit,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiShuffle,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import {
  type Grupo,
  RolMiembro,
  EstadoTurno,
  EstadoAporte,
  type Aporte,
} from "../../types/grupos.types";
import { ModalInvitarMiembro } from "../../components/componentsGrupos/ModalInvitarMiembro";
import { ModalPagarAporte } from "../../components/componentsGrupos/ModalPagarAporte";

type Tab = "info" | "miembros" | "turnos" | "aportes";

const GrupoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabActivo, setTabActivo] = useState<Tab>("info");
  const [modalInvitarOpen, setModalInvitarOpen] = useState(false);
  const [modalPagarOpen, setModalPagarOpen] = useState(false);
  const [aporteSeleccionado, setAporteSeleccionado] = useState<Aporte | null>(
    null
  );

  const miMiembro = grupo?.miembros.find((m) => m.usuarioId === user?.id);
  const soyEncargado = miMiembro?.rol === RolMiembro.ENCARGADO;

  useEffect(() => {
    cargarGrupo();
  }, [id]);

  const cargarGrupo = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/grupos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar grupo");

      const data = await response.json();
      setGrupo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortearTurnos = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de sortear los turnos? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/grupos/${id}/sortear-turnos`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al sortear turnos");
      }

      await cargarGrupo();
      alert("¡Turnos sorteados exitosamente!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const abrirModalPagar = (aporte: Aporte) => {
    setAporteSeleccionado(aporte);
    setModalPagarOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando grupo...</p>
        </div>
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Grupo no encontrado"}</p>
          <button
            onClick={() => navigate("/app/mis-grupos")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Volver a mis grupos
          </button>
        </div>
      </div>
    );
  }

  const grupoCompleto = grupo.miembros.length === grupo.cantidadMiembros;

  const misAportes = miMiembro?.aportes || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      <button
        onClick={() => navigate("/app/mis-grupos")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <FiArrowLeft /> Volver a mis grupos
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {grupo.nombre}
              </h1>
              {miMiembro && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    soyEncargado
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {miMiembro.rol}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">
              {grupo.descripcion || "Sin descripción"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-xs text-gray-500">Miembros</p>
                <p className="text-sm font-semibold text-gray-800">
                  {grupo.miembros.length}/{grupo.cantidadMiembros}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    grupo.estado === "activo"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {grupo.estado === "activo" ? "Activo" : "Finalizado"}
                </span>
              </div>
            </div>
          </div>

          {soyEncargado && (
            <div className="flex gap-2 ml-4">
              {!grupo.turnosSorteados && grupoCompleto && (
                <button
                  onClick={sortearTurnos}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <FiShuffle /> Sortear Turnos
                </button>
              )}
              {!grupoCompleto && (
                <button
                  onClick={() => setModalInvitarOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <FiUserPlus /> Invitar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setTabActivo("info")}
          className={`pb-3 px-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            tabActivo === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiEdit /> Información
        </button>
        <button
          onClick={() => setTabActivo("miembros")}
          className={`pb-3 px-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            tabActivo === "miembros"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiUsers /> Miembros ({grupo.miembros.length})
        </button>
        <button
          onClick={() => setTabActivo("turnos")}
          className={`pb-3 px-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            tabActivo === "turnos"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiCalendar /> Turnos
        </button>
        <button
          onClick={() => setTabActivo("aportes")}
          className={`pb-3 px-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            tabActivo === "aportes"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiDollarSign /> Mis Aportes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        {tabActivo === "info" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Detalles del Grupo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Fecha de Inicio
                </label>
                <p className="text-gray-900">
                  {grupo.fechaInicio
                    ? new Date(grupo.fechaInicio).toLocaleDateString()
                    : "No iniciado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Turno Actual
                </label>
                <p className="text-gray-900">
                  {grupo.turnosSorteados
                    ? `Turno ${grupo.turnoActual}`
                    : "Sin sortear"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Estado
                </label>
                <p className="text-gray-900 capitalize">{grupo.estado}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Progreso
                </label>
                <p className="text-gray-900">
                  {grupo.miembros.length} de {grupo.cantidadMiembros} miembros
                </p>
              </div>
            </div>
          </div>
        )}

        {tabActivo === "miembros" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Miembros del Grupo
            </h3>
            <div className="space-y-3">
              {grupo.miembros.map((miembro) => (
                <div
                  key={miembro.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {miembro.usuario.nombre} {miembro.usuario.apellidoPaterno}{" "}
                      {miembro.usuario.apellidoMaterno}
                    </p>
                    <p className="text-sm text-gray-600">
                      {miembro.usuario.correo}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      miembro.rol === RolMiembro.ENCARGADO
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {miembro.rol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabActivo === "turnos" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Orden de Turnos
            </h3>
            {!grupo.turnosSorteados ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Los turnos aún no han sido sorteados
                </p>
                {soyEncargado && grupoCompleto && (
                  <button
                    onClick={sortearTurnos}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Sortear Turnos Ahora
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {grupo.turnos
                  .sort((a, b) => a.numeroTurno - b.numeroTurno)
                  .map((turno) => (
                    <div
                      key={turno.id}
                      className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                        turno.estado === EstadoTurno.COMPLETADO
                          ? "bg-green-50 border-green-300"
                          : turno.estado === EstadoTurno.EN_PROCESO
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Turno {turno.numeroTurno} -{" "}
                          {turno.miembro.usuario.nombre}{" "}
                          {turno.miembro.usuario.apellidoPaterno}
                        </p>
                        <p className="text-sm text-gray-600">
                          Fecha prevista:{" "}
                          {turno.fechaPrevista
                            ? new Date(turno.fechaPrevista).toLocaleDateString()
                            : "Por definir"}
                        </p>
                        {turno.fechaEjecucion && (
                          <p className="text-sm text-green-600">
                            Completado el:{" "}
                            {new Date(
                              turno.fechaEjecucion
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          turno.estado === EstadoTurno.COMPLETADO
                            ? "bg-green-100 text-green-700"
                            : turno.estado === EstadoTurno.EN_PROCESO
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {turno.estado === EstadoTurno.COMPLETADO
                          ? "Completado"
                          : turno.estado === EstadoTurno.EN_PROCESO
                          ? "En Proceso"
                          : "Pendiente"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {tabActivo === "aportes" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Mis Aportes
            </h3>
            {misAportes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No tienes aportes registrados todavía
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {misAportes.map((aporte: Aporte) => (
                  <div
                    key={aporte.id}
                    className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                      aporte.estado === EstadoAporte.PAGADO
                        ? "bg-green-50 border-green-300"
                        : aporte.estado === EstadoAporte.ATRASADO
                        ? "bg-red-50 border-red-300"
                        : "bg-yellow-50 border-yellow-300"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Periodo #{aporte.numeroPeriodo} - Bs. {aporte.monto}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fecha límite:{" "}
                        {new Date(aporte.fechaLimite).toLocaleDateString()}
                      </p>
                      {aporte.fechaPago && (
                        <p className="text-sm text-green-600">
                          Pagado el:{" "}
                          {new Date(aporte.fechaPago).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          aporte.estado === EstadoAporte.PAGADO
                            ? "bg-green-100 text-green-700"
                            : aporte.estado === EstadoAporte.ATRASADO
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {aporte.estado === EstadoAporte.PAGADO
                          ? "Pagado"
                          : aporte.estado === EstadoAporte.ATRASADO
                          ? "Atrasado"
                          : "Pendiente"}
                      </span>
                      {aporte.estado === EstadoAporte.PENDIENTE && (
                        <button
                          onClick={() => abrirModalPagar(aporte)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                          Pagar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalInvitarMiembro
        isOpen={modalInvitarOpen}
        onClose={() => setModalInvitarOpen(false)}
        grupoId={parseInt(id!)}
        miembrosActuales={grupo.miembros.map((m) => m.usuarioId)}
        onSuccess={cargarGrupo}
      />

      <ModalPagarAporte
        isOpen={modalPagarOpen}
        onClose={() => {
          setModalPagarOpen(false);
          setAporteSeleccionado(null);
        }}
        aporte={aporteSeleccionado}
        onSuccess={cargarGrupo}
      />
    </div>
  );
};

export default GrupoDetalle;
