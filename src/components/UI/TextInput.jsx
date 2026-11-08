import styled from "styled-components";
import colors from "../../colors.js";

// takes what <input> takes, a value and a way to report a change,
// but reports the new text rather than the DOM event
export default function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <Field
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

const Field = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: inherit;
`;
