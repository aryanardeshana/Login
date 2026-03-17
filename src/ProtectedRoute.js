import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoute({ children }) {

    const user = Cookies.get("user");

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;