import React, { useState } from 'react';
import { LayoutGrid, Users, Sparkles, Download, Shuffle, FileSpreadsheet, FileText } from 'lucide-react';
import { Employee, Group } from '../types';
import { getCreativeGroupNames } from '../geminiService';

interface Props {
  employees: Employee[];
}

const GroupingSection: React.FC<Props> = ({ employees }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const generateGroups = async () => {
    setIsProcessing(true);
    
    // Shuffle the names first
    const shuffled = shuffleArray(employees.map(e => e.name));
    
    const totalGroups = Math.ceil(shuffled.length / groupSize);
    
    // Get creative names from Gemini if enabled
    // Fix: Consolidate the assignment to ensure the 'names' variable is correctly typed and avoids unknown[] mismatch.
    const names: string[] = useAI 
      ? await getCreativeGroupNames(totalGroups) 
      : Array.from({ length: totalGroups }, (_, i) => `Team ${i + 1}`);

    const newGroups: Group[] = [];
    for (let i = 0; i < totalGroups; i++) {
      const start = i * groupSize;
      const end = Math.min(start + groupSize, shuffled.length);
      newGroups.push({
        id: `group-${i}`,
        name: names[i] || `Team ${i + 1}`,
        members: shuffled.slice(start, end)
      });
    }

    setGroups(newGroups);
    setIsProcessing(false);
  };

  const exportGroupsAsText = () => {
    const text = groups.map(g => `${g.name}:\n${g.members.join(', ')}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, 'grouping-results.txt');
  };

  const exportGroupsAsCSV = () => {
    // CSV Header
    let csvContent = "組別名稱,成員名單\n";
    groups.forEach(g => {
      // Escape quotes and join members with a different character or just comma
      const membersStr = `"${g.members.join(', ')}"`;
      csvContent += `${g.name},${membersStr}\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'grouping-results.csv');
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">每組人數</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="2" 
                max={Math.max(2, employees.length)} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xl font-bold text-indigo-600 w-12 text-center">{groupSize}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 h-10 px-4 bg-slate-50 rounded-xl border border-slate-100">
            <div 
              onClick={() => setUseAI(!useAI)}
              className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${useAI ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${useAI ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-xs font-semibold text-slate-600 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
              AI 創意隊名
            </span>
          </div>

          <button
            onClick={generateGroups}
            disabled={isProcessing}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
          >
            {isProcessing ? '分組中...' : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                開始自動分組
              </>
            )}
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          總人數: {employees.length} &bull; 預計分成 {Math.ceil(employees.length / groupSize)} 組
        </p>
      </div>

      {groups.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              分組結果
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={exportGroupsAsText}
                className="text-slate-600 hover:text-slate-700 text-sm font-medium flex items-center px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                下載文字檔
              </button>
              <button 
                onClick={exportGroupsAsCSV}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center px-4 py-2 rounded-lg hover:bg-emerald-50 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                下載 CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {groups.map((group, idx) => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg text-xs mr-2 font-black italic">
                      {idx + 1}
                    </span>
                    {group.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                    {group.members.length} 人
                  </span>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {group.members.map((member, mIdx) => (
                      <li key={mIdx} className="text-slate-600 flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 opacity-50"></div>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupingSection;