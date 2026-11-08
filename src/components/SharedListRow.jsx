import styled from "styled-components";
import colors from "../colors.js";
import ActionRow from "./UI/ActionRow.jsx";
import Button from "./UI/Button.jsx";
import TextLink from "./UI/TextLink.jsx";

// a list somebody shared with me: its name, its owner, and a way out
export default function SharedListRow({ membership, onLeave }) {
  const list = membership.get("list");

  return (
    <Row>
      <Details>
        <TextLink to={`/lists/${list.id}`}>{list.get("name")}</TextLink>
        {/* include() leaves the owner out if I may not read that user's row */}
        <Owner>shared by {list.get("owner")?.get("username") ?? "someone"}</Owner>
      </Details>
      <Button
        type="button"
        $block
        label="Leave"
        onClick={() => onLeave(membership)}
      />
    </Row>
  );
}

const Row = styled(ActionRow)`
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.line};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Owner = styled.span`
  color: ${colors.muted};
  font-size: 14px;
`;
