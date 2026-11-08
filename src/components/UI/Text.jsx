import styled from "styled-components";
import colors from "../../colors.js";

// no outer margin: the page that places them decides the spacing

export const ErrorText = styled.p`
  margin: 0;
  color: ${colors.danger};
`;

export const Muted = styled.p`
  margin: 0;
  color: ${colors.muted};
`;
