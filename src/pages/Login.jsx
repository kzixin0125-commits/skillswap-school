import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { setupDemo } from "../utils/demoSetup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTryDemo = async () => {
    setDemoLoading(true);
    setError("");
    try {
      await setupDemo();
      navigate("/dashboard");
    } catch (err) {
      console.error("Demo setup failed:", err);
      setError("Demo setup failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>LEARNMATE</h1>
        <h2 style={styles.subtitle}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            style={styles.forgotBtn}
          >
            Forgot Password?
          </button>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <button
          type="button"
          onClick={handleTryDemo}
          style={styles.demoBtn}
          disabled={demoLoading}
        >
          {demoLoading ? "⏳ Setting up demo..." : "🚀 Try Demo (No Signup)"}
        </button>

        <p style={styles.linkText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
        <p style={styles.linkText}>
          <Link to="/" style={styles.link}>← Back to Home</Link>
        </p>
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
    maxWidth: "400px",
  },
  title: {
    color: "#6C63FF",
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "24px",
    letterSpacing: "1px",
  },
  subtitle: {
    textAlign: "center",
    color: "#333",
    marginBottom: "24px",
    fontSize: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#6C63FF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    color: "#6C63FF",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    textAlign: "right",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "20px 0 12px",
  },
  dividerText: {
    flex: 1,
    color: "#999",
    fontSize: "13px",
    position: "relative",
  },
  demoBtn: {
    padding: "12px",
    backgroundColor: "#FF6584",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  linkText: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
  },
  link: {
    color: "#6C63FF",
    textDecoration: "none",
  },
};

export default Login;