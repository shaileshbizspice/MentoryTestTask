import axios from "axios";
const apiBaseUrl = "http://127.0.0.1:8000";

// Fetch all task lists
export async function fetchTaskLists() {
  try {

    await axios.get(`${apiBaseUrl}/sanctum/csrf-cookie`,{ withCredentials: true });
    const response = await axios.get(`${apiBaseUrl}/api/task-lists`, { withCredentials: true });
    return response.data;
    
  } catch (error) {
    console.error("Error fetching task lists:", error);
    throw error;
  }
}

// Create a new task list
export async function createTaskList(name) {
  try {
    await axios.get(`${apiBaseUrl}/sanctum/csrf-cookie`,{ withCredentials: true });
    const response = await axios.post(`${apiBaseUrl}/api/task-lists`, { name }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error creating task list:", error);
    throw error;
  }
}

// Delete a task list
export async function deleteTaskList(id) {
  try {
    return await axios.delete(`${apiBaseUrl}/api/task-lists/${id}`, { withCredentials: true });
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
}

// Add a task to a specific task list
export async function addTask(taskListId, title) {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/tasks`,
      { task_list_id: taskListId, title },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

// Update a specific task
export async function updateTask(taskId, data) {
  try {
    const response = await axios.put(`${apiBaseUrl}/api/tasks/${taskId}`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Delete a specific task
export async function deleteTask(taskId) {
  try {
    return await axios.delete(`${apiBaseUrl}/api/tasks/${taskId}`, { withCredentials: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
