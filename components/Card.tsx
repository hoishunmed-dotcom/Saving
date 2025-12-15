import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'red' | 'yellow' | 'blue';
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', color = 'white', title }) => {
  const bgColors = {
    white: 'bg-white',
    red: 'bg-red-500 text-white',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-400 text-white',
  };

  return (
    <div className={`
      ${bgColors[color]} 
      border-4 border-black rounded-2xl 
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
      p-6 relative transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
      ${className}
    `}>
      {title && (
        <h2 className={`text-2xl font-black mb-4 ${color === 'white' || color === 'yellow' ? 'text-black' : 'text-white'}`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
