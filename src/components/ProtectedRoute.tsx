import { Navigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, loading } = useMe();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFEB]">
        <p className="text-sm text-[#567C8D] font-medium">Loading...</p>
      </div>
    );
  }

  if (!data?.me) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}