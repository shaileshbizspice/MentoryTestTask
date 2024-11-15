<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    protected $fillable = ['name', 'user_id'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    
    public function sharedUsers()
    {
        return $this->belongsToMany(User::class, 'task_list_shares')
                    ->withPivot('permission')
                    ->withTimestamps();
    }
}
