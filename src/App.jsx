import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import Footer from "./components/Footer";
import "./styles/app.css";
import CheckoutPage from "./pages/CheckoutPage";
import Services from "./pages/Services";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/services" element={<Services />}></Route>
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
