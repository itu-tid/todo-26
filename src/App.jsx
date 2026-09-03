import "./App.css";
import ToDoList from "./ToDoList.jsx";
import { useState } from "react";

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
