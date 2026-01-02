
import React, { useState, useRef, useMemo } from 'react';
import { Upload, Clipboard, List, Trash2, UserPlus, Beaker, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Employee } from '../types';

interface Props {
  employees: Employee[];
  onUpdateNames: (names: string[]) => void;
  onClear: () => void;
}

const NameInputSection: React.FC<Props> = ({ employees, onUpdateNames, onClear }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模擬名單數據
  const mockNames = [
    "陳小明", "林美玲", "王大為", "張淑芬", "李建國", 
    "吳志強", "劉秀英", "蔡嘉豪", "楊雅婷", "許哲瑋",
    "鄭家齊", "謝宜君", "黃柏翰", "郭芯妤", "曾冠宇",
    "彭思嘉", "詹子晴", "徐俊宏", "羅宇軒", "宋曉薇"
  ];

  const handleLoadMock = () => {
    onUpdateNames(mockNames);
  };

  const handlePaste = () => {
    const names = inputText.split(/[\n,;]+/).filter(n => n.trim() !== '');
    onUpdateNames([...employees.map(e => e.name), ...names]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content.split(/[\r\n,;]+/).filter(n => n.trim() !== '');
      onUpdateNames([...employees.map(e => e.name), ...names]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 偵測重複項
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.name] = (counts[e.name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [employees]);

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(employees.map(e => e.name)));
    onClear(); // 先清空目前的
    onUpdateNames(uniqueNames);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />
              匯入名單
            </h2>
            <button 
              onClick={handleLoadMock}
              className="flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Beaker className="w-3.5 h-3.5 mr-1" />
              載入範例名單
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">上傳 CSV / TXT 檔案</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600">點擊或拖放檔案至此</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".csv,.txt"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 uppercase tracking-wider text-xs font-semibold">或者</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">手動貼上姓名</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="貼上姓名，例如：&#10;張小明&#10;王大槌&#10;李美華"
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              ></textarea>
              <button 
                onClick={handlePaste}
                className="w-full mt-3 flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                匯入所選內容
              </button>
            </div>
          </div>
        </div>

        {/* List View Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <List className="w-5 h-5 mr-2 text-indigo-600" />
              目前名單 ({employees.length})
            </h2>
            <div className="flex space-x-2">
              {duplicateNames.size > 0 && (
                <button 
                  onClick={handleRemoveDuplicates}
                  className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center transition-colors"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  移除重複 ({duplicateNames.size})
                </button>
              )}
              {employees.length > 0 && (
                <button 
                  onClick={onClear}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  清空
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {employees.length === 0 ? (
              <div className="text-center py-20 text-slate-400 italic">尚未匯入任何成員</div>
            ) : (
              employees.map((emp, i) => (
                <div 
                  key={emp.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all group ${
                    duplicateNames.has(emp.name) 
                      ? 'bg-red-50 border-red-100 shadow-sm' 
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border mr-3 ${
                      duplicateNames.has(emp.name) ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-slate-400 border-slate-200'
                    }`}>
                      {i + 1}
                    </span>
                    <span className={`font-medium ${duplicateNames.has(emp.name) ? 'text-red-700' : 'text-slate-700'}`}>
                      {emp.name}
                    </span>
                  </div>
                  {duplicateNames.has(emp.name) && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">重複</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInputSection;
