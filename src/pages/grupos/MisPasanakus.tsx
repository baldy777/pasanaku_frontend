import { useState, useEffect } from "react";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import {
  type Grupo,
  type Invitacion,
  EstadoInvitacion,
} from "../../types/grupos.types";
import { CardGrupo } from "../../components/componentsGrupos/CardGrupo";
import { ModalCrearGrupo } from "../../components/componentsGrupos/ModalCrearGrupo";

type Tab = "grupos" | "invitaciones";

const MisPasanakus = () => {
  const { token, user } = useAuth();
  const [tabActivo, setTabActivo] = useState<Tab>("grupos");
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const gruposRes = await fetch("http://localhost:3000/grupos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!gruposRes.ok) throw new Error("Error al cargar grupos");
      const gruposData = await gruposRes.json();
      setGrupos(gruposData);

      const invitacionesRes = await fetch(
        "http://localhost:3000/grupos/invitaciones",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!invitacionesRes.ok) throw new Error("Error al cargar invitaciones");
      const invitacionesData = await invitacionesRes.json();
      setInvitaciones(invitacionesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const responderInvitacion = async (
    invitacionId: number,
    aceptar: boolean
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/grupos/invitaciones/${invitacionId}/responder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ aceptar }),
        }
      );

      if (!response.ok) throw new Error("Error al responder invitación");

      await cargarDatos();
    } catch (err: any) {
      alert(err.message);
    }
  };

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
    <div className="flex flex-col w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Pasanakus</h1>
        <button
          onClick={() => setModalCrearOpen(true)}
          className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <FiPlus /> Crear Grupo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTabActivo("grupos")}
          className={`pb-3 px-4 font-semibold transition-colors ${
            tabActivo === "grupos"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Mis Grupos ({grupos.length})
        </button>
        <button
          onClick={() => setTabActivo("invitaciones")}
          className={`pb-3 px-4 font-semibold transition-colors relative ${
            tabActivo === "invitaciones"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Invitaciones
          {invitaciones.filter((i) => i.estado === EstadoInvitacion.PENDIENTE)
            .length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {
                invitaciones.filter(
                  (i) => i.estado === EstadoInvitacion.PENDIENTE
                ).length
              }
            </span>
          )}
        </button>
      </div>

      {tabActivo === "grupos" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grupos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No tienes grupos todavía
              </p>
              <button
                onClick={() => setModalCrearOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Crear mi primer grupo
              </button>
            </div>
          ) : (
            grupos.map((grupo) => <CardGrupo key={grupo.id} grupo={grupo} />)
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {invitaciones.filter((i) => i.estado === EstadoInvitacion.PENDIENTE)
            .length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No tienes invitaciones pendientes
              </p>
            </div>
          ) : (
            invitaciones
              .filter((i) => i.estado === EstadoInvitacion.PENDIENTE)
              .map((invitacion) => (
                <div
                  key={invitacion.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {invitacion.grupo.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Invitado por:{" "}
                        <span className="font-semibold">
                          {invitacion.usuarioInvitador.nombre}{" "}
                          {invitacion.usuarioInvitador.apellidoPaterno}
                        </span>
                      </p>
                      {invitacion.mensaje && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          "{invitacion.mensaje}"
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      Expira:{" "}
                      {new Date(
                        invitacion.fechaExpiracion
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => responderInvitacion(invitacion.id, true)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Aceptar
                    </button>
                    <button
                      onClick={() => responderInvitacion(invitacion.id, false)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FiX /> Rechazar
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Modal Crear Grupo */}
      <ModalCrearGrupo
        isOpen={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSuccess={cargarDatos}
      />
    </div>
  );
};

export default MisPasanakus;
