import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function TaskCard({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(task.name);
    const [points, setPoints] = useState(task.points);

    const handleToggle = async () => {
        const { error } = await supabase
            .from('tasks')
            .update({ is_completed: !task.is_completed })
            .eq('id', task.id);

        if (!error) onUpdate();
    };

    const handleSave = async () => {
        const { error } = await supabase
            .from('tasks')
            .update({ name, points })
            .eq('id', task.id);

        if (!error) {
            setIsEditing(false);
            onUpdate();
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            // Check if it's a recurring instance
            if (task.parent_id) {
                // Soft delete
                await supabase.from('tasks').update({ is_visible: false }).eq('id', task.id);
            } else {
                // Hard delete
                await supabase.from('tasks').delete().eq('id', task.id);
            }
            onDelete();
        }
    };

    return (
        <div className={`group relative p-4 rounded-xl border transition-all duration-200 ${task.is_completed
                ? 'bg-green-900/20 border-green-800'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                    />
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(parseFloat(e.target.value))}
                        step="0.5"
                        className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                    />
                    <button onClick={handleSave} className="p-1 text-green-400 hover:bg-green-900/30 rounded">
                        <Check size={16} />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-1 text-red-400 hover:bg-red-900/30 rounded">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={handleToggle}
                        className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                    />

                    <div className="flex-1">
                        <h3 className={`font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {task.name}
                        </h3>
                        <span className="text-xs text-gray-400">{task.points} pts</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
