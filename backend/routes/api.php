<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'getUser'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/task-lists', [TaskListController::class, 'index']);
    Route::post('/task-lists', [TaskListController::class, 'store']);
    Route::put('/task-lists/{taskList}', [TaskListController::class, 'update']);
    Route::delete('/task-lists/{taskList}', [TaskListController::class, 'destroy']);

    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});
Route::post('task-lists/{taskListId}/share', [TaskListController::class, 'shareTaskList']);
Route::get('/users', [AuthController::class, 'getAllOtherUser'])->middleware('auth:sanctum');
