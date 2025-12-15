import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8 text-center relative">
        <h1 className="text-4xl md:text-5xl font-black text-red-600 tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" 
            style={{ textShadow: '3px 3px 0 #000' }}>
          小新的理財大作戰
        </h1>
        <div className="absolute top-0 right-0 transform rotate-12 bg-yellow-400 border-2 border-black px-2 py-1 rounded-lg shadow-[4px_4px_0_0_#000] hidden md:block">
          <span className="font-bold text-sm">動感光波！</span>
        </div>
      </header>
      <main className="grid gap-6">
        {children}
      </main>
      <footer className="mt-12 text-center text-gray-500 font-bold text-sm">
        <p>© 野原家財務部 | 記得不要亂買減肥用品喔～</p>
      </footer>
    </div>
  );
};
