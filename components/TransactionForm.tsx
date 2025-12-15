import React, { useState } from 'react';
import { TransactionType, Transaction } from '../types';
import { Plus, Minus, PiggyBank } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onAdd: (t: Transaction) => void;
}

export const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('飲食');

  const categories = type === TransactionType.EXPENSE 
    ? ['飲食', '交通', '購物', '娛樂', '居住', '雜項']
    : ['薪水', '獎金', '投資', '零用錢', '其他'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      id: uuidv4(),
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 justify-center mb-4">
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 py-2 px-4 rounded-xl border-4 border-black font-black text-lg transition-all
            ${type === TransactionType.EXPENSE 
              ? 'bg-red-500 text-white shadow-[4px_4px_0_0_#000] translate-x-[2px] translate-y-[2px]' 
              : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          <div className="flex items-center justify-center gap-2">
             <Minus size={20}/> 支出
          </div>
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 py-2 px-4 rounded-xl border-4 border-black font-black text-lg transition-all
            ${type === TransactionType.INCOME 
              ? 'bg-green-500 text-white shadow-[4px_4px_0_0_#000] translate-x-[2px] translate-y-[2px]' 
              : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
           <div className="flex items-center justify-center gap-2">
             <Plus size={20}/> 收入
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block font-bold mb-1 ml-1">金額 ($)</label>
            <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 ring-yellow-300 font-bold text-xl"
            placeholder="0"
            required
            />
        </div>
        <div>
            <label className="block font-bold mb-1 ml-1">分類</label>
            <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 ring-yellow-300 font-bold bg-white"
            >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1 ml-1">備註</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 ring-yellow-300 font-bold"
          placeholder="例如：小熊餅乾"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl border-4 border-black rounded-xl shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <PiggyBank /> 記下來！
      </button>
    </form>
  );
};
