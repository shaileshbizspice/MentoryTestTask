<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use App\Models\TaskListShare;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function index()
    {
        $ownedTaskLists = TaskList::with('tasks')
            ->where('user_id', auth()->id()) // Owned by the authenticated user
            ->get();

        // Get shared task lists
        $sharedTaskLists = TaskListShare::with('taskList.tasks')
            ->where('user_id', auth()->id()) // Where the user has access (shared task lists)
            ->get();

        // Add the permission field to the task lists
        $ownedTaskLists = $ownedTaskLists->map(function($taskList) {
            $taskList->permission = null; // Owned lists have no permission restrictions
            return $taskList;
        });

        $sharedTaskLists = $sharedTaskLists->map(function($taskListShare) {
            $taskList = $taskListShare->taskList; // Access the TaskList from the pivot relationship
            $taskList->permission = $taskListShare->permission; // Add permission info
            return $taskList;
        });

        // Combine both owned and shared task lists
        $taskLists = $ownedTaskLists->merge($sharedTaskLists);

        return response()->json($taskLists);
    }


    public function store(Request $request)
    {   
        $request->validate(['name' => 'required|string']);
        return TaskList::create(['name' => $request->name, 'user_id' => auth()->id()]);
    }

    public function update(Request $request, TaskList $taskList)
    {
        $request->validate(['name' => 'required|string']);
        $taskList->update($request->all());
        return $taskList;
    }

    public function destroy(TaskList $taskList)
    {
        $taskList->delete();
        return response()->json(['message' => 'Task list deleted']);
    }

    public function shareTaskList(Request $request, $taskListId)
    {
        $taskList = TaskList::find($taskListId);

        // Check if the user owns the task list
        if ($taskList->user_id != auth()->id()) {
            return response()->json(['error' => 'You do not have permission to share this task list.'], 403);
        }

        // Validate request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'permission' => 'required|in:view,edit',
        ]);

        // Share task list with the specified user and permission
        TaskListShare::create([
            'task_list_id' => $taskListId,
            'user_id' => $request->user_id,
            'permission' => $request->permission,
        ]);

        return response()->json(['message' => 'Task list shared successfully.']);
    }
}
