import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "../../colors.js";

// a react-router Link in the accent color, underlined only on hover
const TextLink = styled(Link)`
  color: ${colors.accent};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default TextLink;
