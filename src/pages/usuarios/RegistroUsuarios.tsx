import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiLock, FiX, FiCheckCircle } from "react-icons/fi";

export default function RegistroUsuarios() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [loadingVerificacion, setLoadingVerificacion] = useState(false);
  const [correoRegistrado, setCorreoRegistrado] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          correo: formData.correo,
          contrasena: formData.contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      setCorreoRegistrado(formData.correo);
      setShowModal(true);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoadingVerificacion(true);

    try {
      const response = await fetch(
        "http://localhost:3000/usuarios/verificar-codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: correoRegistrado,
            codigo: codigoVerificacion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código incorrecto");
      }

      setShowModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al verificar el código");
    } finally {
      setLoadingVerificacion(false);
    }
  };

  return (
    <>
      <div
        className="w-full min-h-screen flex items-center justify-center p-6"
        style={{
          background: "linear-gradient(to bottom, var(--color-bg), #fff)",
        }}
      >
        <div
          className="w-full max-w-4xl rounded-xl shadow-xl p-10 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            color: "var(--color-text)",
          }}
        >
          <h2
            className="text-3xl font-bold text-center mb-8 tracking-wide"
            style={{ color: "var(--color-text)" }}
          >
            Registro de Usuarios
          </h2>

          {error && !showModal && (
            <div
              className="mb-6 p-4 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid #ef4444",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { name: "nombre", label: "Nombre", icon: <FiUser /> },
              {
                name: "apellidoPaterno",
                label: "Apellido Paterno",
                icon: <FiUser />,
              },
              {
                name: "apellidoMaterno",
                label: "Apellido Materno",
                icon: <FiUser />,
              },
              {
                name: "correo",
                label: "Correo Electrónico",
                icon: <FiMail />,
                type: "email",
              },
              {
                name: "contrasena",
                label: "Contraseña",
                icon: <FiLock />,
                type: "password",
              },
              {
                name: "confirmarContrasena",
                label: "Confirmar Contraseña",
                icon: <FiLock />,
                type: "password",
              },
            ].map((field, i) => (
              <div
                key={i}
                className="flex items-center border-b-2 pb-2 transition-colors"
                style={{ borderColor: "var(--color-muted)" }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--color-primary)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--color-muted)")
                }
              >
                <div
                  className="text-xl mr-3"
                  style={{ color: "var(--color-muted)" }}
                >
                  {field.icon}
                </div>
                <input
                  type={field.type || "text"}
                  placeholder={field.label}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                  style={{
                    color: "var(--color-text)",
                    caretColor: "var(--color-primary)",
                  }}
                  required
                  disabled={loading}
                />
              </div>
            ))}

            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: loading
                    ? "var(--color-muted)"
                    : "var(--color-primary)",
                  color: "#fff",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-secondary)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary)";
                  }
                }}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>

            <div className="md:col-span-2 text-center mt-4">
              <p style={{ color: "var(--color-muted)" }}>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                  }}
                  disabled={loading}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <div
            className="w-full max-w-md rounded-xl shadow-2xl p-8"
            style={{
              backgroundColor: "#fff",
              color: "var(--color-text)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-2xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                Verificar Cuenta
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
                style={{ color: "var(--color-muted)" }}
              >
                <FiX />
              </button>
            </div>

            <p
              className="mb-6 text-center"
              style={{ color: "var(--color-muted)" }}
            >
              Hemos enviado un código de 6 dígitos a{" "}
              <strong style={{ color: "var(--color-text)" }}>
                {correoRegistrado}
              </strong>
            </p>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-center text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleVerificarCodigo}>
              <div
                className="flex items-center border-b-2 pb-2 mb-6 transition-colors"
                style={{ borderColor: "var(--color-muted)" }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--color-primary)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--color-muted)")
                }
              >
                <input
                  type="text"
                  placeholder="Ingrese código de 6 dígitos"
                  value={codigoVerificacion}
                  onChange={(e) => {
                    setCodigoVerificacion(e.target.value);
                    if (error) setError("");
                  }}
                  maxLength={6}
                  className="w-full bg-transparent outline-none text-center text-2xl tracking-widest"
                  style={{
                    color: "var(--color-text)",
                    caretColor: "var(--color-primary)",
                  }}
                  required
                  disabled={loadingVerificacion}
                />
              </div>

              <button
                type="submit"
                disabled={
                  loadingVerificacion || codigoVerificacion.length !== 6
                }
                className="w-full py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: loadingVerificacion
                    ? "var(--color-muted)"
                    : "var(--color-primary)",
                  color: "#fff",
                }}
                onMouseOver={(e) => {
                  if (!loadingVerificacion) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-secondary)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loadingVerificacion) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary)";
                  }
                }}
              >
                {loadingVerificacion ? "Verificando..." : "Verificar Código"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <div
            className="w-full max-w-md rounded-xl shadow-2xl p-8 text-center"
            style={{
              backgroundColor: "#fff",
              color: "var(--color-text)",
            }}
          >
            <div
              className="flex justify-center mb-6"
              style={{ color: "#10b981", fontSize: "64px" }}
            >
              <FiCheckCircle />
            </div>

            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              ¡Usuario Registrado Correctamente!
            </h3>

            <p className="mb-6" style={{ color: "var(--color-muted)" }}>
              Tu cuenta ha sido verificada exitosamente. Serás redirigido al
              inicio de sesión...
            </p>

            <div className="flex justify-center">
              <div
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--color-primary)" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
