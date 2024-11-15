import { Modal, Button, Select, Group, Notification } from '@mantine/core';
import { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const ShareTaskListModal = ({ taskListId, opened, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('view');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/users', { withCredentials: true })
      .then((response) => {
        setUsers(response.data.filter(user => user.id !== taskListId));
      })
      .catch((err) => setError('Failed to load users.'));
  }, [taskListId]);

  const handleShare = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/task-lists/${taskListId}/share`,
        { user_id: selectedUser, permission: selectedPermission },
        { withCredentials: true }
      );
      onClose();  // Close modal after successful sharing
    } catch (err) {
      setError('Failed to share task list.');
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Share Task List">
      {error && <Notification color="red">{error}</Notification>}
      
      <Select
        label="Select User"
        value={selectedUser}
        onChange={setSelectedUser}
        data={users.map((user) => ({
          value: user.id.toString(),
          label: user.name
        }))}
      />
      <Select
        label="Select Permission"
        value={selectedPermission}
        onChange={setSelectedPermission}
        data={[
          { value: 'view', label: 'View' },
          { value: 'edit', label: 'Edit' }
        ]}
      />
      <Group position="right" style={{ marginTop: 20 }}>
        <Button onClick={handleShare}>Share</Button>
      </Group>
    </Modal>
  );
};

export default ShareTaskListModal;
