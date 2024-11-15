<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',  
            'title' => 'required|string',                         
            'summary' => 'nullable|string|max:1000',      
        ]);

        // Create a new task with the validated data
        return Task::create([
            'task_list_id' => $request->task_list_id,
            'title' => $request->title,
            'summary' => $request->summary,  // Store the summary
        ]);
    }

    // Update existing task
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string',            
            'is_complete' => 'required|boolean',     
            'summary' => 'nullable|string|max:1000',
        ]);

        // Update the task with new data (title, summary, and completion status)
        $task->update([
            'title' => $request->title,
            'is_complete' => $request->is_complete, 
            'summary' => $request->summary,
        ]);
        
        return response()->json($task);
    }

    // Delete task
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
