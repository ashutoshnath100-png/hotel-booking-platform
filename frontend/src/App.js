import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Hotels from "./pages/Hotels";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTE */}
        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;