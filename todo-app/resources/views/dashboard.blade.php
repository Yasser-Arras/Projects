 <style>
     
        .floating-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1a73e8;
            color: white;
            padding: 16px 20px;
            border-radius: 50px;
            font-size: 24px;
            text-decoration: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s ease;
        }

        .floating-btn:hover {
            background: #155ab6;
        }
    </style>
<x-app-layout>
   
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    {{ __("You're logged in!") }}
                </div>
            </div>
        </div>
    </div>
      <a href="{{ route('tasks.index') }}" class="floating-btn">
        📝 Tasks
        </a>
</x-app-layout>
