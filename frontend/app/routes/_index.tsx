import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Title,
  Button,
  TextInput,
  Group,
  Paper,
  Text,
  Checkbox,
  Textarea,
  Modal,
  Badge,
} from '@mantine/core';
import { useUser } from '../context/UserContext';
import '../css/dashboard.css';
import ShareTaskListModal from '../modal/ShareTaskListModal';

export default function Dashboard() {
  const { user } = useUser(); // Get the current user
  const [taskLists, setTaskLists] = useState([]);
  const [newTaskListName, setNewTaskListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSummary, setNewTaskSummary] = useState('');
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [shareTaskListModalOpen, setShareTaskListModalOpen] = useState(false);

  // Fetch task lists for the logged-in user
  useEffect(() => {
    if (user) {
      axios
        .get('http://localhost:8000/api/task-lists', { withCredentials: true })
        .then((response) => {
          const taskListsWithTasks = response.data.map((list) => ({
            ...list,
            tasks: list.tasks || [], // Ensure tasks is always an array
          }));
          setTaskLists(taskListsWithTasks);

          // Retrieve selectedTaskListId from localStorage
          const savedTaskListId = localStorage.getItem('selectedTaskListId');
          if (savedTaskListId) {
            const selectedList = taskListsWithTasks.find(
              (list) => list.id === parseInt(savedTaskListId)
            );
            if (selectedList) {
              setSelectedTaskList(selectedList);  // Set the selected task list from localStorage
            }
          }
        })
        .catch((error) => console.log('Error fetching task lists:', error));
    }
  }, [user]);

  const handleShareClick = (taskListId) => {
    setSelectedTaskList(taskLists.find((list) => list.id === taskListId));
    setShareTaskListModalOpen(true);  // Open the modal when share button is clicked
  };

  const handleCreateTaskList = async () => {
    if (!newTaskListName) return;
    try {
      const response = await axios.post(
        'http://localhost:8000/api/task-lists',
        { name: newTaskListName },
        { withCredentials: true }
      );
      setTaskLists((prev) => [
        ...prev,
        { ...response.data, tasks: [] }, // Initialize tasks as an empty array
      ]);
      setNewTaskListName('');
    } catch (err) {
      setError('Failed to create task list.');
    }
  };

  const handleDeleteTaskList = async (taskListId) => {
    try {
      await axios.delete(`http://localhost:8000/api/task-lists/${taskListId}`, {
        withCredentials: true,
      });
      setTaskLists((prev) => prev.filter((taskList) => taskList.id !== taskListId));
    } catch (err) {
      setError('Failed to delete task list.');
    }
  };

  const handleCreateTask = async () => {
    if (!selectedTaskList || !newTaskTitle) return;
    try {
      const response = await axios.post(
        'http://localhost:8000/api/tasks',
        {
          task_list_id: selectedTaskList.id,
          title: newTaskTitle,
          summary: newTaskSummary,
        },
        { withCredentials: true }
      );

      // Add the new task to the selected task list
      setTaskLists((prev) =>
        prev.map((taskList) =>
          taskList.id === selectedTaskList.id
            ? { ...taskList, tasks: [...taskList.tasks, response.data] }
            : taskList
        )
      );

      setNewTaskTitle('');
      setNewTaskSummary('');
      setCreateTaskModalOpen(false);
    } catch (err) {
      setError('Failed to create task.');
    }
  };


  const handleToggleTaskStatus = async (task) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${task.id}`,
        {
          title: task.title,
          summary: task.summary,
          is_complete: !task.is_complete,
        },
        { withCredentials: true }
      );

      // Update the task status across all task lists
      setTaskLists((prev) =>
        prev.map((taskList) => ({
          ...taskList,
          tasks: taskList.tasks.map((t) =>
            t.id === task.id ? { ...t, is_complete: response.data.is_complete } : t
          ),
        }))
      );
    } catch (err) {
      console.log('Error updating task status:', err);
    }
  };




  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}`, {
        withCredentials: true,
      });
      setTaskLists((prev) =>
        prev.map((taskList) => ({
          ...taskList,
          tasks: taskList.tasks.filter((task) => task.id !== taskId),
        }))
      );
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${editingTask.id}`,
        {
          title: editingTask.title,
          summary: editingTask.summary,
          is_complete: editingTask.is_complete,
        },
        { withCredentials: true }
      );

      // Update the task in the correct task list across all task lists
      setTaskLists((prev) =>
        prev.map((taskList) => ({
          ...taskList,
          tasks: taskList.tasks.map((task) =>
            task.id === editingTask.id ? response.data : task
          ),
        }))
      );

      setEditTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.log('Error updating task:', err);
    }
  };



  return (
    <Container size={720} style={{ marginTop: '20px' }}>
      <Title align="center">Dashboard</Title>

      {error && <Text color="red" align="center">{error}</Text>}

      {/* Task List Creation */}
      <Group position="apart" style={{ marginBottom: '20px' }}>
        <TextInput
          label="New Task List Name"
          placeholder="Enter task list name"
          value={newTaskListName}
          onChange={(e) => setNewTaskListName(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button style={{ marginTop: '23px' }} onClick={handleCreateTaskList}>Create Task List</Button>
      </Group>

      {/* Task Lists and Tasks */}
      {taskLists.map((taskList) => (
        <Paper key={taskList.id} shadow="xs" padding="lg" style={{ marginBottom: '20px', padding: '15px' }}>
          <Group position="apart" align="center">
            <Text size="xl">{taskList.name}</Text>
            <Group>
              {taskList.permission !== 'view' ? (
                <>
                  <Button
                    color="blue"
                    onClick={() => {
                      setSelectedTaskList(taskList); // Ensure selected task list for task creation
                      setCreateTaskModalOpen(true);
                    }}
                  >
                    Add Task
                  </Button>
                  <Button
                    color="blue"
                    onClick={() => handleShareClick(taskList.id)} // Open the share modal
                  >
                    Share Task List
                  </Button>
                  <Button color="red" onClick={() => handleDeleteTaskList(taskList.id)}>
                    Delete Task List
                  </Button>
                </>
              ) : (
                <Text size="sm">View Only</Text>
              )
              }
            </Group>
          </Group>

          <div className="listoftask">
            {(taskList.tasks || []).map((task) => (
              <Group key={task.id} style={{ marginBottom: '10px' }}>
                <Checkbox
                  label={task.title}
                  checked={task.is_complete}
                  onChange={() => handleToggleTaskStatus(task)}
                  disabled={taskList.permission == 'view'}
                />
                <Badge color={task.is_complete ? 'green' : 'red'}>
                  {task.is_complete ? 'Completed' : 'Incomplete'}
                </Badge>
                {taskList.permission !== 'view' ? (
                  <>
                    <Button
                      onClick={() => {
                        setEditingTask(task); // Set the task to edit
                        setEditTaskModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button color="red" onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </Button>
                  </>
                ) :
                  <Button
                    onClick={() => {
                      setViewTask(task);
                      setViewTaskModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                }
              </Group>
            ))}
          </div>
        </Paper>
      ))}

      {/* Share Task List Modal */}
      <ShareTaskListModal
        taskListId={selectedTaskList?.id}
        opened={shareTaskListModalOpen}
        onClose={() => setShareTaskListModalOpen(false)}
      />


      {/* Create Task Modals */}
      <Modal
        opened={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        title="Create New Task"
      >
        <TextInput
          label="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Textarea
          label="Task Summary"
          value={newTaskSummary}
          onChange={(e) => setNewTaskSummary(e.target.value)}
        />
        <br />
        <Button onClick={handleCreateTask}>Add Task</Button>
      </Modal>
      {/* Update Task Modals */}
      <Modal
        opened={editTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
        title="Edit Task"
      >
        <TextInput
          label="Task Title"
          value={editingTask?.title || ''}
          onChange={(e) => setEditingTask((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Textarea
          label="Task Summary"
          value={editingTask?.summary || ''}
          onChange={(e) => setEditingTask((prev) => ({ ...prev, summary: e.target.value }))}
        />
        <br />
        <Checkbox
          label="Completed"
          checked={editingTask?.is_complete || false}
          onChange={(e) =>
            setEditingTask((prev) => ({ ...prev, is_complete: e.target.checked }))
          }
        />
        <br />
        <Button onClick={handleEditTask}>Save Changes</Button>
      </Modal>
      {/* View Task Modals */}
      <Modal
        opened={viewTaskModalOpen}
        onClose={() => setViewTaskModalOpen(false)}
        title="View Task"
      >
        <TextInput
          label="Task Title"
          value={viewTask?.title || ''}
          disabled='true'
        />
        <Textarea
          label="Task Summary"
          value={viewTask?.summary || ''}
          disabled='true'
        />
      </Modal>
    </Container>
  );
}
