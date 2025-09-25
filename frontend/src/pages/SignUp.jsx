import { useState } from "react";
import "../css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/Authentication";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(""); // to avoid multiple submits, disable the submit btn while the data is being proccesed

  const { session, signUpUser } = UserAuth();
  const navigate = useNavigate();
  // console.log(session) // debug

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signUpUser(email, password);
      // console.log(result);
      if (result.success) {
        navigate("/");
      } else {
        setError("Error signing up");
      }
    } catch (error) {
      setError("Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up">
      <h1>QuestBoard</h1>
      <form onSubmit={handleSignUp} className="sign-up-form">
        <h2>Start Questing Today!</h2>
        <p>Already signed up?</p>
        <Link to="/sign-in">Sign in!</Link>
        <div className="sign-up-inputs">
          <input
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            name="password"
            placeholder="Password"
          />
          <button type="submit" disabled={loading}>
            Sign Up
          </button>
          {error ? <p className="error">{error}</p> : <p></p>}
        </div>
      </form>
    </div>
  );
}

export default SignUp;
