import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notification";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {token && <Navbar />}
      {/* pb-16 adds bottom padding on mobile for tab bar */}
      <div className="bg-gray-100 min-h-screen pb-16 md:pb-0">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute><Feed /></PrivateRoute>
          } />
          <Route path="/profile/:id" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/explore" element={
            <PrivateRoute><Explore /></PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute><Notifications /></PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;