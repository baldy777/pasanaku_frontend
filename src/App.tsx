import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar, { SidebarItem } from "./components/Navbar";
import "./App.css";
import { Home, Users } from "lucide-react";

import VistaUsuarios from "./pages/usuarios/VistaUsuarios";
import RegistroUsuarios from "./pages/usuarios/RegistroUsuarios";
import InicioSesionUsuarios from "./pages/usuarios/login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial - Login */}
        <Route path="/" element={<InicioSesionUsuarios />} />
        <Route path="/registro" element={<RegistroUsuarios />} />

        {/* Rutas protegidas con sidebar */}
        <Route path="/*" element={
          <div className="flex">
            <Navbar>
              <SidebarItem icon={<Home />} text="Inicio" to="/inicio" />
              <SidebarItem icon={<Users />} text="Usuarios" to="/tabla-usuarios" />
            </Navbar>

            <main className="flex-1 ml-16 p-6">
              <Routes>
                <Route path="/inicio" element={<h1 className="text-black">Página de Inicio</h1>} />
                <Route path="/tabla-usuarios" element={<VistaUsuarios />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;