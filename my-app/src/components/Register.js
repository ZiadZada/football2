import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (phone.length < 11) {
      setError("Please enter a valid phone number.");
      return;
    }

    const internalEmail = `${studentCode}@university.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        studentCode: studentCode,
        phone: phone,
        role: "student",
        uid: user.uid,
        createdAt: new Date()
      });

      alert("Account created successfully!");
      navigate("/Login");

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This Student Code is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" placeholder="Full Name" required 
          style={inputStyle} onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" placeholder="Student ID / Code" required 
          style={inputStyle} onChange={(e) => setStudentCode(e.target.value)} 
        />
        <input 
          type="tel" placeholder="Phone Number" required 
          style={inputStyle} onChange={(e) => setPhone(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" required 
          style={inputStyle} onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" placeholder="Confirm Password" required 
          style={inputStyle} onChange={(e) => setConfirmPassword(e.target.value)} 
        />

        {error && (
        <p style={{ 
          color: '#ff4d4d', 
          fontSize: '13px', 
          marginBottom: '10px',
          textAlign: 'center',
          fontWeight: 'bold' 
        }}>
      {error}
    </p>
    )}

        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <br />
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Register;