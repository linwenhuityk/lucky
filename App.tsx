
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Users, 
  Trophy, 
  LayoutGrid, 
  FileText, 
  PlusCircle, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Download
} from 'lucide-react';
import { Employee, Tab, Winner, Group } from './types';
import LotterySection from './components/LotterySection';
import GroupingSection from './components/GroupingSection';
import NameInputSection from './components/NameInputSection';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('names');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleUpdateNames = (names: string[]) => {
    const newEmployees = names.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name: name.trim()
    })).filter(e => e.name !== '');
    setEmployees(newEmployees);
  };

  const clearNames = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      setEmployees([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar / Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">HR Pro <span className="text-indigo-600">Toolbox</span></span>
            </div>

            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('names')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'names' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                名單管理
              </button>
              <button
                disabled={employees.length === 0}
                onClick={() => setActiveTab('lottery')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'lottery' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                獎品抽籤
              </button>
              <button
                disabled={employees.length === 0}
                onClick={() => setActiveTab('grouping')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'grouping' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                自動分組
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'names' && (
          <NameInputSection 
            employees={employees} 
            onUpdateNames={handleUpdateNames} 
            onClear={clearNames}
          />
        )}
        
        {activeTab === 'lottery' && (
          <LotterySection employees={employees} />
        )}

        {activeTab === 'grouping' && (
          <GroupingSection employees={employees} />
        )}

        {/* Empty State Overlay */}
        {employees.length === 0 && activeTab !== 'names' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <PlusCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">請先匯入名單後再開始</p>
            <button 
              onClick={() => setActiveTab('names')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              去匯入名單
            </button>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} HR Pro Toolbox - 您的智能人事小助手
        </div>
      </footer>
    </div>
  );
};

export default App;
