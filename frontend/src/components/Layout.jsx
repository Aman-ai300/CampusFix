import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/login"); };
  return <div className="app-shell"><header className="topbar"><Link className="brand" to="/"><span className="brand-mark">C</span> campusfix</Link><nav><NavLink to="/">Explore issues</NavLink>{user?.role === "admin" && <span className="role-tag">Admin</span>}</nav><div className="user-menu"><span>{user?.name} <small>· {user?.role}</small></span><button className="button button-quiet button-small" onClick={signOut}>Sign out</button></div></header><main className="main-content"><Outlet /></main><footer>CampusFix <span>·</span> Better campus, together.</footer></div>;
}
