import styled from "styled-components";
import colors from "../../colors.js";

export default function Button({ label, icon, ...props }) {
  return (
    <ActionButton {...props}>
      {label}
      {icon}
    </ActionButton>
  );
}

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  width: ${(props) => (props.$block ? "100%" : "auto")};
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$danger ? colors.danger : colors.ink)};
  border-radius: 8px;
  background: ${(props) => (props.$primary ? colors.ink : colors.white)};
  color: ${(props) =>
    props.$danger ? colors.danger : props.$primary ? colors.white : colors.ink};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
