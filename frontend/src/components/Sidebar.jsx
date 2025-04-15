import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/"; // Redirection vers la landing page
  };
  

  const navItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-2 py-2 rounded-md transition ${
        isActive(to) ? "text-blue-600 font-semibold" : "hover:text-blue-500 text-gray-700"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </Link>
  );

  return (

<aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md flex flex-col justify-between py-6 px-4 font-sans z-50">
      {/* Logo */}
      <div>
        <div className="flex items-center mb-12 px-2">
          <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">Accessly</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4 text-[15px] font-medium">
          {navItem(
            "/dashboard",
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-3h.01M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"/></svg>,
            "Dashboard"
          )}
          {navItem(
            "/profils",
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
            "Profils publics"
          )}
          {navItem(
            "/objets-connectes",
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zM5 10h14M9 3h6a2 2 0 012 2v3H7V5a2 2 0 012-2z"/></svg>,
            "Objets connectés"
          )}
          {navItem(
            "/valider-objets",
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>,
            "À valider"
          )}
          {navItem(
            "/rapport",
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 3h10v18H3V9l8-6z"/></svg>,
            "Rapport"
          )}
        </nav>
      </div>

      {/* Déconnexion */}
      <div className="mt-10 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition text-[15px]"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
