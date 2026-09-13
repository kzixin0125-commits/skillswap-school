import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user, userData } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerText}>
            <h1 style={styles.welcome}>
              Welcome back, {userData?.name || user?.displayName || "User"}! 👋
            </h1>
            <p style={styles.subtitle}>Ready to learn and share?</p>
          </div>
          <Link to="/profile" style={styles.profileBtn}>
            <span style={styles.avatar}>{userData?.name?.charAt(0) || "U"}</span>
          </Link>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <h3 style={styles.statNumber}>{userData?.rating || 0}</h3>
              <p style={styles.statLabel}>Rating</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔄</div>
            <div>
              <h3 style={styles.statNumber}>{userData?.completedSwaps || 0}</h3>
              <p style={styles.statLabel}>Swaps</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actions}>
          <Link to="/explore" style={styles.actionCard}>
            <span style={styles.actionEmoji}>🔍</span>
            <span style={styles.actionLabel}>Explore</span>
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
            <span style={styles.actionLabel}>Find Match</span>
          </Link>
          <Link to="/requests" style={styles.actionCard}>
            <span style={styles.actionEmoji}>📨</span>
            <span style={styles.actionLabel}>Requests</span>
          </Link>
          <Link to="/delete-skill" style={styles.actionCard}>
            <span style={styles.actionEmoji}>⚙️</span>
            <span style={styles.actionLabel}>Manage</span>
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
    justifyContent: "center",
    backgroundColor: "#e8f5e9",
    padding: "16px",
  },
  card: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
    height: "fit-content",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "12px",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  welcome: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2D2D3F",
    marginBottom: "4px",
    lineHeight: "1.3",
  },
  subtitle: {
    fontSize: "13px",
    color: "#888",
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    minWidth: "44px",
    backgroundColor: "#6C63FF",
    borderRadius: "50%",
    textDecoration: "none",
  },
  avatar: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
  },

  // Stats
  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#f5f7fb",
    padding: "12px",
    borderRadius: "10px",
  },
  statIcon: {
    fontSize: "22px",
  },
  statNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2D2D3F",
    lineHeight: "1.2",
  },
  statLabel: {
    fontSize: "11px",
    color: "#999",
  },

  // Section
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#2D2D3F",
    marginBottom: "12px",
  },

  // Actions - 3列小按钮
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    backgroundColor: "#f5f7fb",
    padding: "12px 6px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#2D2D3F",
    border: "2px solid transparent",
    transition: "all 0.2s",
  },
  actionEmoji: {
    fontSize: "22px",
  },
  actionLabel: {
    fontSize: "11px",
    fontWeight: "500",
    textAlign: "center",
    color: "#555",
  },

  backLink: {
    display: "block",
    marginTop: "20px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "13px",
  },
};

export default Dashboard;