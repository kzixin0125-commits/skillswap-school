import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function ReportUser() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);

  const reasons = [
    "Inappropriate behaviour",
    "Spam",
    "Fake information",
    "Harassment",
    "Other"
  ];

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setReportedUser({ uid: userId, ...userDoc.data() });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalReason = reason === "Other" ? otherReason : reason;

    if (!finalReason) {
      setError("Please select a reason");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        reporterId: user.uid,
        reportedUserId: userId,
        reason: finalReason,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/profile/" + userId);
      }, 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!reportedUser) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚨 Report User</h1>
        <p style={styles.subtitle}>
          Report <strong>{reportedUser.name}</strong> for inappropriate behaviour
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>✅ Report submitted. Thank you!</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select a reason...</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {reason === "Other" && (
            <div style={styles.field}>
              <label style={styles.label}>Please describe</label>
              <textarea
                placeholder="Describe the issue..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                style={styles.textarea}
                rows="3"
                required
              />
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        <button onClick={() => navigate("/profile/" + userId)} style={styles.backBtn}>
          ← Back to Profile
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
    backgroundColor: "#EF5350",
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
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default ReportUser;