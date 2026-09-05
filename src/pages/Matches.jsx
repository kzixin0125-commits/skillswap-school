import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allWanted, setAllWanted] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取所有用户
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      usersSnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          usersList.push({ uid: doc.id, ...doc.data() });
        }
      });
      setAllUsers(usersList);

      // 获取所有技能
      const skillsSnapshot = await getDocs(collection(db, "skills"));
      const skillsList = [];
      skillsSnapshot.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() });
      });
      setAllSkills(skillsList);

      // 获取所有想学的技能
      const wantedSnapshot = await getDocs(collection(db, "wantedSkills"));
      const wantedList = [];
      wantedSnapshot.forEach((doc) => {
        wantedList.push({ id: doc.id, ...doc.data() });
      });
      setAllWanted(wantedList);

      // 计算匹配
      calculateMatches(usersList, skillsList, wantedList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const calculateMatches = (users, skills, wanted) => {
    const mySkills = skills.filter((s) => s.userId === user.uid).map((s) => s.name.toLowerCase());
    const myWanted = wanted.filter((w) => w.userId === user.uid).map((w) => w.name.toLowerCase());

    const matchResults = [];

    users.forEach((otherUser) => {
      const otherSkills = skills.filter((s) => s.userId === otherUser.uid).map((s) => s.name.toLowerCase());
      const otherWanted = wanted.filter((w) => w.userId === otherUser.uid).map((w) => w.name.toLowerCase());

      let score = 0;
      const matchedSkills = [];
      const matchedTeachSkills = [];
      const matchedLearnSkills = [];

      // 我能教，对方想学
      mySkills.forEach((skill) => {
        if (otherWanted.includes(skill)) {
          score += 50;
          matchedSkills.push({ skill, type: "teach", match: "对方想学" });
          matchedTeachSkills.push(skill);
        }
      });

      // 对方能教，我想学
      otherSkills.forEach((skill) => {
        if (myWanted.includes(skill)) {
          score += 50;
          matchedSkills.push({ skill, type: "learn", match: "对方能教" });
          matchedLearnSkills.push(skill);
        }
      });

      // 共同兴趣（加分）
      const commonInterests = mySkills.filter((s) => otherSkills.includes(s));
      score += commonInterests.length * 10;

      if (score > 0) {
        matchResults.push({
          user: otherUser,
          score: Math.min(score, 100),
          matchedSkills,
          matchedTeachSkills,
          matchedLearnSkills,
          otherSkills,
          otherWanted,
        });
      }
    });

    matchResults.sort((a, b) => b.score - a.score);
    setMatches(matchResults);
    setLoading(false);
  };

  const sendRequest = async (receiverId, senderSkill, receiverSkill) => {
    if (!senderSkill || !receiverSkill) {
      alert("Please make sure both skills are selected.");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        senderId: user.uid,
        receiverId: receiverId,
        senderSkill: senderSkill,
        receiverSkill: receiverSkill,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      alert("✅ Skill Swap request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("❌ Failed to send request. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤝 Find Your Match</h1>
        <p style={styles.subtitle}>Discover people who can teach what you want to learn</p>
      </div>

      {loading ? (
        <p style={styles.loading}>Finding matches...</p>
      ) : matches.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyTitle}>No matches found yet</p>
          <p style={styles.emptyText}>Try adding more skills to your profile!</p>
          <Link to="/add-skill" style={styles.emptyBtn}>➕ Add Skills You Can Teach</Link>
          <Link to="/add-wanted" style={styles.emptyBtn}>🎯 Add Skills You Want to Learn</Link>
        </div>
      ) : (
        <div style={styles.matchesGrid}>
          {matches.map((match, index) => (
            <div key={index} style={styles.matchCard}>
              <div style={styles.matchHeader}>
                <h3 style={styles.userName}>{match.user.name || "User"}</h3>
                <span style={styles.matchScore}>🎯 {match.score}% Match</span>
              </div>

              <div style={styles.matchDetails}>
                {match.matchedSkills.map((item, idx) => (
                  <div key={idx} style={styles.matchItem}>
                    <span style={item.type === "teach" ? styles.teachTag : styles.learnTag}>
                      {item.type === "teach" ? "📤 You teach" : "📥 You learn"}
                    </span>
                    <span style={styles.skillName}>{item.skill}</span>
                    <span style={styles.matchReason}>{item.match}</span>
                  </div>
                ))}
              </div>

              <div style={styles.userSkills}>
                <div>
                  <strong>They can teach:</strong>
                  <p>{match.otherSkills.join(", ") || "None"}</p>
                </div>
                <div>
                  <strong>They want to learn:</strong>
                  <p>{match.otherWanted.join(", ") || "None"}</p>
                </div>
              </div>

              <button 
                onClick={() => sendRequest(
                  match.user.uid,
                  match.matchedTeachSkills[0] || match.matchedSkills[0]?.skill || "Skill",
                  match.matchedLearnSkills[0] || match.matchedSkills[0]?.skill || "Skill"
                )}
                style={styles.requestBtn}
              >
                Request Skill Swap
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
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
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "24px",
    color: "#2D2D3F",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#666",
    marginBottom: "20px",
  },
  emptyBtn: {
    display: "inline-block",
    backgroundColor: "#6C63FF",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    margin: "4px",
  },
  matchesGrid: {
    display: "grid",
    gap: "20px",
  },
  matchCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  matchHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  userName: {
    fontSize: "20px",
    color: "#2D2D3F",
  },
  matchScore: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  matchDetails: {
    marginBottom: "16px",
  },
  matchItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  teachTag: {
    backgroundColor: "#E3F2FD",
    color: "#1565C0",
    padding: "2px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  learnTag: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
    padding: "2px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  skillName: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  matchReason: {
    color: "#666",
    fontSize: "12px",
  },
  userSkills: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    fontSize: "14px",
    color: "#555",
    marginBottom: "16px",
  },
  requestBtn: {
    backgroundColor: "#6C63FF",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
  backLink: {
    display: "block",
    marginTop: "40px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
};

export default Matches;