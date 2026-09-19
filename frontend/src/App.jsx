import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import FindParking from "./pages/FindParking";
import ParkingDetails from "./pages/ParkingDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-parking" element={<FindParking />} />
        <Route path="/parking/:id" element={<ParkingDetails />} />
        <Route path="/parking/:id/book" element={<ProtectedRoute role="user" />} >
          <Route index element={<Booking />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute role="user" />} >
          <Route index element={<UserDashboard />} />
        </Route>
        <Route path="/owner/dashboard" element={<ProtectedRoute role="owner" />} >
          <Route index element={<OwnerDashboard />} />
        </Route>
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Compatibility redirects for the original ParkEase routes */}
        <Route path="/user-login" element={<Navigate to="/login" replace />} />
        <Route path="/owner-login" element={<Navigate to="/login" replace />} />
        <Route path="/user-register" element={<Navigate to="/register" replace />} />
        <Route path="/owner-register" element={<Navigate to="/register" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}