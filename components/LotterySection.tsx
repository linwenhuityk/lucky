
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCcw, History, Settings2, Sparkles } from 'lucide-react';
import { Employee, Winner } from '../types';

interface Props {
  employees: Employee[];
}

const LotterySection: React.FC<Props> = ({ employees }) => {
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([...employees]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [winner, setWinner] = useState<Employee | null>(null);
  const [history, setHistory] = useState<Winner[]>([]);
  const [prizeName, setPrizeName] = useState('');

  // Update pool if original list changes
  useEffect(() => {
    setAvailableEmployees([...employees]);
  }, [employees]);

  const spin = () => {
    if (availableEmployees.length === 0) {
      alert('所有人都已經中過獎了！');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    
    const duration = 2000; // 2 seconds
    const interval = 80;
    const startTime = Date.now();

    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        setDisplayIndex(Math.floor(Math.random() * availableEmployees.length));
      } else {
        clearInterval(spinInterval);
        const finalWinnerIndex = Math.floor(Math.random() * availableEmployees.length);
        const finalWinner = availableEmployees[finalWinnerIndex];
        
        setWinner(finalWinner);
        setHistory(prev => [{
          name: finalWinner.name,
          timestamp: new Date(),
          prize: prizeName || '神秘大獎'
        }, ...prev]);

        if (!allowDuplicate) {
          setAvailableEmployees(prev => prev.filter(e => e.id !== finalWinner.id));
        }

        setIsSpinning(false);
        setPrizeName('');
      }
    }, interval);
  };

  const resetLottery = () => {
    setAvailableEmployees([...employees]);
    setHistory([]);
    setWinner(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Settings and Display */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center">
            <Trophy className="w-6 h-6 mr-2 text-amber-500" />
            幸運抽籤筒
          </h2>

          <div className="max-w-md mx-auto mb-10">
            <input 
              type="text"
              placeholder="輸入當前獎項 (例如: 頭獎 iPhone 16)"
              className="w-full text-center text-lg px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 outline-none mb-4"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              disabled={isSpinning}
            />
            
            <div className="relative h-32 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              {!isSpinning && !winner && (
                <p className="text-slate-400 animate-pulse">準備好抽出一位幸運兒了嗎？</p>
              )}
              {isSpinning && (
                <div className="text-4xl font-black text-indigo-600 tracking-tighter transition-all">
                  {availableEmployees[displayIndex]?.name}
                </div>
              )}
              {!isSpinning && winner && (
                <div className="animate-bounce-in text-5xl font-black text-amber-600 tracking-tighter flex flex-col items-center">
                  <Sparkles className="w-8 h-8 text-amber-400 mb-1" />
                  {winner.name}
                  <p className="text-sm font-bold text-amber-500 mt-2 uppercase tracking-widest">Congratulations!</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={spin}
              disabled={isSpinning || availableEmployees.length === 0}
              className={`px-10 py-4 rounded-full text-lg font-bold shadow-lg transform transition-all active:scale-95 ${
                isSpinning || availableEmployees.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
              }`}
            >
              {isSpinning ? '抽取中...' : '立即抽取'}
            </button>
            <button
              onClick={resetLottery}
              className="px-6 py-4 rounded-full text-slate-500 hover:bg-slate-100 transition-colors flex items-center"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              重新開始
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center">
            <Settings2 className="w-5 h-5 mr-2 text-indigo-600" />
            抽籤設定
          </h3>
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
            <div 
              onClick={() => !isSpinning && setAllowDuplicate(!allowDuplicate)}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${allowDuplicate ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${allowDuplicate ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-medium text-slate-700">允許重複中獎 (放回抽籤池)</span>
          </div>
          <p className="mt-4 text-xs text-slate-400">目前抽籤池剩餘人數: <span className="font-bold text-indigo-600">{availableEmployees.length}</span> / {employees.length}</p>
        </div>
      </div>

      {/* Right Column: History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
        <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center">
          <History className="w-5 h-5 mr-2 text-indigo-600" />
          得獎紀錄
        </h3>
        <div className="flex-1 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">暫無中獎紀錄</div>
          ) : (
            history.map((win, idx) => (
              <div key={idx} className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center group hover:bg-indigo-100 transition-all">
                <div>
                  <div className="font-bold text-indigo-900">{win.name}</div>
                  <div className="text-[10px] text-indigo-400">{win.prize}</div>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  {win.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LotterySection;
