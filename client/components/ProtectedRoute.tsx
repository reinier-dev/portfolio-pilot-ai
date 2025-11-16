import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
          <p className="text-muted-foreground">Verificando autenticación</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
