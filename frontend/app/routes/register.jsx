import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Container, Title } from '@mantine/core';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';  

export default function Register() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleRegister = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', values);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <Container size={420}>
      <Title align="center">Register</Title>
      <form onSubmit={form.onSubmit(handleRegister)}>
        <TextInput label="Name" {...form.getInputProps('name')} />
        <TextInput label="Email" {...form.getInputProps('email')} />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <PasswordInput label="Confirm Password" {...form.getInputProps('confirmPassword')} />
        <Button type="submit" fullWidth mt="md">Register</Button>
      </form>
    </Container>
  );
}
