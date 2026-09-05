import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

function AddSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Technology");
  const [level, setLevel] = useState("Beginner");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = ["Technology", "Creative", "Languages", "Academic", "Music", "Sports", "Business", "Other"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "skills"), {
        userId: user.uid,
        name: skillName,
        category: category,
        level: level,
        description: description,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setSkillName("");
      setCategory("Technology");
      setLevel("Beginner");
      setDescription("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>➕ Add a Skill</h1>
        <p style={styles.subtitle}>Share what you can teach others</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>✅ Skill added successfully!</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. Python, Canva, Public Speaking"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Skill Level *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={styles.select}
              required
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Briefly describe what you can teach..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows="3"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Skill"}
          </button>
        </form>

        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
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
    maxWidth: "500px",
  },
  title: {
    color: "#2D2D3F",
    fontSize: "28px",
    marginBottom: "4px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "white",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    backgroundColor: "#6C63FF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
  backBtn: {
    marginTop: "16px",
    color: "#6C63FF",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  success: {
    color: "green",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default AddSkill;