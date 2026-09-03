import { useState } from "react";
import NewTodoForm from "./NewTodoForm.jsx";

export default function ToDoList({ firstName }) {
  let h1Style = { color: "deeppink", backgroundColor: "white" };

  let [todos, setTodos] = useState([]);

  function handleAdd(newTask) {
    let newTodos = [...todos, newTask];
    setTodos(newTodos);
  }

  return (
    <>
      <h1 style={h1Style}>To Do List for {firstName}</h1>
      <ul>
        {todos.map((elem, index) => (
          <li key={index}>{elem}</li>
        ))}
      </ul>

      <NewTodoForm onAdd={handleAdd} />
    </>
  );
}
