import { useState } from "react";
import styled from "styled-components";
import colors from "../colors.js";
import { signUp, logIn } from "../services/authService.js";
import Button from "../components/UI/Button.jsx";
import TextInput from "../components/UI/TextInput.jsx";
import { ErrorText } from "../components/UI/Text.jsx";

export default function AuthPage({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await signUp(username, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await logIn(username, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Stack onSubmit={handleLogin}>
      <Title>Login / SignUp</Title>
      {error && <ErrorText>{error}</ErrorText>}

      <TextInput placeholder="Username" value={username} onChange={setUsername} />
      <TextInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
      />
      <Actions>
        <Button
          type="button"
          $block
          label="Sign Up"
          onClick={handleSignUp}
        />
        <Button type="submit" $block $primary label="Log In" />
      </Actions>
    </Stack>
  );
}

const Stack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: ${colors.accent};
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
