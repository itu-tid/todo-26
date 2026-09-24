import { useState, useEffect } from "react";
import NewTodoForm from "./NewTodoForm.jsx";
import ToDoItem from "./ToDoItem.jsx";
import Parse from "parse";

const TodoItem = Parse.Object.extend("TodoItem");

// may the current user change this object? asks its ACL
function canWrite(parseObject) {
  const acl = parseObject.getACL();
  if (!acl) return true; // no ACL at all: everybody may write

  const user = Parse.User.current();
  return acl.getPublicWriteAccess() || acl.getWriteAccess(user);
}

export default function ToDoList({ list }) {
  let h1Style = { color: "deeppink", backgroundColor: "white" };

  let [todos, setTodos] = useState([]);

  async function loadTodos() {
    // we are creating a query object for objects of type TodoItem
    const query = new Parse.Query(TodoItem);

    query.equalTo("list", list);
    query.ascending("createdAt");

    // await
    const results = await query.find();

    let todosInDB = [];

    for (const item of results) {
      todosInDB.push({
        id: item.id,
        text: item.get("text"),
        done: item.get("done"),
        canWrite: canWrite(item),
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

    // prepare the ACL
    const currentUser = Parse.User.current();
    const acl = new Parse.ACL(currentUser); // current user can read and write
    acl.setPublicReadAccess(true); // everybody can read
    newItem.setACL(acl);

    // the to-do belongs to the list this component draws
    newItem.set("list", list);

    newItem.save().then(onSuccessfulSave).catch(onError);

    function onSuccessfulSave(savedItem) {
      let newTodos = [
        ...todos,
        { id: savedItem.id, text: newTaskText, done: false, canWrite: true },
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
      .catch((error) => alert(error.message));
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <h1 style={h1Style}>{list.get("name")}</h1>
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
