import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

export default function InicioSesionUsuarios() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          contrasena: contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      login(data.token, data.usuario);

      navigate("/app/inicio");
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(to bottom, var(--color-bg), #fff)",
      }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-xl p-10 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          color: "var(--color-text)",
        }}
      >
        <h2
          className="text-3xl font-bold text-center mb-8 tracking-wide"
          style={{ color: "var(--color-text)" }}
        >
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="flex items-center border-b-2 pb-2 transition-colors"
            style={{
              borderColor: "var(--color-muted)",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-primary)")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-muted)")
            }
          >
            <FiMail
              className="text-xl mr-3"
              style={{ color: "var(--color-muted)" }}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full bg-transparent outline-none"
              style={{
                color: "var(--color-text)",
                caretColor: "var(--color-primary)",
              }}
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={loading}
            />
          </div>

          <div
            className="flex items-center border-b-2 pb-2 transition-colors"
            style={{
              borderColor: "var(--color-muted)",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-primary)")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-muted)")
            }
          >
            <FiLock
              className="text-xl mr-3"
              style={{ color: "var(--color-muted)" }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-transparent outline-none"
              style={{
                color: "var(--color-text)",
                caretColor: "var(--color-primary)",
              }}
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid #ef4444",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex justify-center mt-6">
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
              {loading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p style={{ color: "var(--color-muted)" }}>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/registro")}
                className="font-semibold"
                style={{
                  color: "var(--color-primary)",
                  textDecoration: "underline",
                }}
                disabled={loading}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
