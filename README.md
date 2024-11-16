# MentoryTestTask

This repository contains a modular task management system built with Laravel as the backend and Remix as the frontend, containerized using Docker. The application allows users to manage their own task lists and collaborate on shared lists with specific permissions (view or edit).
Features

1. User Management
   User registration and authentication
   User profile with basic information

2. Task Management
   Create, read, update, and delete task lists
   Add, edit, and remove individual tasks within lists
   Mark tasks as complete/incomplete

3. Sharing Functionality
   Share task lists with other users registered on the platform using their username
   Set permissions:
   View only
   Edit
   View lists shared with you

---

## Technology/Main Libraries Used

1. Laravel Framework 10.48.22
2. Node v20.18.0
3. Docker version 27.3.1,
4. PHP 8.1.30
4. Remix ^2.14.0
5. Mantine ^7.14.0
6. Postgres


## Setup Guide

1. Prerequisites
   Ensure the following are installed:
   Docker: Install Docker
   Node.js: Install Node.js
   Composer: Install Composer

2. Clone the Repository
   bash
   Copy code
   git clone https://github.com/your-repo/task-management-system.git
   cd task-management-system

3. Run the Setup Script
   A shell script is provided to automate the setup:
   bash
   Copy code
   chmod +x setup.sh
   ./setup.sh
   The setup.sh script performs the following:

   Builds and starts Docker containers.
   Installs Laravel dependencies using Composer.
   Installs Remix dependencies using npm.
   Runs migrations and seeds for the Laravel backend.

4. Access the Application
   Frontend: Visit http://localhost:3100
   Backend: Visit http://localhost:8000
   Backend Api: http://localhost:8000/api/<route>

## Authentication Endpoints

## Method Endpoint Description

1. POST   /api/login        User login
2. POST   /api/register     User registration
3. POST   /api/logout       User logout
4. GET    /api/user         Get Current User
5. GET    /api/users        Get all users other than the current User
6. GET    /api/profile      Get the Profile of the Current User

=============================================

## Task List Endpoints

1. GET     /api/task-lists               Get all owned and shared task lists
2. POST    /api/task-lists               Create a new task list
3. PUT     /api/task-lists/{taskList}    Update a task list
4. DELETE  /api/task-lists/{taskList}    Delete a task list

================================================

## Task Endpoints

1. POST     /api/tasks           Add a task to a task list
2. PUT      /api/tasks/{task}    Update a task
3. DELETE   /api/tasks/{task}    Delete a task

==============================================

## Task List Sharing Endpoints

1. POST    /api/task-lists/{taskListId}/share      Share a task list

## Video [Guide]

(https://drive.google.com/file/d/1Y5jLqdYEqXKjNSSUOATIzZVNHw3MhpD0/view?usp=sharing)

## Why Remix?

We started using remix and already have started building in the remix with jsx and just at the last moment we saw that the doc was updated, but we already have proceeded and are on the verge of ending the task in this timeline

