import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user, userData } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.welcome}>
              Welcome back, {userData?.name || user?.displayName || "User"}! 👋
            </h1>
            <p style={styles.subtitle}>Ready to learn and share skills today?</p>
          </div>
          <Link to="/profile" style={styles.profileBtn}>
            <span style={styles.avatar}>{userData?.name?.charAt(0) || "U"}</span>
          </Link>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statNumber}>{userData?.rating || 0}</h3>
              <p style={styles.statLabel}>Rating</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔄</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statNumber}>{userData?.completedSwaps || 0}</h3>
              <p style={styles.statLabel}>Swaps Completed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
        </div>
        <div style={styles.actions}>
          <Link to="/explore" style={styles.actionCard}>
            <span style={styles.actionEmoji}>🔍</span>
            <span style={styles.actionLabel}>Explore Skills</span>
          </Link>
          <Link to="/add-skill" style={styles.actionCard}>
            <span style={styles.actionEmoji}>📤</span>
            <span style={styles.actionLabel}>Add Skill</span>
          </Link>
          <Link to="/add-wanted" style={styles.actionCard}>
            <span style={styles.actionEmoji}>📥</span>
            <span style={styles.actionLabel}>Want to Learn</span>
          </Link>
          <Link to="/matches" style={styles.actionCard}>
            <span style={styles.actionEmoji}>🤝</span>
            <span style={styles.actionLabel}>Find a Match</span>
          </Link>
          <Link to="/requests" style={styles.actionCard}>
            <span style={styles.actionEmoji}>📨</span>
            <span style={styles.actionLabel}>View Requests</span>
          </Link>
          <Link to="/delete-skill" style={styles.actionCard}>
            <span style={styles.actionEmoji}>⚙️</span>
            <span style={styles.actionLabel}>Manage Skills</span>
          </Link>
        </div>

        <Link to="/" style={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5e9",  // 浅绿色背景
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "700px",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerContent: {
    flex: 1,
  },
  welcome: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2D2D3F",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#888",
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    backgroundColor: "#6C63FF",
    borderRadius: "50%",
    textDecoration: "none",
    flexShrink: 0,
  },
  avatar: {
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
  },

  // Stats
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#f5f7fb",
    padding: "16px 20px",
    borderRadius: "10px",
  },
  statIcon: {
    fontSize: "28px",
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2D2D3F",
    marginBottom: "0",
    lineHeight: "1.2",
  },
  statLabel: {
    fontSize: "13px",
    color: "#999",
    marginBottom: "0",
  },

  // Section
  sectionHeader: {
    marginBottom: "14px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2D2D3F",
  },

  // Actions
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#f5f7fb",
    padding: "20px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#2D2D3F",
    transition: "transform 0.2s, background 0.2s",
    border: "2px solid transparent",
  },
  actionEmoji: {
    fontSize: "26px",
  },
  actionLabel: {
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "center",
    color: "#555",
  },

  // Back Link
  backLink: {
    display: "block",
    marginTop: "30px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
  },
};

// Add hover CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .action-card:hover {
    background: #e8eaf6;
    transform: translateY(-2px);
    border-color: #6C63FF;
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;