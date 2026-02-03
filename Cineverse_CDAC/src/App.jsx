import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Login from "./Login.jsx";
import Carousel from "./Carousel.jsx";
import CardComponent from "./CardComponent.jsx";
import MovieDetails from "./MovieDetails.jsx";
import Booking from "./Booking.jsx";
import SeatLayout from "./SeatLayout.jsx";
import Payment from "./Payment.jsx";
import PaymentSuccess from "./PaymentSuccess.jsx";
import Confirmation from "./Confirmation.jsx";
import NotFound from "./Errorpage.jsx";

import AdminLayout from "./AdminLayout.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import MoviesPage from "./MoviesPage.jsx";
import ShowsPage from "./ShowsPage.jsx";
import TheatrePage from "./TheatrePage.jsx";
import BookingsPage from "./BookingsPage.jsx";
import UsersPage from "./UsersPage.jsx"; // SUPER ADMIN PAGE

// ADMIN ROUTE PROTECTOR

function AdminRoute({ children }) {
  const token = localStorage.getItem("cineverse_token");
  const role = localStorage.getItem("cineverse_role");

  if (!token) return <Navigate to="/login" replace />;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// PUBLIC LAYOUT (with navbar/footer)
function PublicLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Outlet />
      {!isAdmin && <Footer />}
    </>
  );
}

// MAIN APP ROUTER
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<><Carousel /><CardComponent /></>} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/seat/:id" element={<SeatLayout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Admin Modules */}
          <Route path="movies" element={<MoviesPage />} />
          <Route path="shows" element={<ShowsPage />} />
          <Route path="theatres" element={<TheatrePage />} />
          <Route path="bookings" element={<BookingsPage />} />

          {/*  ONLY SUPER_ADMIN CAN ACCESS USERS */}
          <Route
            path="users"
            element={
              localStorage.getItem("cineverse_role") === "SUPER_ADMIN"
                ? <UsersPage />
                : <Navigate to="/admin" replace />
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
