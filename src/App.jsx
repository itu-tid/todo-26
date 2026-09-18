import "./App.css";
import ToDoList from "./ToDoList.jsx";
import { useState } from "react";

import Parse from "parse";

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
  const annasToDoList = ["Call the landlord", "Book the dentist"];

  const [name, setName] = useState("Anna");

  return (
    <>
      <ToDoList firstName={name} />
    </>
  );
}

export default App;
