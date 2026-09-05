import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !userId || userId === user.uid;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const uid = isOwnProfile ? user.uid : userId;
      
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfileUser({ uid, ...userDoc.data() });
      }

      const skillsQuery = query(collection(db, "skills"), where("userId", "==", uid));
      const skillsSnapshot = await getDocs(skillsQuery);
      const skillsList = [];
      skillsSnapshot.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() });
      });
      setSkills(skillsList);

      const wantedQuery = query(collection(db, "wantedSkills"), where("userId", "==", uid));
      const wantedSnapshot = await getDocs(wantedQuery);
      const wantedList = [];
      wantedSnapshot.forEach((doc) => {
        wantedList.push({ id: doc.id, ...doc.data() });
      });
      setWantedSkills(wantedList);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (!profileUser) {
    return <div style={styles.loading}>User not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {profileUser.name?.charAt(0) || "?"}
          </div>
          <h1 style={styles.name}>{profileUser.name || "User"}</h1>
          <p style={styles.email}>{profileUser.email}</p>
          
          <div style={styles.buttonGroup}>
            {isOwnProfile && (
              <Link to="/edit-profile" style={styles.editBtn}>
                ✏️ Edit Profile
              </Link>
            )}
            {!isOwnProfile && (
              <>
                <Link to="/matches" style={styles.editBtn}>
                  🤝 Find Match
                </Link>
                <Link to={`/report/${profileUser.uid}`} style={styles.reportBtn}>
                  🚨 Report
                </Link>
              </>
            )}
          </div>

          <div style={styles.stats}>
            <span>⭐ {profileUser.rating || 0}</span>
            <span>🔄 {profileUser.completedSwaps || 0} swaps</span>
            <span>📅 Joined {profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
          {profileUser.bio && <p style={styles.bio}>{profileUser.bio}</p>}
        </div>

        <div style={styles.skillsSection}>
          <h2>📤 Can Teach</h2>
          {skills.length === 0 ? (
            <p style={styles.emptyText}>No skills added yet</p>
          ) : (
            <div style={styles.skillsList}>
              {skills.map((skill) => (
                <span key={skill.id} style={styles.skillTag}>
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={styles.skillsSection}>
          <h2>📥 Wants to Learn</h2>
          {wantedSkills.length === 0 ? (
            <p style={styles.emptyText}>No skills added yet</p>
          ) : (
            <div style={styles.skillsList}>
              {wantedSkills.map((skill) => (
                <span key={skill.id} style={styles.wantedTag}>
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
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
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  profileHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#6C63FF",
    color: "white",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  name: {
    fontSize: "28px",
    color: "#2D2D3F",
    marginBottom: "4px",
  },
  email: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "12px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  editBtn: {
    display: "inline-block",
    padding: "8px 20px",
    backgroundColor: "#6C63FF",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  },
  reportBtn: {
    display: "inline-block",
    padding: "8px 20px",
    backgroundColor: "#EF5350",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    fontSize: "14px",
    color: "#555",
    flexWrap: "wrap",
  },
  bio: {
    marginTop: "12px",
    color: "#666",
    fontSize: "14px",
  },
  skillsSection: {
    marginTop: "24px",
  },
  skillsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },
  skillTag: {
    backgroundColor: "#EEEEFF",
    color: "#6C63FF",
    padding: "6px 14px",
    borderRadius: "16px",
    fontSize: "14px",
  },
  wantedTag: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
    padding: "6px 14px",
    borderRadius: "16px",
    fontSize: "14px",
  },
  emptyText: {
    color: "#999",
    fontSize: "14px",
    marginTop: "8px",
  },
  backLink: {
    display: "block",
    marginTop: "30px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default Profile;