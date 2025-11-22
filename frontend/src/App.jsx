import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Tasks } from './components/Tasks';
import { Analytics } from './components/Analytics';
import { Menu } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-500">✅</span> Trackit
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar (Drawer on Mobile, Static on Desktop) */}
      <div className={`
        fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm transition-transform duration-300 md:relative md:translate-x-0 md:bg-transparent md:backdrop-blur-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:block md:w-auto
      `}>
        <Sidebar
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setIsSidebarOpen(false); // Close sidebar on mobile selection
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
        {activeTab === 'tasks' ? (
          <Tasks selectedDate={selectedDate || new Date()} />
        ) : (
          <Analytics />
        )}
      </main>
    </div>
  );
}

export default App;
