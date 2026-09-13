import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSkill from "./pages/AddSkill";
import AddWantedSkill from "./pages/AddWantedSkill";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import DeleteSkill from "./pages/DeleteSkill";
import CompleteSwap from "./pages/CompleteSwap";
import ReportUser from "./pages/ReportUser";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-skill" element={<PrivateRoute><AddSkill /></PrivateRoute>} />
          <Route path="/add-wanted" element={<PrivateRoute><AddWantedSkill /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
          <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/delete-skill" element={<PrivateRoute><DeleteSkill /></PrivateRoute>} />
          <Route path="/complete-swap/:requestId" element={<PrivateRoute><CompleteSwap /></PrivateRoute>} />
          <Route path="/report/:userId" element={<PrivateRoute><ReportUser /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function Navigation() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.container}>
        <Link to="/" style={navStyles.logo}>LEARNMATE</Link>

        {/* Desktop 导航 */}
        <div className="nav-desktop" style={navStyles.links}>
          <Link to="/" style={navStyles.link}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={navStyles.link}>Dashboard</Link>
              <Link to="/explore" style={navStyles.link}>Explore</Link>
              <Link to="/profile" style={navStyles.link}>Profile</Link>
              <button onClick={logout} style={navStyles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navStyles.link}>Login</Link>
              <Link to="/register" style={navStyles.link}>Sign Up</Link>
            </>
          )}
        </div>

        {/* 汉堡按钮（手机显示） */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={navStyles.hamburger}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 手机下拉菜单 */}
      {menuOpen && (
        <div className="nav-mobile" style={navStyles.mobileMenu}>
          <Link to="/" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/explore" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Explore</Link>
              <Link to="/profile" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={navStyles.mobileLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={navStyles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    try {
      const { setupDemo } = await import("./utils/demoSetup");
      await setupDemo();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Demo setup failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div style={homeStyles.container}>
      <h1 style={homeStyles.title}>Learn. Share. Connect.</h1>
      <p style={homeStyles.subtitle}>
        Exchange skills with people around you.
      </p>

      <div style={homeStyles.buttons}>
        <Link to="/register" style={homeStyles.primaryBtn}>
          Get Started
        </Link>
        <button
          onClick={handleTryDemo}
          style={homeStyles.demoBtn}
          disabled={demoLoading}
        >
          {demoLoading ? "Loading..." : "🚀 Try Demo"}
        </button>
      </div>

      <div style={homeStyles.features}>
        <div style={homeStyles.feature}>
          <h3>📚 Learn</h3>
          <p>Discover new skills</p>
        </div>
        <div style={homeStyles.feature}>
          <h3>🤝 Share</h3>
          <p>Teach what you know</p>
        </div>
        <div style={homeStyles.feature}>
          <h3>🔗 Connect</h3>
          <p>Build meaningful connections</p>
        </div>
      </div>
    </div>
  );
}

const navStyles = {
  nav: {
    backgroundColor: "#6C63FF",
    padding: "14px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "relative",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
  },
  logo: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    letterSpacing: "1px",
  },
  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0 6px",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    backgroundColor: "#5a52d5",
    padding: "6px 0",
  },
  mobileLink: {
    color: "white",
    textDecoration: "none",
    padding: "12px 20px",
    fontSize: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  mobileLogout: {
    color: "white",
    background: "none",
    border: "none",
    padding: "12px 20px",
    fontSize: "15px",
    textAlign: "left",
    cursor: "pointer",
  },
};

const homeStyles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 16px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    color: "#2D2D3F",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "500px",
    margin: "0 auto 30px",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  primaryBtn: {
    backgroundColor: "#6C63FF",
    color: "white",
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },
  demoBtn: {
    backgroundColor: "#FF6584",
    color: "white",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
  },
  feature: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
};

export default App;