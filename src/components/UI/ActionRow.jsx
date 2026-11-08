import styled from "styled-components";

// the width of the button column, so the buttons on every row line up
export const ACTION_WIDTH = "120px";

// a row with its content on the left and a button in the last column;
// render it as another element with `as`, e.g. <ActionRow as="form">
const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr ${ACTION_WIDTH};
  gap: 8px;
  align-items: center;
  width: 100%;
`;

export default ActionRow;
