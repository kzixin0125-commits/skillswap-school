import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Explore() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Technology", "Creative", "Languages", "Academic", "Music", "Sports", "Business", "Other"];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const skillsList = [];
      querySnapshot.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() });
      });
      setSkills(skillsList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  // Filter skills based on search and category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔍 Explore Skills</h1>
        <p style={styles.subtitle}>Find skills to learn from others</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Categories */}
      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.categoryBtn,
              ...(selectedCategory === cat ? styles.categoryBtnActive : {}),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <p style={styles.loading}>Loading skills...</p>
      ) : (
        <>
          <p style={styles.resultCount}>{filteredSkills.length} skills found</p>
          <div style={styles.skillsGrid}>
            {filteredSkills.length === 0 ? (
              <p style={styles.emptyState}>No skills found. Be the first to add one!</p>
            ) : (
              filteredSkills.map((skill) => (
                <div key={skill.id} style={styles.skillCard}>
                  <h3 style={styles.skillName}>{skill.name}</h3>
                  <span style={styles.categoryTag}>{skill.category}</span>
                  <span style={styles.levelTag}>{skill.level}</span>
                  {skill.description && <p style={styles.description}>{skill.description}</p>}
                  <Link to={`/profile/${skill.userId}`} style={styles.profileLink}>
                    View Teacher →
                  </Link>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
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
  searchSection: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "10px",
    border: "2px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  categories: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "24px",
  },
  categoryBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  categoryBtnActive: {
    backgroundColor: "#6C63FF",
    color: "white",
    borderColor: "#6C63FF",
  },
  resultCount: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "16px",
  },
  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
  skillCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  skillName: {
    fontSize: "18px",
    color: "#2D2D3F",
    marginBottom: "8px",
  },
  categoryTag: {
    display: "inline-block",
    backgroundColor: "#EEEEFF",
    color: "#6C63FF",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    marginRight: "6px",
  },
  levelTag: {
    display: "inline-block",
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  description: {
    color: "#666",
    fontSize: "14px",
    marginTop: "10px",
  },
  profileLink: {
    display: "inline-block",
    marginTop: "12px",
    color: "#6C63FF",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    padding: "40px",
  },
  emptyState: {
    textAlign: "center",
    color: "#999",
    padding: "40px",
  },
  backLink: {
    display: "block",
    marginTop: "40px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
};

export default Explore;