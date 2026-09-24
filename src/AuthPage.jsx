import { useState } from "react";
import Parse from "parse";

export default function AuthPage({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    try {
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      await user.signUp();
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await Parse.User.logIn(username, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Login / SignUp</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleLogin}>Log In</button>
      </form>
    </div>
  );
}
