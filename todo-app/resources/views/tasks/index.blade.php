@php
use Carbon\Carbon;
@endphp

<style>
.status-toggle-animate {
     transform: scale(0.5);
    animation: simplePop 0.2s forwards;
}
@keyframes simplePop {
    to { transform: scale(1); }
}
.toggle-status {
    cursor: pointer;
}
.task-badge {
    px-3 py-1 rounded-full text-xs cursor-pointer;
}
.task:hover .hover-visible {
    opacity: 1;
}
.hover-visible {
    opacity: 0;
    transition: opacity 0.2s;
}
</style>

<x-app-layout>
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="min-h-screen bg-[#0b0f19] text-white py-10 px-6">
    <div class="max-w-4xl mx-auto">

        <!-- Header -->
        <h1 class="text-3xl font-bold">Todo</h1>
        <p class="text-gray-400 mb-6">Keep track of your tasks</p>

        <!-- Search -->
        <div class="bg-[#1a1f2e] rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
            🔍
            <input id="search" type="text" placeholder="Search tasks..."
                class="bg-transparent w-full outline-none text-gray-300">
        </div>

        <!-- FILTER & SORT PANEL -->
        <div class="flex flex-col mb-6 gap-2">
            <div class="flex items-center gap-2">
                <span class="text-gray-400">Show:</span>
                <button onclick="filterTasks('all')" class="px-3 py-1 rounded-lg bg-gray-600 text-white">All</button>
                <button onclick="filterTasks('low')" class="px-3 py-1 rounded-lg bg-green-600 text-white">Low</button>
                <button onclick="filterTasks('medium')" class="px-3 py-1 rounded-lg bg-yellow-500 text-white">Medium</button>
                <button onclick="filterTasks('high')" class="px-3 py-1 rounded-lg bg-red-600 text-white">High</button>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-gray-400">Sort by:</span>
                <button id="sortTypeBtn" onclick="toggleSortType()" class="px-3 py-1 rounded-lg bg-gray-600 text-white">Time</button>
                <span class="text-gray-400">Order:</span>
                <button id="sortOrderBtn" onclick="toggleSortOrder()" class="px-3 py-1 rounded-lg bg-gray-600 text-white">↑</button>
            </div>
        </div>

        <!-- Add Task -->
        <form method="POST" action="{{ route('tasks.store') }}" class="mb-6">
            @csrf
            <input name="title" placeholder="New task..."
                class="w-full bg-[#1a1f2e] px-4 py-3 rounded-xl placeholder-white mb-2">
            <select name="importance" class="w-full bg-[#1a1f2e] px-4 py-2 rounded-xl text-white mb-2">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
            </select>
            <button class="w-full bg-blue-600 py-2 rounded-xl">Add Task</button>
        </form>

        <!-- Tasks -->
        <div id="tasks" class="space-y-4">
        @foreach($tasks as $task)
            @php
                $now = Carbon::now();
                $due = $task->due_time ? Carbon::parse($task->due_time) : null;
                if (!$due) {
                    $timeLeftStr = 'Set time';
                } elseif ($now->greaterThan($due)) {
                    $timeLeftStr = 'Expired';
                } else {
                    $diff = $now->diff($due);
                    $timeLeftStr = $diff->d > 0 ? $diff->d.'d' : ($diff->h > 0 ? $diff->h.'h' : $diff->i.'m');
                }
            @endphp

            <div class="task flex justify-between items-center bg-[#121826] px-5 py-4 rounded-xl group"
                 data-id="{{ $task->id }}"
                 data-status="{{ $task->status }}"
                 data-importance="{{ $task->importance }}">

                <!-- LEFT: STATUS + TITLE -->
                <div class="flex items-center gap-4">
                    <button class="toggle-status flex items-center justify-center transition-transform duration-200">
                        <span class="status-icon flex items-center justify-center w-6 h-6 relative">
                            <x-memory-checkbox-blank class="w-5 h-5 text-gray-400 absolute top-0 left-0 {{ $task->status === 'undone' ? '' : 'hidden' }}" data-status="undone"/>
                            <x-memory-checkbox-intermediate-variant class="w-5 h-5 text-yellow-500 absolute top-0 left-0 {{ $task->status === 'progress' ? '' : 'hidden' }}" data-status="progress"/>
                            <x-memory-checkbox-marked class="w-5 h-5 text-green-500 absolute top-0 left-0 {{ $task->status === 'done' ? '' : 'hidden' }}" data-status="done"/>
                        </span>
                    </button>
                    <span class="title cursor-text {{ $task->status === 'done' ? 'line-through' : '' }}">
                        {{ $task->title }}
                    </span>
                </div>

         
                <!-- RIGHT: BADGES (Delete + Time Left + Importance) -->
                <div class="flex items-center gap-2">
                    <!-- DELETE BADGE -->
                    <span class="task-badge bg-red-600 text-white rounded-full px-3 py-1 cursor-pointer hover-visible"
                        onclick="deleteTask({{ $task->id }})">
                        ×
                    </span>

                    <!-- TIME LEFT BADGE -->
                    <span class="task-badge bg-gray-700 text-white rounded-full px-3 py-1 cursor-pointer"
                        onclick="openTimePicker({{ $task->id }})">
                        {{ $timeLeftStr }}
                    </span>
                    <input type="datetime-local" id="due-{{ $task->id }}" class="hidden"
                        value="{{ $task->due_time ? Carbon::parse($task->due_time)->format('Y-m-d\TH:i') : '' }}">

                    <!-- IMPORTANCE BADGE -->
                    <span class="task-badge {{ $task->importance == 'low' ? 'bg-green-600' : ($task->importance == 'medium' ? 'bg-yellow-500' : 'bg-red-600') }} text-white rounded-full px-3 py-1 cursor-pointer"
                        onclick="toggleImportance({{ $task->id }})">
                        {{ ucfirst($task->importance) }}
                    </span>
                </div>
            </div>
        @endforeach
        </div>
    </div>
</div>

<script>
const csrf = '{{ csrf_token() }}';

// STATUS TOGGLE
document.querySelectorAll('.task').forEach(task => {
    const btn = task.querySelector('.toggle-status');
    const iconContainer = btn.querySelector('.status-icon');

    btn.onclick = async () => {
        const statuses = ['undone','progress','done'];
        const currentIndex = statuses.indexOf(task.dataset.status);
        const nextStatus = statuses[(currentIndex+1) % statuses.length];

        const res = await fetch(`/tasks/${task.dataset.id}/toggle-status`, {
            method: 'PATCH',
            headers: {'X-CSRF-TOKEN': csrf,'Content-Type':'application/json'},
            body: JSON.stringify({status: nextStatus})
        });
        const data = await res.json();
        task.dataset.status = data.status;

        // toggle visibility of icons
        iconContainer.querySelectorAll('[data-status]').forEach(el => el.classList.add('hidden'));
        iconContainer.querySelector(`[data-status="${data.status}"]`).classList.remove('hidden');

        // animation
        btn.classList.add('status-toggle-animate');
        setTimeout(()=>btn.classList.remove('status-toggle-animate'),200);

        // title line-through
        task.querySelector('.title').classList.toggle('line-through',data.status==='done');
    };
});
document.querySelectorAll('.title').forEach(titleEl => {
    titleEl.addEventListener('click', () => {
        const task = titleEl.closest('.task');
        const id = task.dataset.id;
        const current = titleEl.textContent.trim();

        const input = document.createElement('input');
        input.type = 'text';
        input.value = current;
        input.className = 'rounded bg-[#121826] text-white outline-none px-1';
        input.style.width = (current.length * 1.1) + 'em';

        titleEl.replaceWith(input);
        input.focus();

        // on blur or Enter, save the new title
        const save = async () => {
            const newTitle = input.value.trim();
            await fetch(`/tasks/${id}`, {
                method: 'PATCH',
                headers: {'X-CSRF-TOKEN': csrf, 'Content-Type': 'application/json'},
                body: JSON.stringify({ title: newTitle })
            });
            titleEl.textContent = newTitle;
            input.replaceWith(titleEl);
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    });
});
// DELETE BUTTON
function deleteTask(id){
    fetch(`/tasks/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':csrf}})
        .then(()=>document.querySelector(`.task[data-id='${id}']`).remove());
}

// TIME PICKER
function openTimePicker(id){
    const picker=document.getElementById('due-'+id);
    picker.showPicker();
    picker.onchange=async()=>{await updateDueTime(id,picker.value)};
}
async function updateDueTime(id,value){
    const res=await fetch(`/tasks/${id}/update-due`,{
        method:'PATCH',
        headers:{'X-CSRF-TOKEN':csrf,'Content-Type':'application/json'},
        body:JSON.stringify({due_time:value})
    });
    const data=await res.json();
    document.querySelector(`.task[data-id='${id}'] .task-badge:nth-child(2)`).textContent=data.time_left;
}

// IMPORTANCE TOGGLE
async function toggleImportance(id){
    const res=await fetch(`/tasks/${id}/toggle-importance`,{
        method:'PATCH',
        headers:{'X-CSRF-TOKEN':csrf,'Content-Type':'application/json'}
    });
    const data=await res.json();
    const taskEl=document.querySelector(`.task[data-id='${id}']`);
    taskEl.dataset.importance=data.importance;
    const badge=taskEl.querySelector('.task-badge:last-child');
    badge.textContent=data.importance.charAt(0).toUpperCase()+data.importance.slice(1);
    badge.className='task-badge '+(data.importance==='low'?'bg-green-600':data.importance==='medium'?'bg-yellow-500':'bg-red-600');
}

// SEARCH
document.getElementById('search').addEventListener('input',(event)=>{
    const value=event.target.value.toLowerCase();
    document.querySelectorAll('.task').forEach(task=>{
        const title=task.querySelector('.title').textContent.toLowerCase();
        task.style.display=title.includes(value)?'flex':'none';
    });
});

// SORTING
let sortType='time', sortAsc=true;
function toggleSortType(){sortType=sortType==='time'?'importance':'time';document.getElementById('sortTypeBtn').textContent=sortType.charAt(0).toUpperCase()+sortType.slice(1);sortTasks();}
function toggleSortOrder(){sortAsc=!sortAsc;document.getElementById('sortOrderBtn').textContent=sortAsc?'↑':'↓';sortTasks();}
function sortTasks(){
    const container=document.getElementById('tasks');
    const tasks=Array.from(container.children);
    if(sortType==='time'){tasks.sort((a,b)=>{
        const aDue=a.querySelector('input[type=datetime-local]').value;
        const bDue=b.querySelector('input[type=datetime-local]').value;
        if(!aDue)return 1;if(!bDue)return -1;
        return sortAsc?new Date(aDue)-new Date(bDue):new Date(bDue)-new Date(aDue);
    });}else{const order={'low':1,'medium':2,'high':3};tasks.sort((a,b)=>sortAsc?(order[a.dataset.importance]||0)-(order[b.dataset.importance]||0):(order[b.dataset.importance]||0)-(order[a.dataset.importance]||0));}
    tasks.forEach(t=>container.appendChild(t));
}
</script>
</x-app-layout>