import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

export default function InicioSesionUsuarios() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioEncontrado = usuarios.find(
      (user) => user.correo_electronico === correo
    );

    if (!usuarioEncontrado) {
      setError("Correo no registrado");
      return;
    }

    if (usuarioEncontrado.contraseña !== contrasena) {
      setError("Contraseña incorrecta");
      return;
    }

    setError("");
    navigate("/inicio");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-wide">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 pb-2 transition-colors">
            <FiMail className="text-xl text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 pb-2 transition-colors">
            <FiLock className="text-xl text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          {/* Botón */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              Entrar
            </button>
          </div>

          {/* Registro */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/registro")}
                className="text-blue-600 hover:underline font-semibold"
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
