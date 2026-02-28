import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaPhoneAlt, FaLock } from "react-icons/fa";
import'../index.css';

function Register() {
   const[action,setAction]=useState('');
       const LoginLink=(e)=>{
        e.preventDefault();
       navigate('/Login');
       }
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
    <div className="wrapper">
    <div className="form-box register">
      <form onSubmit={handleRegister}>
        <h1>Registration</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Student ID"
            required
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Phone Number"
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          <FaPhoneAlt className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        {error && <p className="error-message">{error}</p>}

          <div className="remember-forgot">
                <label><input type="checkbox" />I agree to the terms & conditions</label>
                 
             </div>
             <button type="submit">Register</button>
             <div className="register-link">
                <p>Already have an account? <a href="#" onClick={LoginLink}>Login</a></p>
             </div>
      </form>
    </div>
  </div>
  );
}

export default Register;