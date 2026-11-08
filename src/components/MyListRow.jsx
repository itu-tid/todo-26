import styled from "styled-components";
import colors from "../colors.js";
import AddForm from "./UI/AddForm.jsx";
import ActionRow from "./UI/ActionRow.jsx";
import Button from "./UI/Button.jsx";
import { CloseIcon } from "./UI/icons.jsx";
import TextLink from "./UI/TextLink.jsx";

// one of my own lists: its name, and a form to share it
export default function MyListRow({ list, onShare, onDelete }) {
  return (
    <ListBlock>
      <ActionRow>
        <ListLink to={`/lists/${list.id}`}>{list.get("name")}</ListLink>
        <Button
          type="button"
          $block
          $danger
          label="Delete"
          icon={<CloseIcon />}
          onClick={() => onDelete(list)}
        />
      </ActionRow>
      <AddForm
        onAdd={(username) => onShare(list, username)}
        buttonLabel="Share"
        placeholder="Username"
      />
    </ListBlock>
  );
}

const ListBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.line};
`;

const ListLink = styled(TextLink)`
  font-size: 34px;
`;
