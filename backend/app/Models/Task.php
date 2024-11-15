<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'is_complete', 'summary', 'task_list_id'];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}
