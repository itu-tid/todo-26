import Button from "../components/UI/Button.jsx";
import AddForm from "../components/UI/AddForm.jsx";
import MyListRow from "../components/MyListRow.jsx";
import SharedListRow from "../components/SharedListRow.jsx";
import ActionRow from "../components/UI/ActionRow.jsx";
import { Muted } from "../components/UI/Text.jsx";
import styled from "styled-components";
import colors from "../colors.js";
import { useInstallPrompt } from "../hooks/useInstallPrompt.js";

// the home page: every list, by name, each one a link to its own page
export default function Home({
  lists,
  memberships,
  onAddList,
  onShare,
  onLeave,
  onDeleteList,
  onLogout,
}) {
  const { canInstall, install } = useInstallPrompt();

  return (
    <>
      <ActionRow as="header">
        <Title>Lists</Title>
        {canInstall && (
          <Button type="button" $block label="Install" onClick={install} />
        )}
        <Button type="button" $block label="Logout" onClick={onLogout} />
      </ActionRow>

      <Section>
        <SectionTitle>My lists</SectionTitle>
        {lists.length === 0 && <Muted>No lists yet.</Muted>}
        {lists.map((list) => (
          <MyListRow
            key={list.id}
            list={list}
            onShare={onShare}
            onDelete={onDeleteList}
          />
        ))}
      </Section>

      {memberships.length > 0 && (
        <Section>
          <SectionTitle>Shared with me</SectionTitle>
          {memberships.map((membership) => (
            <SharedListRow
              key={membership.id}
              membership={membership}
              onLeave={onLeave}
            />
          ))}
        </Section>
      )}

      <Section>
        <SectionTitle>New list</SectionTitle>
        <AddForm onAdd={onAddList} buttonLabel="Add" placeholder="List name" />
      </Section>
    </>
  );
}

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.accent};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${colors.muted};
`;
