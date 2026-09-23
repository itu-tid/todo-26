import "./App.css";
import ToDoList from "./ToDoList.jsx";
import { useState } from "react";

import Parse from "parse";
import AuthPage from "./AuthPage.jsx";

// Credentials come from .env.local, which is gitignored.
// Copy .env.example to .env.local and fill in your own Back4App values.
if (!import.meta.env.VITE_PARSE_APP_ID) {
  throw new Error(
    "No Parse credentials. Copy .env.example to .env.local, fill it in, and restart `npm run dev`.",
  );
}

Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL;
Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID,
  import.meta.env.VITE_PARSE_JS_KEY,
);

function App() {
  const [user, setUser] = useState(Parse.User.current());

  async function handleLogout() {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error) {
      alert(error);
    }
  }

  function handleAuthenticated(loggedInUser) {
    setUser(loggedInUser);
  }

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <>
      <ToDoList firstName={user.get("username")} />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default App;
