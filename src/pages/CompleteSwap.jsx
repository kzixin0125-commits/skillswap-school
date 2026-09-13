import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function CompleteSwap() {
  const { requestId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLearner, setIsLearner] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (requestId) {
      fetchRequest();
    }
  }, [requestId, user, authLoading]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const reqDoc = await getDoc(doc(db, "requests", requestId));
      if (!reqDoc.exists()) {
        setError("Request not found");
        setLoading(false);
        return;
      }

      const reqData = { id: reqDoc.id, ...reqDoc.data() };
      setRequest(reqData);

      // 我是 sender = 学习者
      const iAmSender = user.uid === reqData.senderId;
      setIsLearner(iAmSender);

      const partnerId = iAmSender ? reqData.receiverId : reqData.senderId;
      const partnerDoc = await getDoc(doc(db, "users", partnerId));
      if (partnerDoc.exists()) {
        setPartner({ uid: partnerId, ...partnerDoc.data() });
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load request");
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setError("");

    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "completed",
      });

      if (isLearner && partner) {
        // 学习者给教授者评分
        await addDoc(collection(db, "ratings"), {
          fromUserId: user.uid,
          toUserId: partner.uid,
          requestId: requestId,
          rating: rating,
          review: review,
          createdAt: new Date().toISOString(),
        });

        // 更新教授者 rating
        const partnerRef = doc(db, "users", partner.uid);
        const ratingsSnapshot = await getDocs(collection(db, "ratings"));
        let total = 0;
        let count = 0;
        ratingsSnapshot.forEach((d) => {
          const data = d.data();
          if (data.toUserId === partner.uid) {
            total += data.rating;
            count++;
          }
        });
        const avg = count > 0 ? Math.round((total / count) * 10) / 10 : 0;

        const partnerDoc = await getDoc(partnerRef);
        await updateDoc(partnerRef, {
          rating: avg,
          completedSwaps: (partnerDoc.data()?.completedSwaps || 0) + 1,
        });
      }

      // 更新自己的 completedSwaps
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      await updateDoc(userRef, {
        completedSwaps: (userDoc.data()?.completedSwaps || 0) + 1,
      });

      setSuccess(true);
      setTimeout(() => navigate("/requests"), 1500);
    } catch (err) {
      console.error("Error completing:", err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error && !request) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.error}>{error}</p>
          <Link to="/requests" style={styles.backLink}>← Back to Requests</Link>
        </div>
      </div>
    );
  }

  if (!request || !partner) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 Complete Skill Swap</h1>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>✅ Completed! Redirecting...</p>}

        <div style={styles.requestInfo}>
          <p><strong>Partner:</strong> {partner.name}</p>
          <p><strong>Skill:</strong> {isLearner ? request.receiverSkill : request.senderSkill}</p>
          <p style={styles.roleTag}>
            {isLearner ? "🎓 You are the Learner" : "👨‍🏫 You are the Teacher"}
          </p>
        </div>

        {isLearner && (
          <>
            <div style={styles.ratingSection}>
              <label style={styles.label}>Rate your teacher</label>
              <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      ...styles.starBtn,
                      color: star <= rating ? "#FFD700" : "#ccc",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p style={styles.ratingLabel}>{rating} / 5 stars</p>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Review (optional)</label>
              <textarea
                placeholder={`How was ${partner.name}'s teaching?`}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={styles.textarea}
                rows="3"
              />
            </div>
          </>
        )}

        {!isLearner && (
          <p style={styles.infoText}>
            ⭐ {partner.name} (the learner) will rate you after the swap!
          </p>
        )}

        <button
          type="button"
          onClick={handleComplete}
          style={styles.button}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : isLearner ? "✅ Complete & Rate" : "✅ Mark as Completed"}
        </button>

        <Link to="/requests" style={styles.backLink}>← Back to Requests</Link>
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
    marginBottom: "20px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  requestInfo: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  roleTag: {
    marginTop: "8px",
    color: "#6C63FF",
    fontWeight: "bold",
  },
  ratingSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  starBtn: {
    background: "none",
    border: "none",
    fontSize: "40px",
    cursor: "pointer",
  },
  ratingLabel: {
    fontSize: "14px",
    color: "#666",
    marginTop: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#66BB6A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
  backLink: {
    display: "block",
    marginTop: "16px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "12px",
  },
  success: {
    color: "green",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "12px",
  },
  infoText: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#FFF3E0",
    borderRadius: "8px",
  },
};

export default CompleteSwap;