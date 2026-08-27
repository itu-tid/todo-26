export default function ToDoPanel({ firstName, lastName, children }) {
  return (
    <>
      <h1>To Do List for {firstName}</h1>
      <div style={{ backgroundColor: "palegreen" }}>{children}</div>
    </>
  );
}
