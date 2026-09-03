import { useState } from "react";

export default function TextInput({ input, setInput }) {
  function handleInputChange(event) {
    let newTaskString = event.target.value;
    setInput(newTaskString);
  }

  return <input type="text" value={input} onChange={handleInputChange} />;
}
