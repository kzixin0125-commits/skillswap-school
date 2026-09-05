import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-skill"
            element={
              <PrivateRoute>
                <AddSkill />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-wanted"
            element={
              <PrivateRoute>
                <AddWantedSkill />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <Requests />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/delete-skill"
            element={
              <PrivateRoute>
                <DeleteSkill />
              </PrivateRoute>
            }
          />
          <Route
            path="/complete-swap/:requestId"
            element={
              <PrivateRoute>
                <CompleteSwap />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/:userId"
            element={
              <PrivateRoute>
                <ReportUser />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.container}>
        <Link to="/" style={navStyles.logo}>SkillSwap</Link>
        <div style={navStyles.links}>
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
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div style={homeStyles.container}>
      <h1 style={homeStyles.title}>Learn. Share. Connect.</h1>
      <p style={homeStyles.subtitle}>
        Exchange skills with people around you and learn something new from someone who already knows it.
      </p>
      <div style={homeStyles.buttons}>
        <Link to="/register" style={homeStyles.primaryBtn}>Get Started</Link>
        <Link to="/login" style={homeStyles.secondaryBtn}>Login</Link>
      </div>
      <div style={homeStyles.features}>
        <div style={homeStyles.feature}>
          <h3>📚 Learn</h3>
          <p>Discover new skills from people in your community</p>
        </div>
        <div style={homeStyles.feature}>
          <h3>🤝 Share</h3>
          <p>Teach what you know and help others grow</p>
        </div>
        <div style={homeStyles.feature}>
          <h3>🔗 Connect</h3>
          <p>Build meaningful connections through skill exchange</p>
        </div>
      </div>
    </div>
  );
}

const navStyles = {
  nav: {
    backgroundColor: "#6C63FF",
    padding: "16px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logo: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

const homeStyles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "60px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: "48px",
    color: "#2D2D3F",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "20px",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto 40px",
  },
  buttons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginBottom: "60px",
  },
  primaryBtn: {
    backgroundColor: "#6C63FF",
    color: "white",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "white",
    color: "#6C63FF",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    border: "2px solid #6C63FF",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "30px",
    marginTop: "40px",
  },
  feature: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
};

export default App;