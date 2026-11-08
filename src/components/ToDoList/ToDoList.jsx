import { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../colors.js";
import AddForm from "../UI/AddForm.jsx";
import { Muted } from "../UI/Text.jsx";
import ToDoItem from "./ToDoItem.jsx";
import {
  loadTodos,
  addTodo,
  deleteTodo,
  setDone,
  canWrite,
} from "../../services/todoService.js";

export default function ToDoList({ list }) {
  let [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos(list)
      .then(setTodos)
      .catch((error) => alert(error.message));
  }, [list]);

  // newTaskText is a string
  async function handleAdd(newTaskText) {
    try {
      const todo = await addTodo(list, newTaskText);
      setTodos([...todos, todo]);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(idToDelete) {
    try {
      // deleted on the server first; only then dropped from the screen
      await deleteTodo(idToDelete);
      setTodos(todos.filter((each) => each.id !== idToDelete));
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleToggle(id) {
    const todo = todos.find((each) => each.id === id);

    try {
      await setDone(id, !todo.done);
      setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <Title>{list.get("name")}</Title>
      {todos.length === 0 ? (
        <Empty>Nothing to do</Empty>
      ) : (
        <TaskList>
          {todos.map((elem) => (
            <ToDoItem
              key={elem.id}
              elem={elem}
              onDelete={handleDelete}
              onChange={handleToggle}
            />
          ))}
        </TaskList>
      )}

      {canWrite(list) && (
        <AddForm onAdd={handleAdd} buttonLabel="Add" placeholder="New task" />
      )}
    </>
  );
}

const Title = styled.h1`
  margin: 16px 0 20px;
  font-size: 28px;
  font-weight: 700;
  color: ${colors.accent};
`;

const Empty = styled(Muted)`
  margin: 12px 0 20px;
`;

const TaskList = styled.ul`
  list-style: none;
  width: 100%;
  margin: 0 0 20px;
  padding: 0;
`;
