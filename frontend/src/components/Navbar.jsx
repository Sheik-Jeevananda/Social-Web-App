import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaHome, FaCompass, FaBell,
  FaUser, FaSignOutAlt
} from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/explore", icon: <FaCompass size={20} />, label: "Explore" },
    { to: "/notifications", icon: <FaBell size={20} />, label: "Alerts" },
    { to: `/profile/${user?._id}`, icon: <FaUser size={20} />, label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ========== DESKTOP TOP NAVBAR ========== */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center w-full">

          {/* Logo */}
          <div className="text-xl font-bold text-blue-500">
            📱 SocialApp
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 text-sm font-medium transition
                  ${isActive(link.to)
                    ? "text-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition"
            >
              <FaSignOutAlt size={18} /> Logout
            </button>
          </div>

        </div>
      </nav>

      {/* ========== MOBILE BOTTOM TAB BAR ========== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition
                ${isActive(link.to)
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
                }`}
            >
              {link.icon}
              <span className="text-xs">{link.label}</span>
            </Link>
          ))}

          {/* Logout on mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-1 text-red-500 hover:text-red-700 transition"
          >
            <FaSignOutAlt size={20} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom padding so content doesn't hide behind tab bar on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navbar;