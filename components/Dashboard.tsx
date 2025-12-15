import React from 'react';
import { FinancialSummary, Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  summary: FinancialSummary;
  transactions: Transaction[];
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#6b7280'];

export const Dashboard: React.FC<Props> = ({ summary, transactions }) => {
  // Aggregate expenses by category for the chart
  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-green-100 p-4 border-4 border-black rounded-xl">
            <h3 className="font-bold text-gray-600">總收入</h3>
            <p className="text-2xl font-black text-green-600">${summary.totalIncome}</p>
         </div>
         <div className="bg-red-100 p-4 border-4 border-black rounded-xl">
            <h3 className="font-bold text-gray-600">總支出</h3>
            <p className="text-2xl font-black text-red-600">${summary.totalExpense}</p>
         </div>
      </div>
      
      <div className="bg-yellow-100 p-4 border-4 border-black rounded-xl text-center">
         <h3 className="font-bold text-gray-600">目前結餘</h3>
         <p className="text-4xl font-black text-blue-600">${summary.balance}</p>
      </div>

      <div className="h-64 w-full bg-white border-4 border-black rounded-xl p-2 relative">
         <h3 className="absolute top-2 left-2 font-bold text-sm bg-yellow-300 px-2 border-2 border-black rounded">花費分佈</h3>
         {expenseData.length > 0 ? (
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={expenseData}
                 cx="50%"
                 cy="50%"
                 innerRadius={40}
                 outerRadius={80}
                 paddingAngle={5}
                 dataKey="value"
               >
                 {expenseData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                 ))}
               </Pie>
               <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: '2px solid black', fontWeight: 'bold' }}
               />
               <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}}/>
             </PieChart>
           </ResponsiveContainer>
         ) : (
           <div className="flex items-center justify-center h-full text-gray-400 font-bold">
             還沒有支出紀錄喔～
           </div>
         )}
      </div>
    </div>
  );
};
