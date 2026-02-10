import React from 'react';
import { Bot, FileDown, Code } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">FormAgent AI</h1>
            <p className="text-xs text-gray-500">Unstructured Text to Dynamic PDF</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium">fpdf2 Agent Ready</span>
            </div>
        </div>
      </div>
    </header>
  );
};
