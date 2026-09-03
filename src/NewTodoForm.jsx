import { useState } from "react";
import TextInput from "./TextInput.jsx";

export default function NewTodoForm({ onAdd }) {
  let [task, setTask] = useState("");

  function handleInputChange(event) {
    let newTaskString = event.target.value;
    setTask(newTaskString);
  }

  function onButtonClick(event) {
    event.preventDefault();
    onAdd(task);
    setTask("");
  }

  return (
    <form onSubmit={onButtonClick}>
      <TextInput input={task} setInput={setTask} />
      <button type="submit" onClick={onButtonClick}>
        Add New Task
      </button>
    </form>
  );
}
