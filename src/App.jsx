import "./App.css";
import ToDoList from "./ToDoList.jsx";
import { useEffect, useState } from "react";

import Parse from "parse";
import AuthPage from "./AuthPage.jsx";
import NewTodoForm from "./NewTodoForm.jsx";

const List = Parse.Object.extend("List");
const TodoItem = Parse.Object.extend("TodoItem");
const ListMember = Parse.Object.extend("ListMember");

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
  const [memberships, setMemberships] = useState([]);

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

      // the lists shared with me: one ListMember row per list
      const sharedQuery = new Parse.Query(ListMember);
      sharedQuery.equalTo("user", Parse.User.current());
      sharedQuery.include("list"); // bring the list along, not only its id
      sharedQuery.include("list.owner"); // and, through the list, who owns it

      const rows = await sharedQuery.find();

      // a list its owner has deleted leaves a membership pointing at nothing
      setMemberships(rows.filter((row) => row.get("list")));
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

  async function handleShare(list, username) {
    try {
      const friend = await new Parse.Query(Parse.User)
        .equalTo("username", username)
        .first(); // undefined if nobody has that username

      if (!friend) {
        alert("No user with that name");
        return;
      }

      // 1. the security: the friend may read the list, and every to-do in it
      const acl = list.getACL() ?? new Parse.ACL(Parse.User.current());
      acl.setReadAccess(friend, true); // may read, not change
      list.setACL(acl);

      const todos = await new Parse.Query(TodoItem).equalTo("list", list).find();
      todos.forEach((todo) => todo.setACL(acl));

      // 2. the data: a row that says the friend is on the list
      const member = new ListMember();
      member.set("list", list);
      member.set("user", friend);

      // both of us may change this row: that is how the friend can leave
      const memberAcl = new Parse.ACL(Parse.User.current());
      memberAcl.setReadAccess(friend, true);
      memberAcl.setWriteAccess(friend, true);
      member.setACL(memberAcl);

      // one request, but not a transaction: if it fails halfway, they disagree
      await Parse.Object.saveAll([list, ...todos, member]);

      alert(`Shared ${list.get("name")} with ${username}`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLeave(membership) {
    try {
      // deletes my row; the ACLs on the list and its to-dos still name me
      await membership.destroy();
      setMemberships(memberships.filter((each) => each.id !== membership.id));
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
        <div key={item.id}>
          <ToDoList list={item} />
          <NewTodoForm
            onAdd={(username) => handleShare(item, username)}
            buttonLabel="Share with (username)"
          />
        </div>
      ))}

      {memberships.length > 0 && <h2>Shared with me</h2>}
      {memberships.map((membership) => (
        <div key={membership.id}>
          <ToDoList list={membership.get("list")} />
          <p>
            {/* include() leaves the owner out if I may not read that user's row */}
            Shared by{" "}
            {membership.get("list").get("owner")?.get("username") ?? "someone"}{" "}
            <button onClick={() => handleLeave(membership)}>Leave</button>
          </p>
        </div>
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
