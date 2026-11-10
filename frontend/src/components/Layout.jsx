
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Campus building"
  >
    <path
      d="M3 21H21M5 21V8L12 3L19 8V21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11H10M14 11H15M9 15H10M14 15H15M10 21V18H14V21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
</span>
          <span>CampusFix</span>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <span className="nav-symbol">▤</span>
            Issues
          </NavLink>

          <NavLink to="/report">
            <span className="nav-symbol">＋</span>
            Report an issue
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>

          <button
            className="signout-button"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <span>Workspace</span>
          <span className="header-divider">/</span>
          <strong>Campus issues</strong>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer>CampusFix · Campus issue management</footer>
      </div>
    </div>
  );
}
