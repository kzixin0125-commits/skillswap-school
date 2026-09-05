import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function DeleteSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      // 获取我的技能
      const skillsQuery = query(collection(db, "skills"), where("userId", "==", user.uid));
      const skillsSnapshot = await getDocs(skillsQuery);
      const skillsList = [];
      skillsSnapshot.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() });
      });
      setSkills(skillsList);

      // 获取我想学的技能
      const wantedQuery = query(collection(db, "wantedSkills"), where("userId", "==", user.uid));
      const wantedSnapshot = await getDocs(wantedQuery);
      const wantedList = [];
      wantedSnapshot.forEach((doc) => {
        wantedList.push({ id: doc.id, ...doc.data() });
      });
      setWantedSkills(wantedList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteDoc(doc(db, "skills", skillId));
        setMessage("✅ Skill deleted successfully!");
        fetchSkills();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting skill:", error);
        setMessage("❌ Failed to delete skill");
      }
    }
  };

  const handleDeleteWanted = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this wanted skill?")) {
      try {
        await deleteDoc(doc(db, "wantedSkills", skillId));
        setMessage("✅ Wanted skill deleted successfully!");
        fetchSkills();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting wanted skill:", error);
        setMessage("❌ Failed to delete wanted skill");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🗑️ Manage Skills</h1>
        <p style={styles.subtitle}>Delete skills you no longer want to teach or learn</p>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <>
          <div style={styles.section}>
            <h2>📤 Skills I Can Teach</h2>
            {skills.length === 0 ? (
              <p style={styles.emptyText}>No skills added yet</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} style={styles.skillItem}>
                  <span style={styles.skillName}>{skill.name}</span>
                  <span style={styles.categoryTag}>{skill.category}</span>
                  <span style={styles.levelTag}>{skill.level}</span>
                  <button onClick={() => handleDeleteSkill(skill.id)} style={styles.deleteBtn}>
                    ✕ Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <h2>📥 Skills I Want to Learn</h2>
            {wantedSkills.length === 0 ? (
              <p style={styles.emptyText}>No wanted skills added yet</p>
            ) : (
              wantedSkills.map((skill) => (
                <div key={skill.id} style={styles.skillItem}>
                  <span style={styles.skillName}>{skill.name}</span>
                  <span style={styles.categoryTag}>{skill.category}</span>
                  <button onClick={() => handleDeleteWanted(skill.id)} style={styles.deleteBtn}>
                    ✕ Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div style={styles.actions}>
        <Link to="/add-skill" style={styles.actionBtn}>➕ Add Teach Skill</Link>
        <Link to="/add-wanted" style={styles.actionBtn}>🎯 Add Wanted Skill</Link>
      </div>

      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    color: "#2D2D3F",
    marginBottom: "4px",
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    padding: "40px",
  },
  message: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  section: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  skillName: {
    fontWeight: "bold",
    fontSize: "16px",
    minWidth: "120px",
  },
  categoryTag: {
    backgroundColor: "#EEEEFF",
    color: "#6C63FF",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  levelTag: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  deleteBtn: {
    backgroundColor: "#EF5350",
    color: "white",
    border: "none",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "auto",
    fontSize: "14px",
  },
  emptyText: {
    color: "#999",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "20px",
  },
  actionBtn: {
    backgroundColor: "#6C63FF",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
  },
  backLink: {
    display: "block",
    marginTop: "30px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
};

export default DeleteSkill;