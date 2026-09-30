import { useState } from "react";
import TextInput from "./TextInput.jsx";

export default function NewTodoForm({ onAdd, buttonLabel = "Add New Task" }) {
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
        {buttonLabel}
      </button>
    </form>
  );
}
