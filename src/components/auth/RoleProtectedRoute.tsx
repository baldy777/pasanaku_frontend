import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "var(--color-primary)" }}
          ></div>
          <p style={{ color: "var(--color-text)" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.some((role) =>
    user?.roles?.includes(role)
  );

  if (!hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Acceso Denegado
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 rounded-lg font-semibold"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
            }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
