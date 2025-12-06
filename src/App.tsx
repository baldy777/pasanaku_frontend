import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import "./index.css";
import { Home, Users, LogOut } from "lucide-react";

import VistaUsuarios from "./pages/usuarios/VistaUsuarios";
import RegistroUsuarios from "./pages/usuarios/RegistroUsuarios";
import InicioSesionUsuarios from "./pages/usuarios/login";
import LandingPage from "./pages/common/LadingPage";
import MisPasanakus from "./pages/grupos/MisPasanakus";
import GrupoDetalle from "./pages/grupos/GrupoDetalle";
import HomeDashboard from "./pages/common/homeDashboard";
import { FaPeopleGroup } from "react-icons/fa6";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

function AppLayout() {
  const { logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded}>
        <SidebarItem icon={<Home />} text="Inicio" to="/app/inicio" />

        <SidebarItem
          icon={<FaPeopleGroup />}
          text="Grupos"
          to="/app/mis-grupos"
        />

        <SidebarItem
          icon={<Users />}
          text="Usuarios"
          to="/app/tabla-usuarios"
          requireRole="Administrador"
        />

        <SidebarItem icon={<LogOut />} text="Cerrar Sesión" onClick={logout} />
      </Sidebar>

      <main
        className={`flex-1 transition-all duration-300 bg-gray-50 p-6`}
        style={{
          marginLeft: sidebarExpanded ? 256 : 64, // 64px o 16rem según Tailwind
        }}
      >
        <Routes>
          <Route path="inicio" element={<HomeDashboard />} />
          <Route
            path="tabla-usuarios"
            element={
              <RoleProtectedRoute allowedRoles={["Administrador"]}>
                <VistaUsuarios />
              </RoleProtectedRoute>
            }
          />
          <Route path="mis-grupos" element={<MisPasanakus />} />
          <Route path="grupos/:id" element={<GrupoDetalle />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<InicioSesionUsuarios />} />
          <Route path="/registro" element={<RegistroUsuarios />} />

          {/* Rutas protegidas */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
