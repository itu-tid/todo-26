import { useState } from "react";
import TextInput from "./TextInput.jsx";

export default function NewTodoForm({ onAdd }) {
  let [task, setTask] = useState("");

  function onButtonClick(event) {
    event.preventDefault();
    onAdd(task);
    setTask("");
  }

  return (
    <form onSubmit={onButtonClick}>
      <TextInput input={task} setInput={setTask} />
      <button type="submit" disabled={task.length === 0}>
        Add New Task
      </button>
    </form>
  );
}
