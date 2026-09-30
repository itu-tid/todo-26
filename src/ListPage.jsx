import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Parse from "parse";
import ToDoList from "./ToDoList.jsx";

const List = Parse.Object.extend("List");

export default function ListPage() {
  // the :listId part of the URL, e.g. /lists/Xk3v9QaB2c
  const { listId } = useParams();

  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadList() {
      try {
        const result = await new Parse.Query(List).get(listId);
        setList(result);
      } catch (err) {
        // "Object not found": no such list, or its ACL does not let me read it
        setError(err.message);
      }
    }

    loadList();
  }, [listId]);

  return (
    <>
      <Link to="/">← All lists</Link>

      {error ? (
        <p>{error}</p>
      ) : !list ? (
        <p>Loading…</p>
      ) : (
        <ToDoList key={list.id} list={list} />
      )}
    </>
  );
}
