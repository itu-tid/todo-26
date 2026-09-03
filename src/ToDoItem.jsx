export default function ToDoItem({ elem, onDelete, onChange }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={elem.done}
        onChange={() => onChange(elem.id)}
      />
      {elem.text}
      <button
        type="button"
        onClick={() => {
          onDelete(elem.id);
        }}
      >
        Delete
      </button>
    </li>
  );
}
