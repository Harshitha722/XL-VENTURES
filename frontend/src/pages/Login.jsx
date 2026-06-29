import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-mark">DM</div>
          <div>
            <h1>DecisionMesh AI Login</h1>
            <p>Enterprise Decision Intelligence Platform</p>
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lg">
            Sign in
          </button>
        </form>
        <p className="auth-footer">
          Not ready to log in? <Link to="/">Return home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
