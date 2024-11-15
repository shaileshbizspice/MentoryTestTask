// components/TopNav.jsx
import { Link } from "@remix-run/react";
import { Button, Group, Container, Text } from "@mantine/core";
import { useUser } from "../context/UserContext"; // Use the UserContext

export default function TopNav() {
  const { user, logout } = useUser(); // Get user data and logout function from context

  return (
    <Container
      fluid
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text size="lg" weight="bold">Mentory</Text>
      {user ? (
        <Group>
          <Link to="/profile">
            <Text>{user.name}</Text>
          </Link>
          
          <Button onClick={logout} variant="outline">Logout</Button>
        </Group>
      ) : (
        <Button component={Link} to="/login" variant="outline">Login</Button>
      )}
    </Container>
  );
}
