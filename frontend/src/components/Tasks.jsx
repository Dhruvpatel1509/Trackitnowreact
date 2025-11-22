import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TaskCard } from './TaskCard';

export function Tasks({ selectedDate }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ name: '', points: 1, isRecurring: false });

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const fetchTasks = async () => {
        setLoading(true);

        // 1. Ensure recurring tasks exist for this date
        await ensureRecurringTasks(dateStr);

        // 2. Fetch tasks
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('date', dateStr)
            .eq('is_recurring', false)
            .eq('is_visible', true)
            .order('id');

        if (data) setTasks(data);
        setLoading(false);
    };

    const ensureRecurringTasks = async (date) => {
        // Get templates created on or before this date
        const { data: templates } = await supabase
            .from('tasks')
            .select('*')
            .eq('is_recurring', true)
            .lte('date', date);

        if (!templates?.length) return;

        for (const template of templates) {
            // Check if instance exists
            const { data: existing } = await supabase
                .from('tasks')
                .select('id')
                .eq('parent_id', template.id)
                .eq('date', date)
                .maybeSingle();

            if (!existing) {
                // Create instance
                await supabase.from('tasks').insert({
                    name: template.name,
                    points: template.points,
                    date: date,
                    is_recurring: false,
                    is_completed: false,
                    parent_id: template.id,
                    is_visible: true
                });
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.name) return;

        await supabase.from('tasks').insert({
            name: newTask.name,
            points: newTask.points,
            date: dateStr,
            is_recurring: newTask.isRecurring,
            is_completed: false,
            is_visible: true
        });

        setNewTask({ name: '', points: 1, isRecurring: false });
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, [selectedDate]);

    const totalPoints = tasks.reduce((acc, t) => acc + t.points, 0);
    const completedPoints = tasks.filter(t => t.is_completed).reduce((acc, t) => acc + t.points, 0);
    const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

    return (
        <div className="w-full max-w-full mx-auto px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Tasks</h2>
                <p className="text-gray-400">for {format(selectedDate, 'MMMM do, yyyy')}</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-right text-sm text-gray-400 mb-8">
                {completedPoints} / {totalPoints} Points
            </div>

            {/* Task List */}
            <div className="space-y-4 mb-12">
                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-800 rounded-xl">
                        No tasks for this day. Add one below!
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onUpdate={fetchTasks}
                            onDelete={fetchTasks}
                        />
                    ))
                )}
            </div>

            {/* Create Form */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Task</h3>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newTask.name}
                            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="number"
                            value={newTask.points}
                            onChange={e => setNewTask({ ...newTask, points: parseFloat(e.target.value) })}
                            step="0.5"
                            min="0.5"
                            className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newTask.isRecurring}
                                onChange={e => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-gray-700"
                            />
                            Daily Recurring
                        </label>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} />
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
