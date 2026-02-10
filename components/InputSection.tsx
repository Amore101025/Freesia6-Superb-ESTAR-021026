import React, { useRef } from 'react';
import { FileUp, FileText, X } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  isProcessing: boolean;
  onAnalyze: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ value, onChange, isProcessing, onAnalyze }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".md")) {
      const text = await file.text();
      onChange(text);
    } else {
        alert("For this demo, please use .txt or .md files. Copy pasting from DOCX is recommended.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Application Form Source
        </h2>
        <div className="flex gap-2">
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".txt,.md"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors"
          >
            <FileUp className="w-3 h-3" />
            Upload
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm leading-relaxed text-gray-800"
          placeholder="Paste your application form text here (Markdown, Text)..."
        />
        
        <div className="absolute bottom-4 right-4">
          <button
            onClick={onAnalyze}
            disabled={isProcessing || !value.trim()}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-lg transition-all
              ${isProcessing || !value.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'}
            `}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Generate Dynamic PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
