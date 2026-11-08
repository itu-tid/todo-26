import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TextLink from "../components/UI/TextLink.jsx";
import { ErrorText, Muted } from "../components/UI/Text.jsx";
import ToDoList from "../components/ToDoList/ToDoList.jsx";
import { loadList } from "../services/listService.js";

export default function ListPage() {
  // the :listId part of the URL, e.g. /lists/Xk3v9QaB2c
  const { listId } = useParams();

  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setList(await loadList(listId));
      } catch (err) {
        // "Object not found": no such list, or its ACL does not let me read it
        setError(err.message);
      }
    }

    load();
  }, [listId]);

  return (
    <>
      <BackLink to="/">← All lists</BackLink>

      {error ? (
        <LoadError>{error}</LoadError>
      ) : !list ? (
        <Loading>Loading…</Loading>
      ) : (
        <ToDoList key={list.id} list={list} />
      )}
    </>
  );
}

const BackLink = styled(TextLink)`
  font-weight: 700;
`;

const LoadError = styled(ErrorText)`
  margin: 12px 0;
`;

const Loading = styled(Muted)`
  margin: 12px 0;
`;
