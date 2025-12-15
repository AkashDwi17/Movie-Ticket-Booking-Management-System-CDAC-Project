import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = "block px-4 py-2 rounded hover:bg-slate-800 text-slate-300";
  const activeStyle = "bg-slate-800 text-white";

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      <aside className="w-60 border-r border-slate-800 p-4 space-y-3">

        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <NavLink to="/admin" end className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/movies" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Movies
        </NavLink>

        <NavLink to="/admin/shows" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Shows
        </NavLink>

        <NavLink to="/admin/theatres" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Theatres
        </NavLink>

        <NavLink to="/admin/bookings" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Bookings
        </NavLink>

        {/* ⭐ ONLY SUPER_ADMIN CAN SEE THIS */}
        {localStorage.getItem("cineverse_role") === "SUPER_ADMIN" && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            Manage Users
          </NavLink>
        )}

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
