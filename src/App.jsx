import "./App.css";
import ToDoList from "./ToDoList.jsx";
import { useEffect, useState } from "react";

import Parse from "parse";
import AuthPage from "./AuthPage.jsx";
import NewTodoForm from "./NewTodoForm.jsx";

const List = Parse.Object.extend("List");

// Credentials come from .env.local, which is gitignored.
// Copy .env.example to .env.local and fill in your own Back4App values.
if (!import.meta.env.VITE_PARSE_APP_ID) {
  throw new Error(
    "No Parse credentials. Copy .env.example to .env.local, fill it in, and restart `npm run dev`.",
  );
}

Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL;
Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID,
  import.meta.env.VITE_PARSE_JS_KEY,
);

function App() {
  const [user, setUser] = useState(Parse.User.current());
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // nobody logged in yet: nothing to load
    if (!user) return;

    async function loadLists() {
      // we are creating a query object for objects of type List
      const query = new Parse.Query(List);

      query.equalTo("owner", Parse.User.current());

      // await
      const results = await query.find();

      setLists(results);
    }

    loadLists();
  }, [user]); // load again whenever somebody else logs in

  async function handleAddList(name) {
    const currentUser = Parse.User.current();

    const list = new List();
    list.set("name", name);
    list.set("owner", currentUser);
    list.setACL(new Parse.ACL(currentUser)); // only the owner, for now

    try {
      const savedList = await list.save();
      setLists([...lists, savedList]);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error) {
      alert(error);
    }
  }

  function handleAuthenticated(loggedInUser) {
    setUser(loggedInUser);
  }

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <>
      {lists.map((item) => (
        <ToDoList key={item.id} list={item} />
      ))}

      <br />
      <br />
      <h3>List Manager</h3>
      <NewTodoForm onAdd={handleAddList} buttonLabel="New list" />
      <h3>Account</h3>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default App;
