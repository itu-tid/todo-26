import { Link } from "react-router-dom";
import NewTodoForm from "./NewTodoForm.jsx";

// the home page: every list, by name, each one a link to its own page
export default function Home({
  lists,
  memberships,
  onAddList,
  onShare,
  onLeave,
  onLogout,
}) {
  return (
    <>
      <h2>My lists</h2>
      {lists.map((item) => (
        <div key={item.id}>
          <Link to={`/lists/${item.id}`}>{item.get("name")}</Link>
          <NewTodoForm
            onAdd={(username) => onShare(item, username)}
            buttonLabel="Share with (username)"
          />
        </div>
      ))}

      {memberships.length > 0 && <h2>Shared with me</h2>}
      {memberships.map((membership) => (
        <p key={membership.id}>
          <Link to={`/lists/${membership.get("list").id}`}>
            {membership.get("list").get("name")}
          </Link>{" "}
          {/* include() leaves the owner out if I may not read that user's row */}
          shared by{" "}
          {membership.get("list").get("owner")?.get("username") ?? "someone"}{" "}
          <button onClick={() => onLeave(membership)}>Leave</button>
        </p>
      ))}

      <br />
      <br />
      <h3>List Manager</h3>
      <NewTodoForm onAdd={onAddList} buttonLabel="New list" />
      <h3>Account</h3>
      <button onClick={onLogout}>Logout</button>
    </>
  );
}
