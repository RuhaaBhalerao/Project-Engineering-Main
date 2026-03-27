/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { Plus, Check, X, Trash2, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans selection:bg-blue-100">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          </div>
          <p className="text-gray-500">Stay organized and focused on your goals.</p>
        </header>

        {/* Input Section */}
        <form onSubmit={addTask} className="relative mb-10 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full h-14 pl-5 pr-14 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-lg"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* Filters & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 border border-gray-200 rounded-xl shadow-sm">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-500 font-medium">
            {stats.active} {stats.active === 1 ? 'task' : 'tasks'} remaining
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <span
                    className={`flex-grow text-lg transition-all ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {task.title}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You're all caught up! Add a task to get started." 
                    : `No ${filter} tasks to show.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        {tasks.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-900 text-lg">{stats.total}</span>
                <span>Total</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-blue-600 text-lg">{stats.active}</span>
                <span>Active</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-green-600 text-lg">{stats.completed}</span>
                <span>Done</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
