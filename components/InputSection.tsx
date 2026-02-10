import React, { useRef } from 'react';
import { FileUp, FileText, FileCode, ScrollText } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  isProcessing: boolean;
  onAnalyze: () => void;
  mode: 'raw' | 'spec';
  onModeChange: (mode: 'raw' | 'spec') => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  value, 
  onChange, 
  isProcessing, 
  onAnalyze,
  mode,
  onModeChange 
}) => {
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

  const getPlaceholder = () => {
    if (mode === 'spec') {
        return `Paste your PDF Specification here...\n\nExample:\n## pdf_spec\n- Model: gemini-2.5-flash\n### Content\n# Application Form...`;
    }
    return `Paste your application form text here (Markdown, Text)...\n\nExample:\nName: [Enter Name]\nAddress: [Enter Address]`;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-4 pt-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              {mode === 'raw' ? <FileText className="w-4 h-4" /> : <ScrollText className="w-4 h-4" />}
              Source
            </h2>
            <div className="flex gap-2 mb-3">
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
          
          <div className="flex px-4 gap-6">
              <button 
                onClick={() => onModeChange('raw')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                    mode === 'raw' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Raw Document
              </button>
              <button 
                onClick={() => onModeChange('spec')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                    mode === 'spec' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                PDF Spec
              </button>
          </div>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm leading-relaxed text-gray-800"
          placeholder={getPlaceholder()}
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
