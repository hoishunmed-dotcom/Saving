import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Trash2, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  goals: Goal[];
  onAddGoal: (g: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateProgress: (id: string, amount: number) => void;
}

export const GoalList: React.FC<Props> = ({ goals, onAddGoal, onDeleteGoal, onUpdateProgress }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    onAddGoal({
      id: uuidv4(),
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      icon: '🎁'
    });
    setNewGoalName('');
    setNewGoalTarget('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
        return (
          <div key={goal.id} className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-black text-lg flex items-center gap-2">
                {goal.icon} {goal.name}
              </span>
              <button 
                onClick={() => onDeleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="w-full bg-gray-200 h-6 border-2 border-black rounded-full overflow-hidden relative mb-2">
              <div 
                className="h-full bg-green-400 border-r-2 border-black transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black z-10">
                {percent}%
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold">
              <span>${goal.currentAmount} / ${goal.targetAmount}</span>
              <button 
                 onClick={() => {
                     const amt = prompt("要存入多少錢？");
                     if(amt) onUpdateProgress(goal.id, parseFloat(amt));
                 }}
                 className="bg-blue-400 text-white px-3 py-1 border-2 border-black rounded-lg hover:bg-blue-500 shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:shadow-none"
              >
                存錢
              </button>
            </div>
          </div>
        );
      })}

      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-yellow-50 border-4 border-dashed border-black rounded-xl p-4">
           <h3 className="font-bold mb-2">新增願望清單</h3>
           <input 
             className="w-full mb-2 p-2 border-2 border-black rounded"
             placeholder="想要買什麼？(例如：動感超人公仔)"
             value={newGoalName}
             onChange={e => setNewGoalName(e.target.value)}
           />
           <input 
             className="w-full mb-2 p-2 border-2 border-black rounded"
             type="number"
             placeholder="目標金額"
             value={newGoalTarget}
             onChange={e => setNewGoalTarget(e.target.value)}
           />
           <div className="flex gap-2">
             <button type="submit" className="flex-1 bg-green-400 border-2 border-black rounded font-bold py-1">確定</button>
             <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-300 border-2 border-black rounded font-bold py-1">取消</button>
           </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-4 border-dashed border-gray-400 text-gray-500 rounded-xl font-bold hover:border-black hover:text-black hover:bg-white transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle /> 新增目標
        </button>
      )}
    </div>
  );
};
