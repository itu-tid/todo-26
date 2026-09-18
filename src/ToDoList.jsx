import { useState, useEffect } from "react";
import NewTodoForm from "./NewTodoForm.jsx";
import ToDoItem from "./ToDoItem.jsx";
import Parse from "parse";

const TodoItem = Parse.Object.extend("TodoItem");

export default function ToDoList({ firstName }) {
  let h1Style = { color: "deeppink", backgroundColor: "white" };

  let [todos, setTodos] = useState([]);

  async function loadTodos() {
    // we are creating a query object for objects of type TodoItem
    const query = new Parse.Query(TodoItem);

    query.equalTo("done", false);
    query.ascending("createdAt");

    // await
    const results = await query.find();

    let todosInDB = [];

    for (const item of results) {
      todosInDB.push({
        id: item.id,
        text: item.get("text"),
        done: item.get("done"),
      });
    }

    setTodos(todosInDB);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  // newTask is a string
  function handleAdd(newTaskText) {
    // creation of a new row in the table
    const newItem = new TodoItem();
    newItem.set("text", newTaskText);
    newItem.set("done", false);
    newItem.save().then(onSuccessfulSave).catch(onError);

    function onSuccessfulSave(savedItem) {
      let newTodos = [
        ...todos,
        { id: savedItem.id, text: newTaskText, done: false },
      ];
      setTodos(newTodos);
    }

    function onError(error) {
      alert(error.message);
    }
  }

  function handleDelete(idToDelete) {
    // we only have the id, so we build a stand-in object pointing at that row
    const item = TodoItem.createWithoutData(idToDelete);

    // destroy() deletes the row on the server; only then drop it from the screen
    item
      .destroy()
      .then(() => {
        let newTodos = todos.filter((each) => each.id !== idToDelete);
        setTodos(newTodos);
      })
      .catch((error) => alert(error.message));
  }

  function handleToggle(id) {
    const todo = todos.find((each) => each.id === id);

    const item = TodoItem.createWithoutData(id);
    item.set("done", !todo.done);

    item
      .save()
      .then(() => {
        let newTodos = todos.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t,
        );

        setTodos(newTodos);
      })
      .catch(() => console.log("something went wrong "));
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
