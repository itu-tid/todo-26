import { useState, useEffect } from "react";
import NewTodoForm from "./NewTodoForm.jsx";
import ToDoItem from "./ToDoItem.jsx";

export default function ToDoList({ firstName }) {
  let h1Style = { color: "deeppink", backgroundColor: "white" };

  function loadTodos() {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  }

  let [todos, setTodos] = useState(loadTodos);

  // newTask is a string
  function handleAdd(newTask) {
    let newTodos = [
      ...todos,
      { id: crypto.randomUUID(), text: newTask, done: false },
    ];
    setTodos(newTodos);
  }

  function handleDelete(idToDelete) {
    let newTodos = todos.filter((each) => each.id !== idToDelete);
    setTodos(newTodos);
  }

  function handleToggle(id) {
    let newTodos = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    setTodos(newTodos);
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <h1 style={h1Style}>To Do List for {firstName}</h1>
      {todos.length === 0 ? (
        <>Nothing to do</>
      ) : (
        <ul>
          {todos.map((elem, index) => (
            <ToDoItem
              key={elem.id}
              elem={elem}
              onDelete={handleDelete}
              onChange={handleToggle}
            />
          ))}
        </ul>
      )}

      <NewTodoForm onAdd={handleAdd} />
    </>
  );
}
