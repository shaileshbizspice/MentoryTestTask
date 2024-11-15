import { useUser } from "../context/UserContext"; 
import { Container, Text, Paper, Button, Group } from "@mantine/core";
import { Link } from "@remix-run/react";

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <Container size="sm" style={{ marginTop: "20px" }}>
        <Text align="center" size="lg">
          You need to be logged in to view your profile.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="sm" style={{ marginTop: "40px" }}>
      <Paper
        padding="xl"
        shadow="md"
        radius="md"
        style={{
          border: "1px solid #ddd",
          background: "#f9f9f9",
          padding : '25px'
        }}
      >
        <Text size="xl" weight="bold" align="center" style={{ marginBottom: "20px" }}>
          Profile
        </Text>
        <Text size="lg" style={{ marginBottom: "10px" }}>
          <strong>Name:</strong> {user.name}
        </Text>
        <Text size="lg" style={{ marginBottom: "20px" }}>
          <strong>Email:</strong> {user.email}
        </Text>

        <Group position="center" style={{ marginTop: "20px" }}>
          <Button
            component={Link}
            to="/dashboard"
            variant="gradient"
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            size="md"
          >
            Back to Dashboard
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
