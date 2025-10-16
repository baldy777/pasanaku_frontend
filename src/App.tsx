import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar, { SidebarItem } from "./components/Navbar";
import "./App.css";
import { Home, Users } from "lucide-react";

import VistaUsuarios from "./pages/usuarios/VistaUsuarios";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Barra lateral */}
        <Navbar>
          <SidebarItem icon={<Home />} text="Inicio" to="/" />
          <SidebarItem icon={<Users />} text="Usuarios" to="/tabla-usuarios" />
        </Navbar>

        {/* Contenido principal */}
        <main className="flex-1 ml-16 p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-black">Página de Inicio</h1>} />
            <Route path="/tabla-usuarios" element={<VistaUsuarios />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
