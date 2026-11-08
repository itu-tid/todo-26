import { useState } from "react";
import ActionRow from "./ActionRow.jsx";
import Button from "./Button.jsx";
import TextInput from "./TextInput.jsx";

export default function AddForm({ onAdd, buttonLabel = "Add", placeholder }) {
  let [task, setTask] = useState("");

  function onButtonClick(event) {
    event.preventDefault();
    onAdd(task);
    setTask("");
  }

  return (
    <ActionRow as="form" onSubmit={onButtonClick}>
      <TextInput value={task} onChange={setTask} placeholder={placeholder} />
      <Button
        type="submit"
        $primary
        $block
        label={buttonLabel}
        disabled={task.length === 0}
      />
    </ActionRow>
  );
}
