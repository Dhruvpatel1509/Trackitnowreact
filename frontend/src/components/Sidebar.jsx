import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { LayoutDashboard, ListTodo, X } from 'lucide-react';

export function Sidebar({ selectedDate, onDateSelect, activeTab, onTabChange, onClose }) {
    return (
        <div className="w-full md:w-80 h-full bg-gray-900 text-white flex flex-col border-r border-gray-800 relative">

            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
                <X size={24} />
            </button>

            <div className="p-6 hidden md:block">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-blue-500">✅</span> Trackit
                </h1>
            </div>

            <div className="px-4 mt-12 md:mt-0">
                <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg border border-gray-700 flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={onDateSelect}
                        className="text-white m-0"
                        modifiersClassNames={{
                            selected: 'bg-blue-600 text-white rounded-full font-bold hover:bg-blue-600',
                            today: 'text-blue-400 font-bold',
                        }}
                        styles={{
                            caption: { color: 'white' },
                            head_cell: { color: '#9CA3AF' }, // gray-400
                            day: { color: 'white', borderRadius: '9999px' },
                            nav_button: { color: 'white' }
                        }}
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <button
                    onClick={() => onTabChange('tasks')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                        }`}
                >
                    <ListTodo size={20} />
                    <span>Tasks</span>
                </button>
                <button
                    onClick={() => onTabChange('analytics')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                        }`}
                >
                    <LayoutDashboard size={20} />
                    <span>Analytics</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
                <p>{format(selectedDate || new Date(), 'EEEE, MMMM do')}</p>
            </div>
        </div>
    );
}
