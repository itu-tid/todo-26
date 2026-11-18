import styled from "styled-components";
import colors from "../../colors.js";
import { ACTION_WIDTH } from "../UI/ActionRow.jsx";
import Button from "../UI/Button.jsx";
import { CloseIcon } from "../UI/icons.jsx";

export default function ToDoItem({ elem, onDelete, onChange }) {
  return (
    <Task>
      <input
        type="checkbox"
        checked={elem.done}
        disabled={!elem.canWrite}
        onChange={() => onChange(elem.id)}
      />
      {elem.textDanish ? (
        <TaskLabel $done={elem.done}>
          <span lang="da">{elem.textDanish}</span>
          <Original>{elem.text}</Original>
        </TaskLabel>
      ) : (
        // not translated (yet): an older to-do, or the translation failed
        <TaskLabel $done={elem.done}>{elem.text}</TaskLabel>
      )}
      {elem.canWrite && (
        <Button
          type="button"
          $block
          $danger
          label="Delete"
          icon={<CloseIcon />}
          onClick={() => {
            onDelete(elem.id);
          }}
        />
      )}
    </Task>
  );
}

const Task = styled.li`
  display: grid;
  grid-template-columns: 24px 1fr ${ACTION_WIDTH};
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid ${colors.line};
`;

const TaskLabel = styled.span`
  text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
  color: ${(props) => (props.$done ? colors.muted : "inherit")};
`;

const Original = styled.span`
  display: block;
  font-size: 0.85em;
  font-style: italic;
  color: ${colors.muted};
`;
