<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    // LIST TASKS
    public function index()
    {
        $tasks = auth()->user()
            ->tasks()
            ->orderBy('created_at', 'desc')
            ->get();

        return view('tasks.index', compact('tasks'));
    }

    // CREATE TASK
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        auth()->user()->tasks()->create([
            'title' => $request->title,
            'importance' => $request->importance ?? 'low',
            'due_time' => $request->due_time ?? null,
            'status' => 'undone',
            'is_completed' => false,
        ]);

        return redirect()->back();
    }

    // UPDATE TASK (generic)
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) abort(403);

        $task->update([
            'title' => $request->title ?? $task->title,
            'importance' => $request->importance ?? $task->importance,
            'due_time' => $request->due_time ?? $task->due_time,
            'status' => $request->status ?? $task->status,
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    // DELETE TASK
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) abort(403);
        $task->delete();
        return redirect()->back();
    }

    // Toggle status (undone → progress → done)
    public function toggleStatus(Task $task)
    {
        if ($task->user_id !== auth()->id()) abort(403);

        $task->status = match($task->status) {
            'undone' => 'progress',
            'progress' => 'done',
            'done' => 'undone',
            default => 'undone',
        };
        $task->save();

        return $this->jsonResponse($task);
    }

    // Toggle importance (low → medium → high)
    public function toggleImportance(Task $task)
    {
        if ($task->user_id !== auth()->id()) abort(403);

        $task->importance = match($task->importance) {
            'low' => 'medium',
            'medium' => 'high',
            'high' => 'low',
            default => 'low',
        };
        $task->save();

        return $this->jsonResponse($task);
    }

    // Update due time
    public function updateDueTime(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) abort(403);

        $task->due_time = $request->due_time ? Carbon::parse($request->due_time) : null;
        $task->save();

        return $this->jsonResponse($task);
    }

    // JSON helper with time left calculation
    private function jsonResponse(Task $task)
    {
        $time_left = 'Set time';

        if ($task->due_time) {
            $now = Carbon::now();
            $due = Carbon::parse($task->due_time);

            if ($now->greaterThan($due)) {
                $time_left = 'Expired';
            } else {
                $diff = $now->diff($due);
                $time_left = ($diff->d ? $diff->d.'d ' : '') .
                             ($diff->h ? $diff->h.'h ' : '') .
                             ($diff->i ? $diff->i.'m' : '');
                if ($time_left === '') $time_left = '0m';
            }
        }

        return response()->json([
            'is_completed' => $task->status === 'done',
            'status' => $task->status,
            'importance' => $task->importance,
            'time_left' => $time_left
        ]);
    }
}