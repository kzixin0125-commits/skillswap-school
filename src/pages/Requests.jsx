import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Requests() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersMap = {};
      usersSnapshot.forEach((doc) => {
        usersMap[doc.id] = doc.data();
      });
      setUsers(usersMap);

      const incomingQuery = query(
        collection(db, "requests"),
        where("receiverId", "==", user.uid)
      );
      const incomingSnapshot = await getDocs(incomingQuery);
      const incomingList = [];
      incomingSnapshot.forEach((doc) => {
        incomingList.push({ id: doc.id, ...doc.data() });
      });
      setIncoming(incomingList);

      const outgoingQuery = query(
        collection(db, "requests"),
        where("senderId", "==", user.uid)
      );
      const outgoingSnapshot = await getDocs(outgoingQuery);
      const outgoingList = [];
      outgoingSnapshot.forEach((doc) => {
        outgoingList.push({ id: doc.id, ...doc.data() });
      });
      setOutgoing(outgoingList);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
    setLoading(false);
  };

  const handleAccept = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "accepted",
      });
      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "declined",
      });
      fetchRequests();
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Failed to decline request. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#FFA726";
      case "accepted": return "#66BB6A";
      case "declined": return "#EF5350";
      case "completed": return "#42A5F5";
      default: return "#999";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "⏳ Pending";
      case "accepted": return "✅ Accepted";
      case "declined": return "❌ Declined";
      case "completed": return "🎉 Completed";
      default: return status;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📨 Skill Swap Requests</h1>
        <p style={styles.subtitle}>Manage your incoming and outgoing requests</p>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading requests...</p>
      ) : (
        <>
          {/* Incoming Requests */}
          <h2 style={styles.sectionTitle}>📥 Incoming Requests</h2>
          {incoming.length === 0 ? (
            <p style={styles.emptyState}>No incoming requests yet.</p>
          ) : (
            incoming.map((req) => {
              const sender = users[req.senderId];
              return (
                <div key={req.id} style={styles.requestCard}>
                  <div style={styles.requestHeader}>
                    <span style={styles.userName}>
                      {sender?.name || "Unknown User"}
                    </span>
                    <span style={{ ...styles.statusTag, backgroundColor: getStatusColor(req.status) }}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                  <div style={styles.requestDetails}>
                    <p style={styles.exchangeNote}>
                      {sender?.name || "They"} wants to learn <strong>{req.receiverSkill}</strong> from you
                    </p>
                  </div>
                  {req.status === "pending" && (
                    <div style={styles.actions}>
                      <button onClick={() => handleAccept(req.id)} style={styles.acceptBtn}>
                        ✅ Accept
                      </button>
                      <button onClick={() => handleDecline(req.id)} style={styles.declineBtn}>
                        ❌ Decline
                      </button>
                    </div>
                  )}
                  {req.status === "accepted" && (
                    <div style={styles.actions}>
                      <Link to={`/complete-swap/${req.id}`} style={styles.completeBtn}>
                        ✅ Mark as Completed
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Outgoing Requests */}
          <h2 style={styles.sectionTitle}>📤 Outgoing Requests</h2>
          {outgoing.length === 0 ? (
            <p style={styles.emptyState}>No outgoing requests.</p>
          ) : (
            outgoing.map((req) => {
              const receiver = users[req.receiverId];
              return (
                <div key={req.id} style={styles.requestCard}>
                  <div style={styles.requestHeader}>
                    <span style={styles.userName}>
                      To: {receiver?.name || "Unknown User"}
                    </span>
                    <span style={{ ...styles.statusTag, backgroundColor: getStatusColor(req.status) }}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                  <div style={styles.requestDetails}>
                    <p style={styles.exchangeNote}>
                      You want to learn <strong>{req.receiverSkill}</strong> from {receiver?.name || "them"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
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
  sectionTitle: {
    fontSize: "20px",
    color: "#2D2D3F",
    marginTop: "30px",
    marginBottom: "16px",
  },
  emptyState: {
    color: "#999",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  requestCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "12px",
  },
  requestHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
    gap: "8px",
  },
  userName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2D2D3F",
  },
  statusTag: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    color: "white",
  },
  requestDetails: {
    fontSize: "14px",
    color: "#555",
  },
  exchangeNote: {
    padding: "6px 0",
    fontSize: "14px",
    color: "#444",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },
  acceptBtn: {
    backgroundColor: "#66BB6A",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  declineBtn: {
    backgroundColor: "#EF5350",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  completeBtn: {
    display: "inline-block",
    backgroundColor: "#42A5F5",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
  },
  backLink: {
    display: "block",
    marginTop: "40px",
    color: "#6C63FF",
    textDecoration: "none",
    textAlign: "center",
  },
};

export default Requests;