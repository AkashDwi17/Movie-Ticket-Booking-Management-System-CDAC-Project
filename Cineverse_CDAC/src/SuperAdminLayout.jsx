import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function SuperAdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle =
    "block px-4 py-2 rounded hover:bg-slate-800 text-slate-300";
  const activeStyle = "bg-slate-800 text-white";

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      <aside className="w-64 border-r border-slate-800 p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">SUPERADMIN</h2>

        <NavLink to="/superadmin" end className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Dashboard
        </NavLink>

        <NavLink to="/superadmin/users" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Users
        </NavLink>

        <NavLink to="/superadmin/admins" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Manage Admins
        </NavLink>

        <button onClick={logout} className="mt-6 w-full bg-red-600 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
