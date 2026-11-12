import Home from "./pages/Home.jsx";
import ListPage from "./pages/ListPage.jsx";
import { Route, Routes } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import colors from "./colors.js";
import TextLink from "./components/UI/TextLink.jsx";
import { useEffect, useState } from "react";

import AuthPage from "./pages/AuthPage.jsx";
import { currentUser, logOut } from "./services/authService.js";
import {
  loadMyLists,
  loadSharedWithMe,
  addList,
  shareList,
  leaveList,
  deleteList,
} from "./services/listService.js";

function App() {
  const [user, setUser] = useState(currentUser());
  const [lists, setLists] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    // nobody logged in yet: nothing to load
    if (!user) return;

    async function loadLists() {
      try {
        setLists(await loadMyLists());
        setMemberships(await loadSharedWithMe());
        setLoadFailed(false);
      } catch {
        // offline, or the server is down: say so, instead of "No lists yet"
        setLoadFailed(true);
      }
    }

    loadLists();
  }, [user]); // load again whenever somebody else logs in

  async function handleAddList(name) {
    try {
      const savedList = await addList(name);
      setLists([...lists, savedList]);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleShare(list, username) {
    try {
      await shareList(list, username);
      alert(`Shared ${list.get("name")} with ${username}`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteList(list) {
    if (!confirm(`Delete "${list.get("name")}" and all its tasks?`)) return;
    try {
      await deleteList(list);
      setLists(lists.filter((each) => each.id !== list.id));
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLeave(membership) {
    try {
      await leaveList(membership);
      setMemberships(memberships.filter((each) => each.id !== membership.id));
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      alert(error);
    }
  }

  function handleAuthenticated(loggedInUser) {
    setUser(loggedInUser);
  }

  if (!user) {
    return (
      <>
        <GlobalStyle />
        <Page>
          <AuthPage onAuthenticated={handleAuthenticated} />
        </Page>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                lists={lists}
                memberships={memberships}
                loadFailed={loadFailed}
                onAddList={handleAddList}
                onShare={handleShare}
                onLeave={handleLeave}
                onDeleteList={handleDeleteList}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/lists/:listId" element={<ListPage />} />
          <Route path="*" element={<TextLink to="/">No such page</TextLink>} />
        </Routes>
      </Page>
    </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    min-height: 100svh;
    font-family: "Nunito", sans-serif;
    background: ${colors.background};
    color: ${colors.ink};
  }

  #root {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button,
  input {
    font-family: inherit;
  }
`;

const Page = styled.main`
  box-sizing: border-box;
  width: 92%;
  max-width: 520px;
  margin: 24px auto;
  padding: 28px;
  background: ${colors.white};
  border: 1px solid ${colors.line};
  border-radius: 16px;
`;
