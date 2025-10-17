import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiLock, FiCalendar, FiMapPin } from "react-icons/fi"; // Iconos modernos

export default function RegistroUsuarios() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const nuevoUsuario = {
      id: Date.now(),
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      correo_electronico: formData.correo_electronico,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
    };

    usuariosGuardados.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      fecha_nacimiento: "",
      direccion: "",
      contraseña: "",
      confirmarContraseña: "",
    });

    navigate("/inicio");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-blue-100 p-6">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-wide">
          Registro de Usuarios
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiUser className="text-xl text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Apellido Paterno */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiUser className="text-xl text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Apellido Paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Apellido Materno */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiUser className="text-xl text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Apellido Materno"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Correo Electrónico */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiMail className="text-xl text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiCalendar className="text-xl text-gray-400 mr-3" />
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Dirección */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiMapPin className="text-xl text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiLock className="text-xl text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 pb-2 transition-colors">
            <FiLock className="text-xl text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Confirme Contraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          {/* Botón */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white w-full py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md"
            >
              Registrarse
            </button>
          </div>

          {/* Iniciar sesión */}
          <div className="md:col-span-2 text-center mt-4">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-purple-600 hover:underline font-semibold"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
