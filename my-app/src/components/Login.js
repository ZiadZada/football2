import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [studentCode, setStudentCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const internalEmail = `${studentCode}@university.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, internalEmail, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }
    } catch (err) {
      console.error(err.code);
      setError("Invalid ID or Password.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="text" 
          placeholder="Student ID / Code" 
          value={studentCode} 
          onChange={(e) => setStudentCode(e.target.value)} 
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #aaa" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #aaa" }}
        />
        
        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

        <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;