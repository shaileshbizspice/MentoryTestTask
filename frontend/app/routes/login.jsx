import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Container, Title } from '@mantine/core';
import axios from 'axios';
import { useUser } from '../context/UserContext';  // Import useUser to update the user context

export default function Login() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();  // Access setUser function from UserContext to update user state

    const form = useForm({
        initialValues: { email: '', password: '' },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters')
        },
    });

    const handleLogin = async (values) => {
        try {
            // Ensure CSRF cookie is set
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                withCredentials: true,
            });

            // Send login request
            const response = await axios.post(
                "http://localhost:8000/api/login",
                values,
                { withCredentials: true }
            );

            if (response.status === 200) {
          
                setUser(response.data.user); // Update user context with fetched user data

                // Redirect to the dashboard after setting user data
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Login failed. Check your credentials.");
        }
    };

    const goToRegister = () => {
        navigate('/register'); // Redirect to the register page
    };

    return (
        <Container size={420}>
            <Title align="center">Login</Title>
            <form onSubmit={form.onSubmit(handleLogin)}>
                <TextInput label="Email" placeholder="email@example.com" {...form.getInputProps('email')} />
                <PasswordInput label="Password" placeholder="Your password" {...form.getInputProps('password')} />
                <Button type="submit" fullWidth mt="md">Login</Button>        
                <Button variant="outline" fullWidth mt="md" onClick={goToRegister}>
                    Register
                </Button>

                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </Container>
    );
}
