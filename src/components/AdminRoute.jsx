import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, loadingUser } = useAuth();

    if (loadingUser) return null;
    if (!user) return <Navigate to="/login" replace />;

    const roleName =
        user?.role?.name ||
        user?.role ||
        "";

    const isAdmin = String(roleName).toLowerCase() === "admin";

    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}
